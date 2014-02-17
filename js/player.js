function Player(parent)
{
  this.parent = parent;
  this.move_speed = 5;
  this.aim_x = 0;
  this.aim_z = 0;
  this.desired_aim_x = 0;
  this.desired_aim_z = 0;

  this.aim_offset_x = 0;
  this.aim_offset_z = 0;

  this.camera_x = this.parent.x - 3;
  this.camera_z = this.parent.z - 3;

  this.crosshair = JSEngine.factory.CreateGameObject();
  this.crosshair.components.renderable = new Renderable(this.crosshair);
  this.crosshair.components.renderable.r = 150;
  this.crosshair.components.renderable.scale = 0.5;

  this.reload = 0;
  this.reload_time = 0.6;
  this.current_sound = 0;
  this.inaccuracy = 2;
  this.fired_this_frame = false;

  this.shoot_sound = [];
  for (var i = 0; i < 5; ++i)
    this.shoot_sound[i] = new Audio("sound/TheBeastUnleashed.wav");
}

Player.prototype.Update = function(dt)
{
  // Move around
  if (JSEngine.input.IsDown(JSEngine.input.W))
  {
    this.parent.z += this.move_speed * dt;
  }
  if (JSEngine.input.IsDown(JSEngine.input.A))
  {
    this.parent.x += this.move_speed * dt;
  }
  if (JSEngine.input.IsDown(JSEngine.input.S))
  {
    this.parent.z -= this.move_speed * dt;
  }
  if (JSEngine.input.IsDown(JSEngine.input.D))
  {
    this.parent.x -= this.move_speed * dt;
  }

  // Update desired aim pos
  var canvas = JSEngine.input.canvas;
  var mouse_world_vec = vec3.unproject([JSEngine.input.mouse.x, JSEngine.input.canvas.height - JSEngine.input.mouse.y, 1],
                                       JSEngine.graphics.view, JSEngine.graphics.perspectiveProjection,
                                       [0, 0, canvas.width, canvas.height]);

  this.desired_aim_x = (mouse_world_vec[0] - this.parent.x) / 5 + this.parent.x + this.aim_offset_x;
  this.desired_aim_z = (mouse_world_vec[2] - this.parent.z) / 5 + this.parent.z + this.aim_offset_z;

  // Update crosshair
  this.crosshair.x = this.aim_x;
  this.crosshair.z = this.aim_z;

  this.crosshair.components.renderable.r = (this.inaccuracy - 2) * 0.5;
  this.crosshair.components.renderable.g = 0;
  this.crosshair.components.renderable.g = 1 - ((this.inaccuracy - 2) * 0.5);
  this.crosshair.components.renderable.a = 0.5;

  // Update aim point
  this.aim_x += (this.desired_aim_x - this.aim_x) / this.inaccuracy;
  this.aim_z += (this.desired_aim_z - this.aim_z) / this.inaccuracy;

  // Get vector to aim point
  var aim_vec_x = this.aim_x - this.parent.x;
  var aim_vec_z = this.aim_z - this.parent.z;
  var aim_vec_length = Math.sqrt(aim_vec_x * aim_vec_x + aim_vec_z * aim_vec_z);
  aim_vec_x /= aim_vec_length;
  aim_vec_z /= aim_vec_length;

  // Update camera
  this.camera_x += ((this.parent.x) - this.camera_x) / 6;
  this.camera_z += ((this.parent.z - 3) - this.camera_z) / 6;
  JSEngine.graphics.SetCameraPosition( [this.camera_x,15,this.camera_z], [this.parent.x,1,this.parent.z], [0,1,0]);

  // Shoot
  this.reload -= dt;
  if (this.inaccuracy > 2)
    this.inaccuracy *= 0.97;
  this.aim_offset_x *= 0.97;
  this.aim_offset_z *= 0.97;
  this.fired_this_frame = false;
  if (JSEngine.input.IsDown(JSEngine.input.LEFT_MOUSE) && this.reload <= 0)
  {
    this.fired_this_frame = true;
    this.shoot_sound[this.current_sound++].play();
    if (this.current_sound >= this.shoot_sound.length)
      this.current_sound = 0;

    var to_x = this.parent.x + (aim_vec_x) * 100;
    var to_z = this.parent.z + (aim_vec_z) * 100;

    // Spawn trail
    var tiles = JSEngine.world.getTilesInLine(this.parent.x, this.parent.z, to_x, to_z);
    if (tiles[0][0] != this.parent.x && tiles[0][1] != this.parent.z)
      tiles.reverse();
    for (var i in tiles)
    {
      var tile = tiles[i];
      if (JSEngine.world.collidePoint(tile[0], tile[1]))
        break;
      var trail = JSEngine.factory.CreateGameObject();
      trail.x = tile[0];
      trail.z = tile[1];
      trail.components.renderable = new Renderable(trail);
      trail.components.smoke = new Smoke(trail);
      trail.components.renderable.scale = 0.5;
      var red = Math.random();
      trail.components.renderable.r = 0.5 + red * 0.5;
      trail.components.renderable.g = 0.5 - red * 0.5;
      trail.components.renderable.b = 0.5 - red * 0.5;
    }

    var colliders = JSEngine.physics.RayToColliders(this.parent.x, this.parent.z, to_x, to_z, [this.parent.components.collider]);

    var destroy_block = function(hit_pos)
    {
      if (!JSEngine.world.worldArray[hit_pos[0]][hit_pos[1] + 1][hit_pos[2]].isCollidable)
      {
        JSEngine.world.worldArray[hit_pos[0]][hit_pos[1]][hit_pos[2]].isCollidable = false;
        JSEngine.world.worldArray[hit_pos[0]][hit_pos[1]][hit_pos[2]].isVisible = false;
      }

      JSEngine.world.multiplyColor(hit_pos[0] + 0, hit_pos[1], hit_pos[2] + 0, 0.3);
      JSEngine.world.multiplyColor(hit_pos[0] + 1, hit_pos[1], hit_pos[2] + 0, 0.3);
      JSEngine.world.multiplyColor(hit_pos[0] + 1, hit_pos[1], hit_pos[2] + 1, 0.3);
      JSEngine.world.multiplyColor(hit_pos[0] + 0, hit_pos[1], hit_pos[2] + 1, 0.3);
      JSEngine.world.multiplyColor(hit_pos[0] - 1, hit_pos[1], hit_pos[2] + 1, 0.3);
      JSEngine.world.multiplyColor(hit_pos[0] - 1, hit_pos[1], hit_pos[2] + 0, 0.3);
      JSEngine.world.multiplyColor(hit_pos[0] - 1, hit_pos[1], hit_pos[2] - 1, 0.3);
      JSEngine.world.multiplyColor(hit_pos[0] + 0, hit_pos[1], hit_pos[2] - 1, 0.3);
      JSEngine.world.multiplyColor(hit_pos[0] + 1, hit_pos[1], hit_pos[2] - 1, 0.3);
    }

    if (colliders.length == 0)
    {
      var hit_pos = [];
      var hit = JSEngine.world.rayCastToPoint(this.parent.x, this.parent.z, to_x, to_z, hit_pos);
      if (hit)
        destroy_block(hit_pos);
    }
    else
    {
      for (var i in colliders)
      {
        var collider = colliders[i];
        var hit_pos = [];
        var hit = JSEngine.world.rayCastToPoint(this.parent.x, this.parent.z, collider.parent.x, collider.parent.z, hit_pos);
        if (hit && (Math.abs(hit_pos[0] - collider.parent.x) > 2 || Math.abs(hit_pos[2] - collider.parent.z)))
        {
          destroy_block(hit_pos);
        }
        else
        {
          collider.parent.Destroy();
          JSEngine.world.bloodSplat(collider.parent.x, collider.parent.z, Math.atan2(this.aim_z - this.parent.z, this.aim_x - this.parent.x));
          JSEngine.game.score += ((this.parent.x - collider.parent.x) * (this.parent.x - collider.parent.x) +
                                 (this.parent.z - collider.parent.z) * (this.parent.z - collider.parent.z));
          JSEngine.game.score = Math.floor(JSEngine.game.score);
          JSEngine.game.kill_time = 0;
          --JSEngine.game.num_sneaks;
          JSEngine.game.merchandise += 3;
          ShowPhrase(400, 100);
        }
      }
    }

    this.aim_x += Math.random() * 6 - 3;
    this.aim_z += Math.random() * 6 - 3;
    this.aim_offset_x += Math.random() * 8 - 4;
    this.aim_offset_z += Math.random() * 8 - 4;
    this.inaccuracy *= 1.8;

    this.reload = this.reload_time;
  }
}