import { useEffect, useRef } from 'react'

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Failed to create shader')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!compiled) {
    const info = gl.getShaderInfoLog(shader) ?? 'unknown error'
    gl.deleteShader(shader)
    throw new Error('Shader compile error: ' + info)
  }
  return shader
}

function createProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string
): WebGLProgram {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource)
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource)
  const program = gl.createProgram()
  if (!program) throw new Error('Failed to create program')
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!linked) {
    const info = gl.getProgramInfoLog(program) ?? 'unknown error'
    gl.deleteProgram(program)
    throw new Error('Program link error: ' + info)
  }
  return program
}

const colorCodes = [
  `
  vec3 color = mix(vec3(9.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), clamp((f * f) * 4.0, 0.0, 5.0));
  color = mix(color, vec3(0.0, 0.0, 1.0), clamp(length(q), 0.0, 1.0));
  color = mix(color, vec3(1.0, 1.0, 1.0), clamp(length(r.x), 0.0, 1.0));
  `,
  `
  vec3 color = mix(vec3(3.02, 4.1, 5.26), vec3(0.01, 0.01, 0.50), clamp((f * f) * 0.0, 0.0, 1.0));
  color = mix(color, vec3(0.0, 0.0, 0.2), clamp(length(q), 0.0, 1.0));
  color = mix(color, vec3(0.2, 0.01, 0.0), clamp(length(r.x), 0.0, 1.0));
  `,
  `
  vec3 color = mix(vec3(0.02, 0.01, 1.60), vec3(0.01, 0.01, 9.50), clamp((f * f) * 0.0, 0.0, 1.0));
  color = mix(color, vec3(0.0, 1.0, 1.0), clamp(length(q), 0.0, 1.0));
  color = mix(color, vec3(0.01, 0.01, 0.0), clamp(length(r.x), 0.0, 1.0));
  `,
  `
  vec3 color = mix(vec3(17.50, 5.01, 0.03), vec3(0.80, 0.005, 0.01), clamp((f * f) * 0.02, 0.0, 0.02));
  color = mix(color, vec3(0.0, 0.0, 1.0), clamp(length(q), 0.0, 1.0));
  color = mix(color, vec3(1.0, 1.0, 1.0), clamp(length(r.x), 0.0, 1.0));
  `,
  `
  vec3 color = mix(vec3(0.00, 0.00, 0.00), vec3(1.00, 1.00, 1.00), clamp((f * f) * 14.0, 0.0, 20.0));
  color = mix(color, vec3(0.0, 1.0, 1.0), clamp(length(q), 0.0, 1.0));
  color = mix(color, vec3(1.0, 0.0, 0.0), clamp(length(r.x), 0.0, 1.0));
  `,
  `
  vec3 color = mix(vec3(0.59, 0.5, 0.39), vec3(0.80, 0.05, 0.01), clamp((f * f) * 0.01, 0.0, 0.0));
  color = mix(color, vec3(0.0, 0.0, 1.0), clamp(length(q), 1.0, 1.0));
  color = mix(color, vec3(1.0, 1.0, 1.0), clamp(length(r.x), 1.0, 1.0));
  `,
  `
  vec3 color = mix(vec3(3.70, 1.20, 3.40), vec3(2.9, 1.2, 1.0), clamp((f * f) * 6.0, 0.0, 5.0));
  color = mix(color, vec3(0.1, 0.0, 1.0), clamp(length(q), 0.0, 1.0));
  color = mix(color, vec3(1.0, 1.0, 1.0), clamp(length(r.x), 0.0, 1.0));
  `,
  `
  vec3 color = mix(vec3(0.2, 0.0, 4.40), vec3(2.02, 0.02, 5.00), clamp((f * f) * 0.1, 0.0, 1.0));
  color = mix(color, vec3(0.0, 1.0, 1.0), clamp(length(q), 0.0, 1.0));
  color = mix(color, vec3(1.0, 0.0, 0.0), clamp(length(r.x), 0.0, 1.0));
  `,
  `
  vec3 color = mix(vec3(0.2, 0.04, 0.40), vec3(1.22, 0.01, 0.50), clamp((f * f) * 4.0, 0.0, 4.0));
  color = mix(color, vec3(0.0, 1.0, 1.0), clamp(length(q), 0.0, 1.0));
  color = mix(color, vec3(1.0, 0.0, 0.0), clamp(length(r.x), 0.0, 1.0));
  `,
  `
  vec3 color = mix(vec3(0.00, 0.02, 10.00), vec3(0.02, 0.02, 1.00), clamp((f * f) * 4.0, 0.0, 20.0));
  color = mix(color, vec3(0.0, 1.0, 1.0), clamp(length(q), 0.0, 1.0));
  color = mix(color, vec3(1.0, 0.0, 0.0), clamp(length(r.x), 0.0, 1.0));
  `
]
const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

