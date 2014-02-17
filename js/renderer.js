function Renderer()
{
}

Renderer.prototype.Update = function(dt)
{
  var positionUniform = gl.getUniformLocation(JSEngine.graphics.cubeShaderProgram, "uPosition");
  var colorUniform = gl.getUniformLocation(JSEngine.graphics.cubeShaderProgram, "uColor");
  var sUniform = gl.getUniformLocation(JSEngine.graphics.cubeShaderProgram, "uScale");


  // Update components
  for (var i in JSEngine.factory.objects)
  {
    var go = JSEngine.factory.objects[i];
    for (var j in go.components)
    {
      if (go.components[j].constructor.name == "Renderable")
      {
        var renderable = go.components.renderable;
        gl.uniform3f(positionUniform, go.x, 1, go.z);
        gl.uniform4f(colorUniform, renderable.r, renderable.g, renderable.b, renderable.a);
        gl.uniform1f(sUniform, renderable.scale);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
      }
    }
  }
}