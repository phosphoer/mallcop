function Smoke(parent)
{
  this.parent = parent;
  this.life = 1;
  this.float_x = Math.random() - 0.5;
  this.float_z = Math.random() - 0.5;
}

Smoke.prototype.Update = function(dt)
{
  this.parent.x += this.float_x * dt;
  this.parent.z += this.float_z * dt;

  this.parent.components.renderable.scale -= dt * 0.5;
  this.life -= dt;
  if (this.life <= 0)
    this.parent.Destroy();
}