function setCanvasSize(canvas: HTMLCanvasElement): void {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
  const width = Math.floor(window.innerWidth * dpr)
  const height = Math.floor(window.innerHeight * dpr)
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
  }
}

export default function BackgroundShader({
  colorIndex
}: {
  colorIndex: number
}): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  const FRAG = `
#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable

uniform float u_time;
uniform vec2 u_resolution;

float random(vec2 pos) {
  return fract(sin(dot(pos, vec2(12.8973, 76.58964))) * (sqrt(47.0)));
}

float noise(vec2 pos) {
  vec2 i = floor(pos);
  vec2 f = fract(pos);
  float a = random(i + vec2(0.0, 0.0));
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 16
float fbm(vec2 pos) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < NUM_OCTAVES; i++) {
    v += a * noise(pos);
    pos = rot * pos * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

void main(void) {
  vec2 p = (gl_FragCoord.xy * 1.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  float t = 0.0, d;
  float time2 = 0.6 * u_time / 2.0;
  vec2 q = vec2(0.0);
  q.x = fbm(p + 0.30 * time2);
  q.y = fbm(p + vec2(1.0));
  vec2 r = vec2(0.0);
  r.x = fbm(p + 1.0 * q + vec2(1.2, 3.2) + 0.135 * time2);
  r.y = fbm(p + 1.0 * q + vec2(8.8, 2.8) + 0.126 * time2);
  float f = fbm(p + r);
  ${colorCodes[colorIndex]}
  // vec3 color = mix(vec3(9.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), clamp((f * f) * 4.0, 0.0, 5.0));
  // color = mix(color, vec3(0.0, 0.0, 1.0), clamp(length(q), 0.0, 1.0));
  // color = mix(color, vec3(1.0, 1.0, 1.0), clamp(length(r.x), 0.0, 1.0));
  color = (f * f * f + 0.6 * f * f + 0.9 * f) * color;
  gl_FragColor = vec4(color, 1.0);
}
`

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const canvas: HTMLCanvasElement = canvasEl

    const glMaybe =
      (canvas.getContext('webgl', {
        premultipliedAlpha: true,
        alpha: true
      }) as WebGLRenderingContext | null) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)
    if (!glMaybe) return
    const gl: WebGLRenderingContext = glMaybe

    setCanvasSize(canvas)

    const program = createProgram(gl, VERT, FRAG)
    gl.useProgram(program)

    const aPosition = gl.getAttribLocation(program, 'a_position')
    const uResolution = gl.getUniformLocation(program, 'u_resolution')
    const uTime = gl.getUniformLocation(program, 'u_time')

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    // full-screen triangle
    const vertices = new Float32Array([-1, -1, 3, -1, -1, 3])
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    gl.disable(gl.DEPTH_TEST)
    gl.disable(gl.CULL_FACE)

    const start = performance.now()

    function render(now: number): void {
      const t = (now - start) / 1000
      setCanvasSize(canvas)

      gl.viewport(0, 0, canvas.width, canvas.height)
      if (uResolution) gl.uniform2f(uResolution, canvas.width, canvas.height)
      if (uTime) gl.uniform1f(uTime, t)

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)

    function handleResize(): void {
      setCanvasSize(canvas)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', handleResize)
      gl.useProgram(null)
      gl.bindBuffer(gl.ARRAY_BUFFER, null)
      if (buffer) gl.deleteBuffer(buffer)
      if (program) gl.deleteProgram(program)
    }
  }, [FRAG])

  return (
    <canvas
      ref={canvasRef}
      className={
        'absolute top-0 left-0 inset-0 w-full h-full pointer-events-none -z-10 bg-transparent'
      }
    />
  )
}
