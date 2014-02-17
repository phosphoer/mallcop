function tileBase(r, g, b, isVisible, isCollidable)
{
  this.r = r;
  this.g = g;
  this.b = b;
  this.isVisible = isVisible;
  this.isCollidable = isCollidable;
}

function World()
{
  this.worldArray = [];
  this.x = 90;
  this.y = 4;
  this.z = 50;
  this.hall_width = 11;
  this.wall_height = 3;
  this.hallways = [];
  this.num_trees = 0;

  var r_floor = 0.8;
  var g_floor = 0.8;
  var b_floor = 0.8;

  var r_wall = 0.8;
  var g_wall = 0.27;
  var b_wall = 0.0;

  var mid_hall_div = 5.0 / 3.0;
  var side_hall_div = ((mid_hall_div - 1.0) / mid_hall_div) / 2.0;
  mid_hall_div = 1.0 / mid_hall_div;

  this.mid_hall_z = Math.floor(mid_hall_div * this.z);
  this.side_hall_z = Math.floor(side_hall_div * this.z);

  for(var i = 0; i < this.x; ++i)
  {
    this.worldArray[i] = [];
    for(var j = 0; j < this.y; ++j)
    {
      this.worldArray[i][j] = [];
      for(var k = 0; k < this.z; ++k)
      {
        this.worldArray[i][j][k] = new tileBase(0.0, 0.0, 0.0, false, false);
      }
    }
  }

//generate hallways
  for(var lr = 0; lr < 2; ++lr)
  {
    this.hallways[lr] = [];
    var hall_start = 0;
    var i = 0;
    while(hall_start < this.x)
    {
      hall_start += Math.floor(Math.random()  * (this.hall_width / 1.5))+ 2;

      if(hall_start + this.hall_width >= this.x)
        break;

      this.hallways[lr][i] = hall_start;
      hall_start += this.hall_width;
      ++i;
    }
  }

  //loop through bottom layer
  var j = 0;
  //create middle hall
  for(var i = 0; i < this.x; ++i)
  {
    for(var k = 0; k < this.mid_hall_z; ++k)
    {
      var k_index = k + this.side_hall_z;
      var floorRandomOffset = Math.random();
      floorRandomOffset = (floorRandomOffset - 0.5) * 0.2;

      this.worldArray[i][j][k_index].r = r_floor + floorRandomOffset;
      this.worldArray[i][j][k_index].g = g_floor + floorRandomOffset;
      this.worldArray[i][j][k_index].b = b_floor + floorRandomOffset;
      this.worldArray[i][j][k_index].isCollidable = true;
      this.worldArray[i][j][k_index].isVisible = true;
    }
  }
  //create sub halls
  for(var lr = 0; lr < 2; ++lr)
  {
    var offset = lr * (this.side_hall_z + this.mid_hall_z);
    for(var current = 0; current < this.hallways[lr].length; ++current)
    {
      for(var i = this.hallways[lr][current]; i < this.hallways[lr][current] + this.hall_width; ++i)
      {
        for(var k = offset; k < offset + this.side_hall_z; ++k)
        {
          var floorRandomOffset = Math.random();
          floorRandomOffset = (floorRandomOffset - 0.5) * 0.2;
          this.worldArray[i][j][k].r = r_floor + floorRandomOffset;
          this.worldArray[i][j][k].g = g_floor + floorRandomOffset;
          this.worldArray[i][j][k].b = b_floor + floorRandomOffset;
          this.worldArray[i][j][k].isCollidable = true;
          this.worldArray[i][j][k].isVisible = true;
        }
      }
    }
  }

  //loop through wall layer
  ++j;
  for(;j < this.wall_height; ++j)
  {
    //create middle hall
    for(var i = 0; i < this.x; ++i)
    {
      var RandomOffset = (Math.random() - 0.5)*0.15;

      this.worldArray[i][j][this.side_hall_z].r = r_wall + RandomOffset;
      this.worldArray[i][j][this.side_hall_z].g = g_wall + RandomOffset;
      this.worldArray[i][j][this.side_hall_z].b = b_wall + RandomOffset;
      this.worldArray[i][j][this.side_hall_z].isCollidable = true;
      this.worldArray[i][j][this.side_hall_z].isVisible = true;

      RandomOffset = (Math.random() - 0.5)*0.15;

      this.worldArray[i][j][this.side_hall_z + this.mid_hall_z - 1].r = r_wall + RandomOffset;
      this.worldArray[i][j][this.side_hall_z + this.mid_hall_z - 1].g = g_wall + RandomOffset;
      this.worldArray[i][j][this.side_hall_z + this.mid_hall_z - 1].b = b_wall + RandomOffset;
      this.worldArray[i][j][this.side_hall_z + this.mid_hall_z - 1].isCollidable = true;
      this.worldArray[i][j][this.side_hall_z + this.mid_hall_z - 1].isVisible = true;
    }
    for(var k = 0; k < this.mid_hall_z; ++k)
    {
      var RandomOffset = (Math.random() - 0.5)*0.15;

      this.worldArray[0][j][k + this.side_hall_z].r = r_wall + RandomOffset;
      this.worldArray[0][j][k + this.side_hall_z].g = g_wall + RandomOffset;
      this.worldArray[0][j][k + this.side_hall_z].b = b_wall + RandomOffset;
      this.worldArray[0][j][k + this.side_hall_z].isCollidable = true;
      this.worldArray[0][j][k + this.side_hall_z].isVisible = true;

      RandomOffset = (Math.random() - 0.5)*0.15;

      this.worldArray[this.x - 1][j][k + this.side_hall_z].r = r_wall + RandomOffset;
      this.worldArray[this.x - 1][j][k + this.side_hall_z].g = g_wall + RandomOffset;
      this.worldArray[this.x - 1][j][k + this.side_hall_z].b = b_wall + RandomOffset;
      this.worldArray[this.x - 1][j][k + this.side_hall_z].isCollidable = true;
      this.worldArray[this.x - 1][j][k + this.side_hall_z].isVisible = true;
      /*
      for(var i = 0; i < this.x; ++i)
      {
        this.worldArray[i][j][k + side_hall_z].r = r_wall;
        this.worldArray[i][j][k + side_hall_z].g = g_wall;
        this.worldArray[i][j][k + side_hall_z].b = b_wall;
        this.worldArray[i][j][k + side_hall_z].isCollidable = true;
        this.worldArray[i][j][k + side_hall_z].isVisible = true;

        if(i == 0 && (k != 0 && k != (side_hall_z + mid_hall_z - 1)))
          i = this.x - 2;
      }*/
    }

    //create sub halls
    for(var lr = 0; lr < 2; ++lr)//above/below side halls
    {
      var offset = lr * (this.side_hall_z + this.mid_hall_z);
      for(var current = 0; current < this.hallways[lr].length; ++current)//each current hall on side 'lr'
      {
        for(var i = this.hallways[lr][current]; i < this.hallways[lr][current] + this.hall_width; ++i)//loop over xcoords on this hallway
        {
          if(i != this.hallways[lr][current] && i != this.hallways[lr][current] + this.hall_width - 1)
          {
            if(lr == 0)//above mid hall
            {
              //open doorway
              this.worldArray[i][j][this.side_hall_z].isCollidable = false;
              this.worldArray[i][j][this.side_hall_z].isVisible = false;
              //close back

              var RandomOffset = (Math.random() - 0.5)*0.15;
              this.worldArray[i][j][0].r = r_wall + RandomOffset;
              this.worldArray[i][j][0].g = g_wall + RandomOffset;
              this.worldArray[i][j][0].b = b_wall + RandomOffset;
              this.worldArray[i][j][0].isCollidable = true;
              this.worldArray[i][j][0].isVisible = true;
            }
            else//below mid hall
            {
              //open doorway
              this.worldArray[i][j][this.side_hall_z + this.mid_hall_z - 1].isCollidable = false;
              this.worldArray[i][j][this.side_hall_z + this.mid_hall_z - 1].isVisible = false;
              //close back
              var RandomOffset = (Math.random() - 0.5)*0.15;
              this.worldArray[i][j][this.z - 1].r = r_wall + RandomOffset;
              this.worldArray[i][j][this.z - 1].g = g_wall + RandomOffset;
              this.worldArray[i][j][this.z - 1].b = b_wall + RandomOffset;
              this.worldArray[i][j][this.z - 1].isCollidable = true;
              this.worldArray[i][j][this.z - 1].isVisible = true;
            }
          }
          else
          {
            for(var k = offset; k < offset + this.side_hall_z; ++k)//set walls along z coords
            {
              var RandomOffset = (Math.random() - 0.5)*0.15;

              this.worldArray[i][j][k].r = r_wall + RandomOffset;
              this.worldArray[i][j][k].g = g_wall + RandomOffset;
              this.worldArray[i][j][k].b = b_wall + RandomOffset;
              this.worldArray[i][j][k].isCollidable = true;
              this.worldArray[i][j][k].isVisible = true;
            }
          }//end else (wall of a side hall)
        }//end for all x coords on this hall
      }//end for(loop through halls on this side)
    }//end for halls on both sides of mid hall
  }//loop through wall layer

  this.AddKiosks();
}//end of world class

