function MagnitudeVec2(vec2)
{
  return Math.sqrt(vec2[0] * vec2[0] + vec2[1] * vec2[1]);
}
function NormalizeVec2(vec2)
{
  var retVal = [vec2[0], vec2[1]];
  var magnitude = MagnitudeVec2(vec2);
  retVal[0] /= magnitude;
  retVal[1] /= magnitude;
  return retVal;
}

function SneakController(parent)
{
  this.parent = parent;
  this.x_dir = 0.0;
  this.z_dir = 0.0;
  this.lazy_speed = 3.0;
  this.frightened_speed = 7.0;
  this.speed = this.lazy_speed;
  this.frightened_distance = 8.0;
  this.time_since_fightened = 0.0;
  this.frightened_timeout = 2.0;
  ++JSEngine.game.num_sneaks;
}

SneakController.prototype.Update = function(dt)
{
  //go through and increment the timers:
  this.time_since_fightened += dt;

  if (this.parent.components.collider.collided_this_frame)
  {
    this.x_dir = -this.x_dir;
    this.z_dir = -this.z_dir;
    var xRand = (Math.random() - 0.5) * 2;
    var zRand = (Math.random() - 0.5) * 2;
    if (this.parent.z < JSEngine.world.side_hall_z)
      zRand = 1;
    if (this.parent.z > JSEngine.world.side_hall_z + JSEngine.world.mid_hall_z)
      zRand = -1;
    this.x_dir += xRand;
    this.z_dir += zRand;
    var normalized = NormalizeVec2([this.x_dir, this.z_dir]);
    this.x_dir = normalized[0];
    this.z_dir = normalized[1];
  }

  //get distance between the sneaks and the player
  var playerPos = [JSEngine.game.player.x, JSEngine.game.player.z];
  var playerVector = [this.parent.x - playerPos[0], this.parent.z - playerPos[1]];
  var distanceToPlayer = MagnitudeVec2(playerVector);
  playerVector = NormalizeVec2(playerVector);

  if (this.time_since_fightened > this.frightened_timeout && distanceToPlayer >= this.frightened_distance)
  {
    this.speed = this.lazy_speed;
  }

  if (JSEngine.game.player.components.player.fired_this_frame || (this.time_since_fightened > this.frightened_timeout && distanceToPlayer < this.frightened_distance))
  {
    this.x_dir = playerVector[0];
    this.z_dir = playerVector[1];
    this.time_since_fightened = 0.0;
    this.speed = this.frightened_speed;
  }

  if (this.speed == this.frightened_speed)
  {
    this.x_dir = 0.95 * this.x_dir + 0.05 * playerVector[0];
    this.z_dir = 0.95 * this.z_dir + 0.05 * playerVector[1];
    var normalized = NormalizeVec2([this.x_dir, this.z_dir]);
    this.x_dir = normalized[0];
    this.z_dir = normalized[1];
  }



  this.parent.x += this.x_dir * this.speed * dt;
  this.parent.z += this.z_dir * this.speed * dt;
}


function SneakSpawner(parent)
{
  this.parent = parent;
  this.max_sneak_freq = 1.0
  this.sneak_freq = 4.0
  this.sneak_freq_incr_per_sec = 0.0001
  this.sneak_current = 0.0
  this.second_counter = 0.0;
}

SneakSpawner.prototype.SpawnSneak = function()
{
  //do spawn stuff
  var lr = Math.floor(Math.random() + .5);
  var hall = Math.floor(Math.random() * JSEngine.world.hallways[lr].length);
  if(hall == JSEngine.world.hallways[lr].length)//just in case
    hall -= 1;

  var x = JSEngine.world.hallways[lr][hall] + Math.floor(JSEngine.world.hall_width / 2.0);
  var z = 10 + lr * (JSEngine.world.z - 10);

  var x_dir = 0.0;
  var z_dir = (lr - .5) * -2;

  var obj = JSEngine.factory.CreateGameObject();
  obj.components.sneak_controller = new SneakController(obj);
  obj.x = x;
  obj.z = z;
  obj.components.sneak_controller.x_dir = x_dir;
  obj.components.sneak_controller.z_dir = z_dir;

  obj.components.renderable = new Renderable(obj);
  obj.components.renderable.r = 0.1;
  obj.components.renderable.g = 0.15;
  obj.components.renderable.b = 0.1;
  obj.components.collider = new WorldAABBCollider(obj);
  //JSEngine.world.hallways[][]
}

SneakSpawner.prototype.Update = function(dt)
{
  this.sneak_current += dt;
  this.second_counter += dt;
  if(this.sneak_current >= this.sneak_freq)
  {
    this.SpawnSneak();
    this.sneak_current = 0.0;
  }

  if(this.second_counter >= 1.0)
  {
    this.second_counter = 0.0;
    this.sneak_freq -= this.sneak_freq_incr_per_sec;

    if(this.sneak_freq < this.max_sneak_freq)
      this.sneak_freq = this.max_sneak_freq;
  }
}