'use client';

import { useEffect, useRef } from 'react';

/**
 * Lightweight WebGL2 shader background — flowing navy+gold gradient mesh.
 * No three.js, ~200 lines, runs at 60fps on any device.
 */
export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { antialias: false, alpha: true });
    if (!gl) return;

    // Vertex shader — fullscreen triangle
    const vs = `#version 300 es
      out vec2 v_uv;
      void main() {
        vec2 pos = vec2((gl_VertexID & 1) * 4.0 - 1.0, (gl_VertexID & 2) * 2.0 - 1.0);
        v_uv = pos * 0.5 + 0.5;
        gl_Position = vec4(pos, 0.0, 1.0);
      }`;

    // Fragment shader — domain-warped FBM mesh with brand palette
    const fs = `#version 300 es
      precision highp float;
      in vec2 v_uv;
      out vec4 outColor;
      uniform float u_time;
      uniform vec2 u_res;

      // hash + value-noise
      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      float fbm(vec2 p) {
        float v = 0.0;
        float amp = 0.5;
        for (int i = 0; i < 5; i++) {
          v += amp * noise(p);
          p *= 2.0;
          amp *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = v_uv;
        float aspect = u_res.x / u_res.y;
        vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5) * 2.0;

        // domain warp
        float t = u_time * 0.06;
        vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, -t)));
        vec2 r = vec2(fbm(p + 2.0 * q + vec2(1.7, 9.2) + t * 0.5),
                      fbm(p + 2.0 * q + vec2(8.3, 2.8) - t * 0.5));
        float n = fbm(p + 2.0 * r);

        // brand palette
        vec3 cream = vec3(0.980, 0.965, 0.925);
        vec3 navy  = vec3(0.043, 0.129, 0.314);
        vec3 blue  = vec3(0.102, 0.310, 0.620);
        vec3 gold  = vec3(0.831, 0.627, 0.090);

        vec3 col = mix(cream, blue, smoothstep(0.20, 0.55, n));
        col = mix(col, navy, smoothstep(0.55, 0.85, n));
        col = mix(col, gold, smoothstep(0.85, 0.96, n) * 0.85);

        // gentle vignette
        float vig = 1.0 - smoothstep(0.7, 1.4, length(uv - 0.5));
        col *= mix(0.85, 1.0, vig);

        // film grain for premium feel
        float grain = (hash(uv * u_res.xy + u_time) - 0.5) * 0.035;
        col += grain;

        outColor = vec4(col, 1.0);
      }`;

    function compile(type: number, src: string) {
      const sh = gl!.createShader(type)!;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(sh));
      }
      return sh;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_res');

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.getBoundingClientRect();
      canvas!.width = Math.floor(rect.width * dpr);
      canvas!.height = Math.floor(rect.height * dpr);
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const start = performance.now();
    const draw = () => {
      const t = (performance.now() - start) / 1000;
      gl!.uniform1f(uTime, t);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ filter: 'blur(60px) saturate(1.1)', opacity: 0.6 }}
      aria-hidden
    />
  );
}