World.prototype.PlaceFoliage = function(x, z, xmax, zmax, xmin, zmin)
{
  //create foliage, return false if collides with stuff
   for(var i = x; i < x + 6; ++i)
    for(var k = z; k < z + 3; ++k)
    {
       if(i < xmin || i >= xmax || k < zmin || k >= zmax)
        return false;
      if(this.worldArray[i][1][k].isCollidable)
        return false;
    }

//create planter
  for(var i = x; i < x + 6; ++i)
    for(var k = z; k < z + 3; ++k)
    {
      var RandomOffset = (Math.random() - 0.5)*0.10;

      this.worldArray[i][1][k].r = 0.9 + RandomOffset;
      this.worldArray[i][1][k].g = 0.9 + RandomOffset;
      this.worldArray[i][1][k].b = 0.9 + RandomOffset;
      this.worldArray[i][1][k].isCollidable = true;
      this.worldArray[i][1][k].isVisible = true;
    }

//create inner greens
for(var i = x + 1; i < x + 5; ++i)
{
  var RandomOffset = (Math.random() - 0.5)*0.10;

  this.worldArray[i][1][z + 1].r = 0.15 + RandomOffset;
  this.worldArray[i][1][z + 1].g = 0.9 + RandomOffset;
  this.worldArray[i][1][z + 1].b = 0.05 + RandomOffset;
  this.worldArray[i][1][z + 1].isCollidable = true;
  this.worldArray[i][1][z + 1].isVisible = true;
}

var RandomOffset = (Math.random() - 0.5)*0.10;
var RandomBush = Math.floor(Math.random() * 4);
this.worldArray[x + 1 + RandomBush][2][z + 1].r = 0.15 + RandomOffset;
this.worldArray[x + 1 + RandomBush][2][z + 1].g = 0.9 + RandomOffset;
this.worldArray[x + 1 + RandomBush][2][z + 1].b = 0.05 + RandomOffset;
this.worldArray[x + 1 + RandomBush][2][z + 1].isCollidable = true;
this.worldArray[x + 1 + RandomBush][2][z + 1].isVisible = true;

RandomOffset = (Math.random() - 0.5)*0.10;
RandomBush = Math.floor(Math.random() * 4);
this.worldArray[x + 1 + RandomBush][2][z + 1].r = 0.15 + RandomOffset;
this.worldArray[x + 1 + RandomBush][2][z + 1].g = 0.9 + RandomOffset;
this.worldArray[x + 1 + RandomBush][2][z + 1].b = 0.05 + RandomOffset;
this.worldArray[x + 1 + RandomBush][2][z + 1].isCollidable = true;
this.worldArray[x + 1 + RandomBush][2][z + 1].isVisible = true;

  //6x3
  return true;
}

