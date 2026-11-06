/* Analytic surface waves: each pointer sample emits a damped travelling wave.
   Surface normals refract the environment and move specular highlights. */
export function createWaterEffect(root: HTMLElement): () => void {
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  const vertex = `attribute vec2 a_position;
    void main(){gl_Position=vec4(a_position,0.,1.);}`
  const fragment = `precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_motion;
    uniform vec3 u_ripples[12];
    float square(float x){return x*x;}
    float surface(vec2 p){
      float t=u_time*u_motion;
      float h=sin(p.x*5.+p.y*3.+t*.22)*.009+cos(p.y*7.-p.x*2.-t*.18)*.007;
      vec2 b=p-vec2(u_resolution.x/u_resolution.y*.76,.53);
      float a=atan(b.y,b.x);
      float r=length(b);
      float rim=.285+sin(a*3.+t*.16)*.023+cos(a*5.-t*.12)*.012;
      h+=exp(-square((r-rim)/.029))*.064;
      h+=exp(-pow(r/.28,4.))*.026;
      for(int i=0;i<12;i++){
        vec3 w=u_ripples[i];
        float age=u_time-w.z;
        float d=length(p-w.xy);
        float front=age*.24;
        float envelope=exp(-square((d-front)/.095))*exp(-age*.8);
        h+=sin(d*77.-age*17.)*envelope*.013*step(0.,age)*step(age,7.);
      }
      return h;
    }
    void main(){
      vec2 uv=gl_FragCoord.xy/u_resolution;
      float aspect=u_resolution.x/u_resolution.y;
      vec2 p=vec2(uv.x*aspect,uv.y);
      float e=.003;
      float h=surface(p);
      vec2 slope=vec2(surface(p+vec2(e,0.))-h,surface(p+vec2(0.,e))-h)/e;
      vec3 n=normalize(vec3(-slope*1.6,1.));
      vec2 refract=p+slope*.025;
      float a=sin(refract.x*12.+sin(refract.y*9.+u_time*.08)*1.3);
      float b=cos(refract.y*13.-sin(refract.x*7.)*1.2);
      float caustic=pow(max(0.,1.-abs(a+b)*.9),8.);
      vec3 col=mix(vec3(.72,.80,.81),vec3(.89,.95,.96),uv.y);
      col+=caustic*.025;
      float spec=pow(max(0.,dot(n,normalize(vec3(-.7,.8,1.2)))),35.);
      float spec2=pow(max(0.,dot(n,normalize(vec3(.9,-.15,.7)))),65.);
      float reflected=sin(n.x*4.+n.y*3.)*.5+.5;
      vec2 center=p-vec2(aspect*.76,.53);
      float ring=exp(-square((length(center)-(.285+sin(atan(center.y,center.x)*3.+u_time*.16*u_motion)*.023+cos(atan(center.y,center.x)*5.-u_time*.12*u_motion)*.012))/.048));
      vec3 metal=mix(vec3(.24,.41,.44),vec3(.91,.99,1.),reflected);
      metal+=spec*.8+spec2*.55;
      metal=mix(metal,vec3(.08,.78,.85),max(0.,-n.y)*.22);
      col=mix(col,metal,ring*.85);
      col+=spec*.16+spec2*.12;
      col+=vec3(-.10,.02,.035)*min(length(slope),1.)*.18;
      float vignette=1.-smoothstep(.1,.85,length(uv-vec2(.6,.55)));
      col=mix(col,vec3(.94,.97,.98),.15*(1.-vignette));
      gl_FragColor=vec4(col,1.);
    }`
  const scenes: { tick: (now: number) => void; dispose: () => void }[] = []
  let disposed = false
  let animationFrame = 0

  root.querySelectorAll<HTMLElement>('.water-scene').forEach((section) => {
    const canvas = section.querySelector('canvas')
    if (!canvas) return

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: 'low-power',
    })
    if (!gl) return

    const shaders: WebGLShader[] = []
    const compile = (type: number, code: string): WebGLShader => {
      const shader = gl.createShader(type)
      if (!shader) throw new Error('Water shader creation failed')
      shaders.push(shader)
      gl.shaderSource(shader, code)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error('Water shader compilation failed')
      }
      return shader
    }
    const program = gl.createProgram()
    if (!program) return

    try {
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex))
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment))
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error('Water shader linking failed')
      }
    } catch {
      shaders.forEach((shader) => gl.deleteShader(shader))
      gl.deleteProgram(program)
      return
    }
    shaders.forEach((shader) => {
      gl.detachShader(program, shader)
      gl.deleteShader(shader)
    })
    gl.useProgram(program)
    const buffer = gl.createBuffer()
    if (!buffer) {
      gl.deleteProgram(program)
      return
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const position = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const resolution = gl.getUniformLocation(program, 'u_resolution')
    const clock = gl.getUniformLocation(program, 'u_time')
    const ripples = gl.getUniformLocation(program, 'u_ripples[0]')
    const animated = gl.getUniformLocation(program, 'u_motion')
    const waves = new Float32Array(36)
    for (let i = 0; i < 12; i++) waves[i * 3 + 2] = -100

    let index = 0
    let visible = !('IntersectionObserver' in window)
    let lost = false
    let lastPointer = 0
    let lastDraw = 0
    const originalOpacity = canvas.style.opacity
    const started = performance.now()

    const draw = (now: number) => {
      if (disposed || lost) return
      gl.useProgram(program)
      gl.uniform2f(resolution, canvas.width, canvas.height)
      gl.uniform1f(clock, (now - started) / 1000)
      gl.uniform1f(animated, motion.matches ? 0 : 1)
      gl.uniform3fv(ripples, waves)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
    const size = () => {
      if (disposed) return
      const rect = section.getBoundingClientRect()
      // Bound fragment cost independently of monitor pixel density.
      const scale = Math.min(1, 1200 / Math.max(1, rect.width), 850 / Math.max(1, rect.height))
      canvas.width = Math.max(1, Math.round(rect.width * scale))
      canvas.height = Math.max(1, Math.round(rect.height * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
      draw(performance.now())
    }
    const disturb = (event: PointerEvent) => {
      if (disposed || lost || motion.matches || performance.now() - lastPointer < 65) return
      lastPointer = performance.now()
      const rect = canvas.getBoundingClientRect()
      if (!rect.height) return
      waves[index * 3] = (event.clientX - rect.left) / rect.height
      waves[index * 3 + 1] = 1 - (event.clientY - rect.top) / rect.height
      waves[index * 3 + 2] = (lastPointer - started) / 1000
      index = (index + 1) % 12
    }
    const handleContextLost = (event: Event) => {
      event.preventDefault()
      lost = true
    }
    // Keep a graceful CSS surface if the browser cannot restore GPU resources.
    const handleContextRestored = () => {
      canvas.style.opacity = '0'
    }
    const handleMotionChange = () => draw(performance.now())

    section.addEventListener('pointermove', disturb, { passive: true })
    section.addEventListener('pointerdown', disturb, { passive: true })
    canvas.addEventListener('webglcontextlost', handleContextLost)
    canvas.addEventListener('webglcontextrestored', handleContextRestored)
    motion.addEventListener('change', handleMotionChange)

    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(size) : null
    resizeObserver?.observe(section)
    if (!resizeObserver) window.addEventListener('resize', size)
    const intersectionObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
        visible = entries.some((entry) => entry.isIntersecting)
      }, { rootMargin: '100px' })
      : null
    intersectionObserver?.observe(section)

    scenes.push({
      tick(now) {
        if (visible && !document.hidden && !motion.matches && now - lastDraw > 32) {
          draw(now)
          lastDraw = now
        }
      },
      dispose() {
        resizeObserver?.disconnect()
        intersectionObserver?.disconnect()
        if (!resizeObserver) window.removeEventListener('resize', size)
        section.removeEventListener('pointermove', disturb)
        section.removeEventListener('pointerdown', disturb)
        canvas.removeEventListener('webglcontextlost', handleContextLost)
        canvas.removeEventListener('webglcontextrestored', handleContextRestored)
        motion.removeEventListener('change', handleMotionChange)
        gl.disableVertexAttribArray(position)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.useProgram(null)
        gl.deleteBuffer(buffer)
        gl.deleteProgram(program)
        canvas.style.opacity = originalOpacity
      },
    })
    size()
  })

  const loop = (now: number) => {
    if (disposed) return
    scenes.forEach((scene) => scene.tick(now))
    animationFrame = requestAnimationFrame(loop)
  }
  if (scenes.length) animationFrame = requestAnimationFrame(loop)

  return () => {
    if (disposed) return
    disposed = true
    cancelAnimationFrame(animationFrame)
    scenes.forEach((scene) => scene.dispose())
  }
}
