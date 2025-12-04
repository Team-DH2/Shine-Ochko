"use client";

import { Renderer, Program, Mesh, Color, Triangle } from "ogl";

import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }

  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;

  gl_FragColor = vec4(col, 1.0);
}
`;

interface IridescenceProps {
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
  children?: React.ReactNode;
}

function IridescenceBackground({
  color = [0, 0.6, 1],
  speed = 1.0,
  amplitude = 0.1,
  mouseReact = true,
  children,
}: IridescenceProps) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const programRef = useRef<Program | null>(null);

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;

    const renderer = new Renderer({
      powerPreference: "low-power",
      dpr: 1,
    });

    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);

    // Style canvas for background
    const canvas = gl.canvas;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    let animateId: number;

    const geometry = new Triangle(gl);

    // Program Setup
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(...color) },
        uResolution: {
          value: new Color(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height
          ),
        },
        uMouse: {
          value: new Float32Array([mousePos.current.x, mousePos.current.y]),
        },
        uAmplitude: { value: amplitude },
        uSpeed: { value: speed },
      },
    });

    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      program.uniforms.uResolution.value = new Color(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height
      );
    }

    window.addEventListener("resize", resize);
    resize();

    function update(t: number) {
      animateId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    }

    animateId = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    // 🟦 Mouse move
    function onMouseMove(e: MouseEvent) {
      const rect = ctn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;

      mousePos.current = { x, y };
      program.uniforms.uMouse.value[0] = x;
      program.uniforms.uMouse.value[1] = y;
    }

    if (mouseReact) ctn.addEventListener("mousemove", onMouseMove);

    // 🟦 Cleanup
    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      if (mouseReact) ctn.removeEventListener("mousemove", onMouseMove);
      if (gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas);

      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (programRef.current)
      programRef.current.uniforms.uColor.value = new Color(...color);
  }, [color]);

  useEffect(() => {
    if (programRef.current) programRef.current.uniforms.uSpeed.value = speed;
  }, [speed]);

  useEffect(() => {
    if (programRef.current)
      programRef.current.uniforms.uAmplitude.value = amplitude;
  }, [amplitude]);

  return (
    <div ref={ctnDom} className="w-full h-full relative overflow-hidden">
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

export default function LogInPage() {
  return (
    <IridescenceBackground>
      <div className="flex items-center justify-center h-full text-white">
        {/* This page can be a redirect or a placeholder */}
      </div>
    </IridescenceBackground>
  );
}