World.prototype.PlaceFern = function(x, z, xmax, zmax, xmin, zmin)
{
  //create fern, return false if collides with stuff

  for(var i = x; i < x + 3; ++i)
    for(var k = z; k < z + 3; ++k)
    {
       if(i < xmin || i >= xmax || k < zmin || k >= zmax)
        return false;
      if(this.worldArray[i][1][k].isCollidable)
        return false;
    }

  var planter_r = 0.3;
  var planter_g = 0.3;
  var planter_b = 0.8;

  var trunk_r = 0.8;
  var trunk_g = 0.27;
  var trunk_b = 0.0;

  var frond_r = .15;
  var frond_g = .9;
  var frond_b = .05;

  //planter pieces
  var RandomOffset = (Math.random() - 0.5)*0.10;

  this.worldArray[x + 1][1][z].r = planter_r + RandomOffset;
  this.worldArray[x + 1][1][z].g = planter_g + RandomOffset;
  this.worldArray[x + 1][1][z].b = planter_b + RandomOffset;
  this.worldArray[x + 1][1][z].isCollidable = true;
  this.worldArray[x + 1][1][z].isVisible = true;

  RandomOffset = (Math.random() - 0.5)*0.10;

  this.worldArray[x ][1][z+ 1].r = planter_r + RandomOffset;
  this.worldArray[x ][1][z+ 1].g = planter_g + RandomOffset;
  this.worldArray[x ][1][z+ 1].b = planter_b + RandomOffset;
  this.worldArray[x ][1][z+ 1].isCollidable = true;
  this.worldArray[x ][1][z + 1].isVisible = true;

  RandomOffset = (Math.random() - 0.5)*0.10;

  this.worldArray[x + 1][1][z + 2].r = planter_r + RandomOffset;
  this.worldArray[x + 1][1][z + 2].g = planter_g + RandomOffset;
  this.worldArray[x + 1][1][z + 2].b = planter_b + RandomOffset;
  this.worldArray[x + 1][1][z + 2].isCollidable = true;
  this.worldArray[x + 1][1][z + 2].isVisible = true;

  RandomOffset = (Math.random() - 0.5)*0.10;

  this.worldArray[x + 2][1][z + 1].r = planter_r + RandomOffset;
  this.worldArray[x + 2][1][z + 1].g = planter_g + RandomOffset;
  this.worldArray[x + 2][1][z + 1].b = planter_b + RandomOffset;
  this.worldArray[x + 2][1][z + 1].isCollidable = true;
  this.worldArray[x + 2][1][z + 1].isVisible = true;

  //trunk

  RandomOffset = (Math.random() - 0.5)*0.10;

  this.worldArray[x + 1][1][z + 1].r = trunk_r + RandomOffset;
  this.worldArray[x + 1][1][z + 1].g = trunk_g + RandomOffset;
  this.worldArray[x + 1][1][z + 1].b = trunk_b + RandomOffset;
  this.worldArray[x + 1][1][z + 1].isCollidable = true;
  this.worldArray[x + 1][1][z + 1].isVisible = true;

  RandomOffset = (Math.random() - 0.5)*0.10;

  this.worldArray[x + 1][2][z + 1].r = trunk_r + RandomOffset;
  this.worldArray[x + 1][2][z + 1].g = trunk_g + RandomOffset;
  this.worldArray[x + 1][2][z + 1].b = trunk_b + RandomOffset;
  this.worldArray[x + 1][2][z + 1].isCollidable = true;
  this.worldArray[x + 1][2][z + 1].isVisible = true;

  //fronds

  RandomOffset = (Math.random() - 0.5)*0.20;

  this.worldArray[x + 1][3][z].r = frond_r + RandomOffset;
  this.worldArray[x + 1][3][z].g = frond_g + RandomOffset;
  this.worldArray[x + 1][3][z].b = frond_b + RandomOffset;
  this.worldArray[x + 1][3][z].isCollidable = true;
  this.worldArray[x + 1][3][z].isVisible = true;

  RandomOffset = (Math.random() - 0.5)*0.20;

  this.worldArray[x][3][z + 1].r = frond_r + RandomOffset;
  this.worldArray[x][3][z + 1].g = frond_g + RandomOffset;
  this.worldArray[x][3][z + 1].b = frond_b + RandomOffset;
  this.worldArray[x][3][z + 1].isCollidable = true;
  this.worldArray[x][3][z + 1].isVisible = true;

  RandomOffset = (Math.random() - 0.5)*0.20;

  this.worldArray[x + 1][3][z + 2].r = frond_r + RandomOffset;
  this.worldArray[x + 1][3][z + 2].g = frond_g + RandomOffset;
  this.worldArray[x + 1][3][z + 2].b = frond_b + RandomOffset;
  this.worldArray[x + 1][3][z + 2].isCollidable = true;
  this.worldArray[x + 1][3][z + 2].isVisible = true;

  RandomOffset = (Math.random() - 0.5)*0.20;

  this.worldArray[x + 2][3][z + 1].r = frond_r + RandomOffset;
  this.worldArray[x + 2][3][z + 1].g = frond_g + RandomOffset;
  this.worldArray[x + 2][3][z + 1].b = frond_b + RandomOffset;
  this.worldArray[x + 2][3][z + 1].isCollidable = true;
  this.worldArray[x + 2][3][z + 1].isVisible = true;

  RandomOffset = (Math.random() - 0.5)*0.20;

  this.worldArray[x + 1][2][z - 1].r = frond_r + RandomOffset;
  this.worldArray[x + 1][2][z - 1].g = frond_g + RandomOffset;
  this.worldArray[x + 1][2][z - 1].b = frond_b + RandomOffset;
  this.worldArray[x + 1][2][z - 1].isCollidable = true;
  this.worldArray[x + 1][2][z - 1].isVisible = true;

  RandomOffset = (Math.random() - 0.5)*0.20;

  this.worldArray[x - 1][2][z + 1].r = frond_r + RandomOffset;
  this.worldArray[x - 1][2][z + 1].g = frond_g + RandomOffset;
  this.worldArray[x - 1][2][z + 1].b = frond_b + RandomOffset;
  this.worldArray[x - 1][2][z + 1].isCollidable = true;
  this.worldArray[x - 1][2][z + 1].isVisible = true;

  RandomOffset = (Math.random() - 0.5)*0.20;

  this.worldArray[x + 1][2][z + 3].r = frond_r + RandomOffset;
  this.worldArray[x + 1][2][z + 3].g = frond_g + RandomOffset;
  this.worldArray[x + 1][2][z + 3].b = frond_b + RandomOffset;
  this.worldArray[x + 1][2][z + 3].isCollidable = true;
  this.worldArray[x + 1][2][z + 3].isVisible = true;

  RandomOffset = (Math.random() - 0.5)*0.20;

  this.worldArray[x + 3][2][z + 1].r = frond_r + RandomOffset;
  this.worldArray[x + 3][2][z + 1].g = frond_g + RandomOffset;
  this.worldArray[x + 3][2][z + 1].b = frond_b + RandomOffset;
  this.worldArray[x + 3][2][z + 1].isCollidable = true;
  this.worldArray[x + 3][2][z + 1].isVisible = true;

  //3x3 (fronds can extend to make it 5x5)
}

