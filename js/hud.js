function HUD()
{
  // Create score view
  this.score = $("<div>").appendTo($("body"));
  $(this.score).addClass("HUD");
  $(this.score).css("left", $("#main_canvas").attr("left"));
  $(this.score).css("top", 10);

  // Create controls
  this.controls = $("<div>").appendTo($("body"));
  $(this.controls).addClass("HUD");
  $(this.controls).css("left", $("#main_canvas").attr("left"));
  $(this.controls).css("top", 10);
  $(this.controls).text("WASD - Move, Mouse - Aim, Left Click - Shoot");
}

HUD.prototype.Update = function(dt)
{
  $(this.score).text("High Score: " + JSEngine.game.high_score + " Score: " + JSEngine.game.score + " Merchandise: " + JSEngine.game.merchandise);
}