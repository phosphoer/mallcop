var gl;

function GraphicsSystem()
{
//store the canvas
this.canvas = document.getElementById("main_canvas");
this.jqCanvas = $('#main_canvas');
this.width = this.jqCanvas.width();
this.height = this.jqCanvas.height();
//fix fucking retard canvas
this.canvas.width = this.width;
this.canvas.height = this.height;

//matricies
this.perspectiveProjection = mat4.perspective(75, this.width / this.height, 0.1, 100.0);
this.view = mat4.identity();
this.viewProjection = mat4.identity();

//shader programs
this.cubeShaderProgram = null;

//vertex shader attrubutes
//cube.vs.js
this.cubeVertexPositionAttribute = null;
this.cubeVertexNormalAttribute = null;

//gl buffers
this.cubeVertexPositionBuffer = null;
this.cubeNormalBuffer = null;
this.cubeIndeces = null;

//dat cube
this.unit_cube_verts = [
  // Front face
  -0.5, -0.5,  0.5,
   0.5, -0.5,  0.5,
   0.5,  0.5,  0.5,
  -0.5,  0.5,  0.5,

  // Back face
  -0.5, -0.5, -0.5,
  -0.5,  0.5, -0.5,
   0.5,  0.5, -0.5,
   0.5, -0.5, -0.5,

  // Top face
  -0.5,  0.5, -0.5,
  -0.5,  0.5,  0.5,
   0.5,  0.5,  0.5,
   0.5,  0.5, -0.5,

  // Bottom face
  -0.5, -0.5, -0.5,
   0.5, -0.5, -0.5,
   0.5, -0.5,  0.5,
  -0.5, -0.5,  0.5,

  // Right face
   0.5, -0.5, -0.5,
   0.5,  0.5, -0.5,
   0.5,  0.5,  0.5,
   0.5, -0.5,  0.5,

  // Left face
  -0.5, -0.5, -0.5,
  -0.5, -0.5,  0.5,
  -0.5,  0.5,  0.5,
  -0.5,  0.5, -0.5
];

this.unit_cube_normals = [
  //front face
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,

  //back face
  0.0, 0.0, -1.0,
  0.0, 0.0, -1.0,
  0.0, 0.0, -1.0,
  0.0, 0.0, -1.0,

  //top face
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,

  //bottom face
  0.0, -1.0, 0.0,
  0.0, -1.0, 0.0,
  0.0, -1.0, 0.0,
  0.0, -1.0, 0.0,

  //right face
  1.0, 0.0, 0.0,
  1.0, 0.0, 0.0,
  1.0, 0.0, 0.0,
  1.0, 0.0, 0.0,

  //left face
  -1.0, 0.0, 0.0,
  -1.0, 0.0, 0.0,
  -1.0, 0.0, 0.0,
  -1.0, 0.0, 0.0
  ];

this.unit_cube_indices = [
  0,  1,  2,      0,  2,  3,    // front
  4,  5,  6,      4,  6,  7,    // back
  8,  9,  10,     8,  10, 11,   // top
  12, 13, 14,     12, 14, 15,   // bottom
  16, 17, 18,     16, 18, 19,   // right
  20, 21, 22,     20, 22, 23    // left
];

}

GraphicsSystem.prototype.SetCameraPosition = function(eye, target, up)
{
  mat4.lookAt(eye, target, up, this.view);
}

GraphicsSystem.prototype.InitWebGL = function (canvas)
{
  gl = null;

  try
  {
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  }
  catch(e)
  {

  }
  if (!gl)
  {
    alert("Unable to create webgl! (Don't use Internet Explorer)");
  }
}