World.prototype.PlaceBench = function(x, z, xmax, zmax, xmin, zmin)
{
  //create bench, return false if collides with stuff

  if(x < xmin || x >= xmax)
    return false;

  for(var k = z; k < z + 4; ++k)
  {
    if(k < zmin || k >= zmax)
      return false;
    if(this.worldArray[x][1][k].isCollidable)
      return false;
  }

  for(var k = z; k < z + 4; ++k)
  {
    var RandomOffset = (Math.random() - 0.5)*0.10;

      this.worldArray[x][1][k].r = 0.85 + RandomOffset;
      this.worldArray[x][1][k].g = 0.6 + RandomOffset;
      this.worldArray[x][1][k].b = 0.1 + RandomOffset;
      this.worldArray[x][1][k].isCollidable = true;
      this.worldArray[x][1][k].isVisible = true;
  }

  //4x1
  return true;
}

World.prototype.PlaceTable = function(x, z, xmax, zmax, xmin, zmin)
{
  //create table, return false if collides with stuff

  for(var i = x; i < x + 4; ++i)
    for(var k = z; k < z + 4; ++k)
    {
      if(i < xmin || i >= xmax || k < zmin || k >= zmax)
        return false;
      if(this.worldArray[i][1][k].isCollidable)
        return false;
    }

  //create table
  for(var i = x; i < x + 4; ++i)
    for(var k = z; k < z + 4; ++k)
    {
      var RandomOffset = (Math.random() - 0.5)*0.10;

      this.worldArray[i][1][k].r = 0.8 + RandomOffset;
      this.worldArray[i][1][k].g = 0.4 + RandomOffset;
      this.worldArray[i][1][k].b = 0.05 + RandomOffset;
      this.worldArray[i][1][k].isCollidable = true;
      this.worldArray[i][1][k].isVisible = true;
    }

  //4x4
  return true;
}

