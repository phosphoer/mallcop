function GameObject()
{
  this.id = -1;
  this.x = 0;
  this.z = 0;
  this.components = {};
}

GameObject.prototype.Destroy = function()
{
  engine.factory.DestroyGameObject(this);
}

function Factory()
{
  this.current_id = 0;
  this.objects = {};
  this.trash = {};
}

Factory.prototype.Update = function(dt)
{
  // Deferred delete
  for (var i in this.trash)
  {
    var go = this.trash[i];
    delete this.objects[go.id];
  }
  this.trash = {};

  // Update components
  for (var i in this.objects)
  {
    var go = this.objects[i];
    for (var j in go.components)
    {
      var comp = go.components[j];
      if (comp.Update)
        comp.Update(dt);
    }
  }
}

Factory.prototype.CreateGameObject = function()
{
  var go = new GameObject();
  go.id = this.current_id++;
  this.objects[go.id] = go;

  return go;
}

Factory.prototype.DestroyGameObject = function(go)
{
  this.trash[go.id] = go;
}