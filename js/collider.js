//This is dependent on world.js and factory.js

function ColliderVec2(x, z)
{
  this.x = x;
  this.z = z;
}


function WorldAABBCollider(parent)
{
   this.parent = parent;

   this.collided_this_frame = false;

  this.collidePoints = [
  new ColliderVec2(0.0, 0.0),
  new ColliderVec2(0.0, 0.0),
  new ColliderVec2(0.0, 0.0),
  new ColliderVec2(0.0, 0.0)
  ];
}

WorldAABBCollider.prototype.Resolve = function(world)
{
  this.collidePoints[0].x = this.parent.x + 1.0;
  this.collidePoints[0].z = this.parent.z + 1.0;

  this.collidePoints[1].x = this.parent.x + 1.0;
  this.collidePoints[1].z = this.parent.z;

  this.collidePoints[2].x = this.parent.x;
  this.collidePoints[2].z = this.parent.z + 1.0;

  this.collidePoints[3].x = this.parent.x;
  this.collidePoints[3].z = this.parent.z;

  var p0 = world.collidePoint(this.collidePoints[0].x, this.collidePoints[0].z);
  var p1 = world.collidePoint(this.collidePoints[1].x, this.collidePoints[1].z);
  var p2 = world.collidePoint(this.collidePoints[2].x, this.collidePoints[2].z);
  var p3 = world.collidePoint(this.collidePoints[3].x, this.collidePoints[3].z);

  this.collided_this_frame = false;

  //collide line1(0->1)
  if(p0 && p1)//colliding at +x
  {
    this.parent.x = Math.floor(this.parent.x);
    this.collided_this_frame = true;
  }
  //collide line2(1->3)
  if(p1 && p3)//colliding at -z
  {
    this.parent.z = Math.ceil(this.parent.z);
    this.collided_this_frame = true;
  }
  //collide line3(3->2)
  if(p3 && p2)//colliding at -x
  {
    this.parent.x = Math.ceil(this.parent.x);
    this.collided_this_frame = true;
  }
  //collide line4(2->0)
  if(p2 && p0)//colliding at +z
  {
    this.parent.z = Math.floor(this.parent.z);
    this.collided_this_frame = true;
  }

  //check for corner collision
  //top-right
  if(p0 && !p1 && !p2)
  {
    //resolve along +z or +x
    if(Math.abs(this.parent.x - Math.floor(this.parent.x)) < Math.abs(this.parent.z - Math.floor(this.parent.z)))
      this.parent.x = Math.floor(this.parent.x);
    else
      this.parent.z = Math.floor(this.parent.z);

    this.collided_this_frame = true;
  }
  //bottom-right
  if(p1 && !p0 && !p3)
  {
    //resolve along -z or +x
    if(Math.abs(this.parent.x - Math.floor(this.parent.x)) < Math.abs(this.parent.z - Math.ceil(this.parent.z)))
      this.parent.x = Math.floor(this.parent.x);
    else
      this.parent.z = Math.ceil(this.parent.z);

    this.collided_this_frame = true;
  }
  //top-left
  if(p2 && !p0 && !p3)
  {
    //resolve along -x or +z
    if(Math.abs(this.parent.x - Math.ceil(this.parent.x)) < Math.abs(this.parent.z - Math.floor(this.parent.z)))
      this.parent.x = Math.ceil(this.parent.x);
    else
      this.parent.z = Math.floor(this.parent.z);

    this.collided_this_frame = true;
  }
  //bottom-left
  if(p3 && !p1 && !p2)
  {
    //resolve along -z or -x
    if(Math.abs(this.parent.x - Math.ceil(this.parent.x)) < Math.abs(this.parent.z - Math.ceil(this.parent.z)))
      this.parent.x = Math.ceil(this.parent.x);
    else
      this.parent.z = Math.ceil(this.parent.z);

    this.collided_this_frame = true;
  }
}

function LineSegment(x0, y0, x1, y1)
{
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
}

LineSegment.prototype.IntersectPoint = function(point)
{
  var ax = this.x1 - this.x0;
  var ay = this.y1 - this.y0;

  var bx = point[0] - this.x0;
  var by = point[1] - this.y0;

  var cx = point[0] - this.x1;
  var cy = point[1] - this.y1;

  if (bx * ax + by * ay >= 0 && cx * ax + cy * ay <= 0)
    return true;
}

LineSegment.prototype.Intersection = function(that)
{
  var t = ((that.x1 - that.x0) * (this.y0 - that.y0) - (that.y1 - that.y0) * (this.x0 - that.x0)) /
          ((that.y1 - that.y0) * (this.x1 - this.x0) - (that.x1 - that.x0) * (this.y1 - this.y0));

  var s = ((this.x1 - this.x0) * (this.y0 - that.y0) - (this.y1 - this.y0) * (this.x0 - that.x1)) /
          ((that.y1 - that.y0) * (this.x1 - this.x0) - (that.x1 - that.x0) * (this.y1 - this.y0));

  if (t >= 0 && t <= 1 && s >= 0 && s <= 1)
    return true;

  return false;
}

WorldAABBCollider.prototype.TestAgainstRay = function(x0, y0, x1, y1)
{
  var padding = 0.2;
  var lines =
  [
    new LineSegment(this.parent.x - padding, this.parent.z - padding, this.parent.x + 1 + padding, this.parent.z - padding),
    new LineSegment(this.parent.x + 1 + padding, this.parent.z - padding, this.parent.x + 1 + padding, this.parent.z + 1 + padding),
    new LineSegment(this.parent.x + 1 + padding, this.parent.z + 1 + padding, this.parent.x - padding, this.parent.z + 1 + padding),
    new LineSegment(this.parent.x - padding, this.parent.z - padding, this.parent.x - padding, this.parent.z + 1 + padding)
  ];

  var ray = new LineSegment(x0, y0, x1, y1);

  for (var i in lines)
  {
    if (ray.Intersection(lines[i]))
      return true;
  }

  return false;
}