World.prototype.AddKiosks = function()
{
  //decide how many to place

  var xmin = 2;
  var xmax = this.x - 1;
  var zmin = this.side_hall_z + 2;
  var zmax = this.side_hall_z + this.mid_hall_z - 2;

  var total_kiosks = (xmax - xmin) * (zmax - zmin) / 110;

  //pick random kiosk
  for(var i = 0; i < total_kiosks; ++i)
  {
    var kiosktype = Math.random() * 4.0;
    if(kiosktype < 1.3)
      kiosktype = 0;
    else if(kiosktype < 1.5)
      kiosktype = 1;
    else if(kiosktype < 2.7)
      kiosktype = 2;
    else
      kiosktype = 3;
    //var kioskfunc = this.PlaceTable;
    /*
    if(kiosktype == 0)
      kioskfunc = this.PlaceFoliage;
    else if(kiosktype == 1)
      kioskfunc = this.PlaceBench;
    */

    var limitattempts = 15;
    var x = 0.0;
    var z = 0.0;
    var succeeded = false;
    do
    {
      --limitattempts;
      x = xmin + Math.floor(Math.random() * (xmax - xmin));
      z = zmin + Math.floor(Math.random() * (zmax - zmin));

      if(kiosktype == 0)
        succeeded = this.PlaceFoliage(x, z, xmax, zmax, xmin, zmin);
      else if(kiosktype == 1)
        succeeded = this.PlaceFern(x, z, xmax, zmax, xmin, zmin);
      else if(kiosktype == 2)
        succeeded = this.PlaceBench(x, z, xmax, zmax, xmin, zmin);
      else
        succeeded = this.PlaceTable(x, z, xmax, zmax, xmin, zmin);
      //generate coords
    }while(limitattempts && !succeeded);

    if(limitattempts == 0)
      break;
  }
    //rand coords till placeable
}


