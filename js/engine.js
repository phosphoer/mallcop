JSEngine = 0;

function Engine()
{
  JSEngine = this;

  // Time tracking
  this.last_time = new Date();

  // Create systems
  this.world = new World();
  this.actions = new Actions();
  this.graphics = new GraphicsSystem();
  this.graphics.WebGLStart(); //power up dat webgl
  this.graphics.SetCameraPosition( [200,80,300], [45,0,40], [0,1,0]);
  this.renderer = new Renderer();
  this.factory = new Factory();
  this.physics = new Physics();
  this.input = new Input(document.getElementById("main_canvas"));
  this.game = new Game();

  this.hud = new HUD();

  this.spawner_obj = this.factory.CreateGameObject();
  this.spawner_obj.components.sneak_spawner = new SneakSpawner(this.spawner_obj);

  // requestAnim shim layer by Paul Irish
  window.requestAnimFrame = (function()
  {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback, /* DOMElement */ element)
            {
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  document.onselectstart = function()
  {
    return false;
  }
}

Engine.prototype.Start = function()
{
  // Begin update
  
  EngineUpdate();
}

function EngineUpdate()
{
  // Time tracking
  var new_time = new Date();
  var dt = (new_time - engine.last_time) / 1000.0;
  if (dt > 0.1) dt = 0.1;
  engine.last_time = new_time;

  // Request that update be called again
  requestAnimFrame(EngineUpdate);

  // Update actions
  engine.actions.Update(dt);

  // Update physics
  engine.physics.Update(dt);

  // Update game
  engine.game.Update(dt);

  // Update the factory
  engine.factory.Update(dt);

  // Update hud
  engine.hud.Update(dt);

  // Draw
  engine.graphics.DrawScene();
  engine.renderer.Update(dt);
}
