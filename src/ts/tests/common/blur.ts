import { measureFPS, estimateMaximumTheoreticalFPS } from "./fps";

export default async function blur(width: number, height: number, halfBlurRadius: number): Promise<string> {
  const image = document.createElement("canvas");
  image.style.border = "1px solid blue";
  image.width = width;
  image.height = height;
  // document.body.appendChild(image);
  const ctx = image.getContext("2d")!;
  const gradient = ctx.createLinearGradient(0, height, width, 0);
  gradient.addColorStop(0, "red");
  gradient.addColorStop(0.15, "orange");
  gradient.addColorStop(0.30, "yellow");
  gradient.addColorStop(0.45, "green");
  gradient.addColorStop(0.60, "blue");
  gradient.addColorStop(0.75, "purple");
  gradient.addColorStop(1, "pink");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.font = `${Math.round(height / 2)}px sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.fillText("Abc", width / 2, height / 2);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 5;
  ctx.strokeText("Abc", width / 2, height / 2);

  const canvas = document.createElement("canvas");
  canvas.style.border = "1px solid red";
  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);
  const gl = canvas.getContext("webgl")!;

  const vs = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(vs, `
    attribute vec2 a_Position;

    varying vec2 v_Texcoord;

    void main(void) {
      gl_Position = vec4(a_Position, 0.0, 1.0);
      v_Texcoord = (a_Position + 1.0) / 2.0;
    }
  `);
  gl.compileShader(vs);
  console.log(gl.getShaderInfoLog(vs));

  const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fs, `
    precision mediump float;

    varying vec2 v_Texcoord;

    uniform sampler2D u_Texture;
    uniform ivec2 u_TextureSize;

    void main(void) {
      float du = 1.0 / float(u_TextureSize.x);
      float dv = 0.0; // 1.0 / float(u_TextureSize.y);
      vec4 color = vec4(0.0);

      float sigma = float(${halfBlurRadius}) / 2.0;

      for (int i = -${halfBlurRadius}; i <= ${halfBlurRadius}; i++) {
        float t = float(i);
        float w = (1.0 / (sqrt(2.0 * 3.1415) * sigma)) * exp(-(t * t) / (2.0 * sigma * sigma));
        color += w * texture2D(u_Texture, v_Texcoord + vec2(t * du, t * dv));
      }

      gl_FragColor = color;
    }
  `);
  gl.compileShader(fs);
  console.log(gl.getShaderInfoLog(fs));

  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.bindAttribLocation(program, 0, "a_Position");
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  console.log(gl.getProgramInfoLog(program));

  const u_Texture = gl.getUniformLocation(program, "u_Texture");
  const u_TextureSize = gl.getUniformLocation(program, "u_TextureSize");

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Int8Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);

  function frame(): void {
    gl.clearColor(0.2, 0.3, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(u_Texture, 0);
    gl.uniform2i(u_TextureSize, width, height);

    gl.enableVertexAttribArray(0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(0, 2, gl.BYTE, false, 2, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  const FPS = await measureFPS(frame);
  const maximumTheoreticalFPS = await estimateMaximumTheoreticalFPS(frame);

  gl.deleteProgram(program);
  gl.deleteBuffer(vertexBuffer);
  gl.deleteTexture(texture);
  canvas.remove();

  const result = {
    FPS,
    maximumTheoreticalFPS
  };

  return JSON.stringify(result);
}