World.prototype.collidePoint = function(x, z)
{
  if(x < 0 || x >= this.x)
    return false;
  if(z < 0 || z >= this.z)
    return false;
  if(this.worldArray[Math.floor(x)][1][Math.floor(z)].isCollidable == true)
    return true;

  return false;
}

World.prototype.getTilesInLine = function(x0, y0, x1, y1)
{
  var result = [];

  var steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
  if (steep)
  {
    var temp = x0;
    x0 = y0;
    y0 = temp;

    temp = x1;
    x1 = y1;
    y1 = temp;
  }
  if (x0 > x1)
  {
    var temp = x0;
    x0 = x1;
    x1 = temp;

    temp = y0;
    y0 = y1;
    y1 = temp;
  }

  var deltax = x1 - x0;
  var deltay = Math.abs(y1 - y0);
  var error = 0;
  var ystep;
  var y = y0;

  if (y0 < y1)
    ystep = 1;
  else ystep = -1;

  for (var x = x0; x <= x1; x++)
  {
    if (steep)
      result.push([y, x]);
    else
      result.push([x, y]);

    error += deltay;
    if (2 * error >= deltax)
    {
      y += ystep;
      error -= deltax;
    }
  }

  return result;
}

World.prototype.rayCastToPoint = function(x0, y0, x1, y1, hit)
{
  var tiles = this.getTilesInLine(x0, y0, x1, y1);
  if (tiles.length == 0)
    return false;

  var start = tiles[0];
  if (start[0] != x0 && start[1] != y0)
    tiles.reverse();

  for (i in tiles)
  {
    var tile = tiles[i];
    var x = Math.floor(tile[0]);
    var z = Math.floor(tile[1]);

    if (x < 0 || x >= this.x)
      return;
    if (z < 0 || z >= this.z)
      return false;

    // this.worldArray[x][0][z].r = 1;
    // this.worldArray[x][0][z].g = 0;
    // this.worldArray[x][0][z].b = 0;

    if (this.worldArray[x][1][z].isCollidable)
    {
      hit[0] = x;
      hit[1] = 1;
      hit[2] = z;
      return true;
    }
  }

  return false;
}

