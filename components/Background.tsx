"use client";

import React, { useEffect, useRef } from "react";

const vertexShaderSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision mediump float; // OPTIMIZATION 3: downgraded to mediump for better mobile perf

#define MAX_RIPPLES 5

uniform vec2 u_resolution;
uniform vec2 u_blobs[6];
uniform float u_sizes[6];
uniform vec2 u_rippleCenters[MAX_RIPPLES];
uniform float u_rippleTimes[MAX_RIPPLES];
uniform int u_rippleCount;

vec3 getBlobColor(int i) {
  if (i == 0) return vec3(18.0, 113.0, 255.0) / 255.0;
  if (i == 1) return vec3(221.0, 74.0, 255.0) / 255.0;
  if (i == 2) return vec3(100.0, 220.0, 255.0) / 255.0;
  if (i == 3) return vec3(200.0, 50.0, 50.0) / 255.0;
  if (i == 4) return vec3(180.0, 180.0, 50.0) / 255.0;
  if (i == 5) return vec3(140.0, 100.0, 255.0) / 255.0; // Cursor blob
  return vec3(1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 st = uv * vec2(u_resolution.x / u_resolution.y, 1.0);

  float ripple = 0.0;
  for (int i = 0; i < MAX_RIPPLES; i++) {
    if (i >= u_rippleCount) break;

    vec2 rippleSt = u_rippleCenters[i] * vec2(u_resolution.x / u_resolution.y, 1.0);
    float dist = distance(st, rippleSt);

    float rippleRadius = u_rippleTimes[i] * 0.8;
    float rippleWidth = 0.05;

    float r = 1.0 - smoothstep(rippleRadius - rippleWidth, rippleRadius + rippleWidth, dist);
    r *= (1.0 - smoothstep(0.0, 2.0, u_rippleTimes[i]));

    ripple += r;
  }

  vec3 blendedColor = vec3(0.0);
  float totalInfluence = 0.0;

  for (int i = 0; i < 6; i++) {
    vec2 blob = u_blobs[i];
    vec2 blobSt = blob * vec2(u_resolution.x / u_resolution.y, 1.0);
    float size = u_sizes[i];

    float d = distance(st, blobSt);
    float influence = size * 0.015 / (d * d);
    influence += influence * ripple * 0.5;

    blendedColor += getBlobColor(i) * influence;
    totalInfluence += influence;
  }

  vec3 finalColor = blendedColor / max(totalInfluence, 0.0001);
  float softGoo = smoothstep(0.3, 0.8, totalInfluence);

  gl_FragColor = vec4(finalColor * softGoo, softGoo);
}
`;

const Background = ({
  children,
  className = "",
  wrapChildren = true,
}: {
  children?: React.ReactNode;
  className?: string;
  wrapChildren?: boolean;
}) => {
  // return <div>{children}</div>;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<[number, number]>([0.5, 0.5]);
  const prevMouseRef = useRef<[number, number]>([0.5, 0.5]);
  const mouseBlobLerpRef = useRef<[number, number]>([0.5, 0.5]);
  const mouseVelocityRef = useRef(0);
  const ripplesRef = useRef<{ center: [number, number]; startTime: number }[]>(
    []
  );
  const cursorBaseSize = 0.2;
  const sizeScaleRef = useRef(1.0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: true });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    gl.clearColor(0, 0, 0, 0);

    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(
      fragmentShaderSource,
      gl.FRAGMENT_SHADER
    );

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const blobsLocation = gl.getUniformLocation(program, "u_blobs");
    const sizesLocation = gl.getUniformLocation(program, "u_sizes");
    const rippleCentersLocation = gl.getUniformLocation(
      program,
      "u_rippleCenters"
    );
    const rippleTimesLocation = gl.getUniformLocation(program, "u_rippleTimes");
    const rippleCountLocation = gl.getUniformLocation(program, "u_rippleCount");

    const blobs = Array.from({ length: 5 }, () => ({
      position: [Math.random(), Math.random()] as [number, number],
      velocity: [(Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.05],
      baseSize: Math.random() * 1.5 + 0.5,
      breathingSpeed: Math.random() * 0.5 + 0.5,
      breathingOffset: Math.random() * Math.PI * 2,
    }));

    const rippleCenters = new Float32Array(2 * 5); // Pre-allocated
    const rippleTimes = new Float32Array(5); // Pre-allocated
    const flatBlobsArray = new Float32Array((5 + 1) * 2); // OPTIMIZATION 2: Pre-allocate flat blob positions

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      const width = window.innerWidth;
      if (width <= 480) sizeScaleRef.current = 0.2;
      else if (width <= 768) sizeScaleRef.current = 0.4;
      else if (width <= 1024) sizeScaleRef.current = 0.6;
      else sizeScaleRef.current = 1.0;
    };

    resizeCanvas(); // Initial resize

    const start = performance.now();

    ripplesRef.current.push({
      center: [0.5, 0.5],
      startTime: performance.now(),
    });

    const render = (now: number) => {
      const elapsed = (now - start) / 1000;

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      ripplesRef.current = ripplesRef.current.filter(
        (r) => (performance.now() - r.startTime) / 1000 < 2.0
      );

      for (let i = 0; i < ripplesRef.current.length; i++) {
        const r = ripplesRef.current[i];
        rippleCenters[i * 2] = r.center[0];
        rippleCenters[i * 2 + 1] = r.center[1];
        rippleTimes[i] = (performance.now() - r.startTime) / 1000;
      }

      gl.uniform2fv(rippleCentersLocation, rippleCenters);
      gl.uniform1fv(rippleTimesLocation, rippleTimes);
      gl.uniform1i(rippleCountLocation, ripplesRef.current.length);

      for (const blob of blobs) {
        blob.position[0] += blob.velocity[0] * 0.01;
        blob.position[1] += blob.velocity[1] * 0.01;
        if (blob.position[0] < 0.0 || blob.position[0] > 1.0)
          blob.velocity[0] *= -1.0;
        if (blob.position[1] < 0.0 || blob.position[1] > 1.0)
          blob.velocity[1] *= -1.0;
      }

      for (let i = 0; i < blobs.length; i++) {
        flatBlobsArray[i * 2] = blobs[i].position[0];
        flatBlobsArray[i * 2 + 1] = blobs[i].position[1];
      }

      const current = mouseRef.current;
      const prev = prevMouseRef.current;
      const dx = current[0] - prev[0];
      const dy = current[1] - prev[1];
      const mouseSpeed = Math.sqrt(dx * dx + dy * dy);

      mouseVelocityRef.current +=
        (mouseSpeed - mouseVelocityRef.current) * 0.05;
      prevMouseRef.current = current;

      const lerp = mouseBlobLerpRef.current;
      lerp[0] += (current[0] - lerp[0]) * 0.02;
      lerp[1] += (current[1] - lerp[1]) * 0.02;

      flatBlobsArray[blobs.length * 2] = lerp[0];
      flatBlobsArray[blobs.length * 2 + 1] = lerp[1];

      gl.uniform2fv(blobsLocation, flatBlobsArray);

      const flatSizes = blobs.map((b) => {
        const breathing =
          Math.sin(elapsed * b.breathingSpeed + b.breathingOffset) * 0.1 + 1.0;
        return b.baseSize * breathing * sizeScaleRef.current;
      });

      const growth = Math.min(mouseVelocityRef.current * 10.0, 0.5);
      flatSizes.push((cursorBaseSize + growth) * sizeScaleRef.current);

      gl.uniform1fv(sizesLocation, new Float32Array(flatSizes));

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    const updateMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseRef.current = [x, 1.0 - y];
    };

    const triggerRipple = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      if (ripplesRef.current.length < 5) {
        ripplesRef.current.push({
          center: [x, 1.0 - y],
          startTime: performance.now(),
        });
      }
    };

    window.addEventListener("mousemove", updateMouse);
    window.addEventListener("click", triggerRipple);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("mousemove", updateMouse);
      window.removeEventListener("click", triggerRipple);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className={`${wrapChildren ? "absolute" : "fixed"} inset-0`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ willChange: "transform" }}
      />
      {wrapChildren && (
        <div className={`relative w-full h-full z-10 ${className}`}>
          {children}
        </div>
      )}
    </div>
  );

  // original code to use as wrapper around children
  // return (
  //   <div className="absolute inset-0">
  //     <canvas
  //       ref={canvasRef}
  //       className="absolute inset-0 w-full h-full pointer-events-none z-0"
  //       style={{ willChange: "transform" }}
  //     />
  //     <div className={`relative w-full h-full z-10 ${className}`}>
  //       {children}
  //     </div>
  //   </div>
  // );
};

export default Background;
