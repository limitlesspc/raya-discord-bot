export type ShaderType = 'vertex' | 'fragment';

export default class Shader {
  shader: WebGLShader;

  constructor(
    private gl: WebGLRenderingContext,
    readonly type: ShaderType,
    readonly source: string
  ) {
    // Create the vertex shader and bind the source
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const shader = gl.createShader(
      type === 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER
    )!;
    gl.shaderSource(shader, source);

    // Check for shader errors
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw new Error(
        `Error compiling ${type} shader: ${gl.getShaderInfoLog(shader)}`
      );

    this.shader = shader;
  }

  attach(program: WebGLProgram): void {
    this.gl.attachShader(program, this.shader);
  }

  detach(program: WebGLProgram): void {
    this.gl.detachShader(program, this.shader);
  }

  remove(): void {
    this.gl.deleteShader(this.shader);
  }
}