World.prototype.setColor = function(x, y, z, r, g, b)
{
  if (x < 0 || x >= this.x)
    return;
  if (y < 0 || y >= this.y)
    return;
  if (z < 0 || z >= this.z)
    return;

  this.worldArray[x][y][z].r = r;
  this.worldArray[x][y][z].g = g;
  this.worldArray[x][y][z].b = b;
}

World.prototype.multiplyColor = function(x, y, z, amount)
{
  if (x < 0 || x >= this.x)
    return;
  if (y < 0 || y >= this.y)
    return;
  if (z < 0 || z >= this.z)
    return;

  this.worldArray[x][y][z].r *= amount;
  this.worldArray[x][y][z].g *= amount;
  this.worldArray[x][y][z].b *= amount;
}

World.prototype.bloodSplat = function(x, z, dir)
{
  if (x < 0 || x >= this.x)
    return;
  if (z < 0 || z >= this.z)
    return;

  x = Math.floor(x);
  z = Math.floor(z);

  for (var j = 0; j < 5; ++j)
  {
    dir += Math.random() * 0.5 - 0.25;
    for (var i = 0; i < 5; ++i)
    {
      if (1)
      {
        var xi = Math.floor(x + Math.cos(dir) * (Math.random() * 2 + i));
        var zi = Math.floor(z + Math.sin(dir) * (Math.random() * 2 + i));

        if (xi < 0 || xi >= this.x)
          continue;
        if (zi < 0 || zi >= this.z)
          continue;

        var subtract = Math.random() * 0.5;

        this.worldArray[xi][0][zi].r += 0.3 + Math.random() * 0.7;
        this.worldArray[xi][0][zi].g -= subtract;
        this.worldArray[xi][0][zi].b -= subtract;

        if (this.worldArray[xi][0][zi].r > 1) this.worldArray[xi][0][zi].r = 1;
        if (this.worldArray[xi][0][zi].g < 0) this.worldArray[xi][0][zi].g = 0;
        if (this.worldArray[xi][0][zi].b < 0) this.worldArray[xi][0][zi].b = 0;

        for (var n = 1; n < this.y; ++n)
        {
          subtract = Math.random() * 0.2;
          this.worldArray[xi][n][zi].r = 0.5 + Math.random() * 0.5;
          this.worldArray[xi][n][zi].g = subtract;
          this.worldArray[xi][n][zi].b = subtract;

          if (this.worldArray[xi][n][zi].r > 1) this.worldArray[xi][n][zi].r = 1;
          if (this.worldArray[xi][n][zi].g < 0) this.worldArray[xi][n][zi].g = 0;
          if (this.worldArray[xi][n][zi].b < 0) this.worldArray[xi][n][zi].b = 0;
        }
      }
    }
  }
}