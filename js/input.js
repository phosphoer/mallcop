// Input system
function Input(canvas)
{
  this.canvas = canvas;

  // Object thats going to be used as a dictionary
  this.pressed_keys = {};

  // Mouse information
  this.mouse = {x: 0, y: 0};

  // Register for events
  var that = this;
  window.addEventListener('keydown', function(event)
  {
    that.pressed_keys[event.keyCode] = true;
  }, false);

  window.addEventListener('keyup', function(event)
  {
    delete that.pressed_keys[event.keyCode];
  }, false);

  window.addEventListener('mousedown', function(event)
  {
    that.pressed_keys[0] = true;
  }, false);

  window.addEventListener('mouseup', function(event)
  {
    delete that.pressed_keys[0];
  }, false);

  canvas.addEventListener('mousemove', function(event)
  {
    if (event.offsetX)
    {
      that.mouse.x = event.offsetX;
      that.mouse.y = event.offsetY;
    }
    else if (event.layerX)
    {
      that.mouse.x = event.layerX;
      that.mouse.y = event.layerY;
    }
  }, false);

  // List of all the keys we may need
  this.LEFT_MOUSE = 0;
  this.RIGHT_MOUSE = 1;
  this.LEFT_ARROW = 37;
  this.UP_ARROW = 38;
  this.RIGHT_ARROW = 39;
  this.DOWN_ARROW = 40;
  this.A = 65;
  this.B = 66;
  this.C = 67;
  this.D = 68;
  this.E = 69;
  this.F = 70;
  this.G = 71;
  this.H = 72;
  this.I = 73;
  this.J = 74;
  this.K = 75;
  this.L = 76;
  this.M = 77;
  this.N = 78;
  this.O = 79;
  this.P = 80;
  this.Q = 81;
  this.R = 82;
  this.S = 83;
  this.T = 84;
  this.U = 85;
  this.V = 86;
  this.W = 87;
  this.X = 88;
  this.Y = 89;
  this.Z = 90;
}

Input.prototype.IsDown = function(keyCode)
{
  return this.pressed_keys[keyCode];
}