GraphicsSystem.prototype.CreateShaders = function ()
{
  //create the shaders as GL shader objects
  var cubeVS, cubeFS;
  cubeVS = gl.createShader(gl.VERTEX_SHADER);
  cubeFS = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(cubeVS, cube_vs_shader);
  gl.shaderSource(cubeFS, cube_fs_shader);

  //compile the shaders
  gl.compileShader(cubeVS);
  if (!gl.getShaderParameter(cubeVS, gl.COMPILE_STATUS))
  {
    alert("Error Compiling cubeVS" + gl.getShaderInfoLog(cubeVS));
    return;
  }

  gl.compileShader(cubeFS);
  if (!gl.getShaderParameter(cubeFS, gl.COMPILE_STATUS))
  {
    alert("Error Compiling cubeFS" + gl.getShaderInfoLog(cubeFS));
    return;
  }

  //create the shader program
  this.cubeShaderProgram = gl.createProgram(); //note this is a global
  gl.attachShader(this.cubeShaderProgram, cubeVS);
  gl.attachShader(this.cubeShaderProgram, cubeFS);
  gl.linkProgram(this.cubeShaderProgram);

  if (!gl.getProgramParameter(this.cubeShaderProgram, gl.LINK_STATUS))
  {
    alert("Unable to initialize cubeVShaderProgram");
    return;
  }

  //get the attributes from the differet shaders
  this.cubeVertexPositionAttribute = gl.getAttribLocation(this.cubeShaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(this.cubeVertexPositionAttribute);

  this.cubeVertexNormalAttribute = gl.getAttribLocation(this.cubeShaderProgram, "aVertexNormal");
  gl.enableVertexAttribArray(this.cubeVertexNormalAttribute);

}

GraphicsSystem.prototype.CreateCube = function ()
{
  //create the cube vertex buffer
  this.cubeVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);

  //feed the buffer data into the gpu buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.unit_cube_verts), gl.STATIC_DRAW);

  //normals buffer
  this.cubeNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeNormalBuffer);
  //fill er up
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.unit_cube_normals), gl.STATIC_DRAW);

  //create the cube's index buffer
  this.cubeIndeces = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeIndeces);

  //feed the index buffer data
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.unit_cube_indices), gl.STATIC_DRAW);
}

GraphicsSystem.prototype.WebGLStart = function ()
{
  this.InitWebGL(this.canvas);
  this.CreateShaders();
  this.CreateCube();

  //you SHOULD only continue if webGL is working, but this is sparta
  gl.clearColor(0.0,0.0,0.0,1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
}

GraphicsSystem.prototype.DrawScene = function ()
{
  gl.viewport(0,0,this.width, this.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(this.cubeShaderProgram);
  //build matricies
  mat4.multiply(this.perspectiveProjection, this.view, this.viewProjection);

  //set matrix uniform
  var pUniform = gl.getUniformLocation(this.cubeShaderProgram, "uViewProjectionMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(this.viewProjection));

  var vUniform = gl.getUniformLocation(this.cubeShaderProgram, "uViewMatrix");
  gl.uniformMatrix4fv(vUniform, false, new Float32Array(this.view));

  var sUniform = gl.getUniformLocation(this.cubeShaderProgram, "uScale");
  gl.uniform1f(sUniform, 1.0);

  //spotlight uniforms
  var player = JSEngine.game.player;

  var sdUniform = gl.getUniformLocation(this.cubeShaderProgram, "uSpotDir");

  var xLightDir = player.x - player.components.player.aim_x;
  var zLightDir = player.z - player.components.player.aim_z;

  gl.uniform3f(sdUniform,xLightDir, 1.0, zLightDir);
  var spUniform = gl.getUniformLocation(this.cubeShaderProgram, "uSpotPos");
  gl.uniform3f(spUniform,player.x, 2, player.z);

  //bind buffers and draw
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeIndeces);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
  gl.vertexAttribPointer(this.cubeVertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeNormalBuffer);
  gl.vertexAttribPointer(this.cubeVertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

  //get the uniform for the cubeshader
  var positionUniform = gl.getUniformLocation(this.cubeShaderProgram, "uPosition");
  var colorUniform = gl.getUniformLocation(this.cubeShaderProgram, "uColor");

  this.DrawWorldArray(positionUniform, colorUniform);
}

GraphicsSystem.prototype.DrawWorldArray = function(positionUniform, colorUniform)
{
  //get the dimentions of the grid
  var worldArray = JSEngine.world.worldArray;
  var xMax = JSEngine.world.x;
  var yMax = JSEngine.world.y;
  var zMax = JSEngine.world.z;

  for (var x = 0; x < xMax; ++x)
    for (var y = 0; y < yMax; ++y)
      for (var z = 0; z < zMax; ++z)
      {
        //get the tile
        var tile = worldArray[x][y][z];
        if (false == tile.isVisible) continue;

        //set the uniforms
        gl.uniform3f(positionUniform, x, y, z);
        gl.uniform4f(colorUniform, tile.r, tile.g, tile.b, 1.0);

        //draw cube
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

      }
}