function Physics()
{
}

Physics.prototype.Update = function(dt)
{
  // Update components
  for (var i in JSEngine.factory.objects)
  {
    var go = JSEngine.factory.objects[i];
    for (var j in go.components)
    {
      if (go.components[j].constructor.name == "WorldAABBCollider")
      {
        var collider = go.components.collider;
        collider.Resolve(JSEngine.world);
      }
    }
  }
}

Physics.prototype.RayToColliders = function(x0, y0, x1, y1, ignore)
{
  var result = [];

  for (var i in JSEngine.factory.objects)
  {
    var go = JSEngine.factory.objects[i];
    for (var j in go.components)
    {
      if (go.components[j].constructor.name == "WorldAABBCollider")
      {
        var collider = go.components.collider;
        var skip = false;
        for (var n in ignore)
          if (collider == ignore[n])
            skip = true;

        if (!skip && collider.TestAgainstRay(x0, y0, x1, y1))
        {
          result.push(collider);
        }
      }
    }
  }

  return result;
}