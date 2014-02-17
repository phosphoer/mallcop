function Game()
{
  // Score tracking
  this.merchandise = 100;
  this.score = 0;
  this.high_score = 0;
  this.kill_time = 0;
  this.num_sneaks = 0;
  this.next_steal = 0;
  this.lost = false;

  // Retrieve high score
  if (localStorage.mall_cop_me_high_score)
    this.high_score = localStorage.mall_cop_me_high_score;

  // Create the player
  this.player = JSEngine.factory.CreateGameObject();
  this.player.components.player = new Player(this.player);
  this.player.components.renderable = new Renderable(this.player);
  this.player.components.collider = new WorldAABBCollider(this.player);
  this.player.x = 50;
  this.player.z = 35;

  // Create music
  this.background_music = new Audio('sound/newgrounds_elevator.ogg');
  this.background_music.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
  }, false);
  this.background_music.play();
}

Game.prototype.Update = function(dt)
{
  this.kill_time += dt;
  if (this.kill_time >= 1 && this.num_sneaks > 5)
  {
    this.kill_time = 0;
    this.next_steal += this.num_sneaks * 0.2;
  }

  if (this.next_steal >= 2)
  {
    --this.merchandise;
    this.next_steal = 0;
  }

  if (this.merchandise <= 0 && !this.lost)
  {
    this.lost = true;
    window.location = "lose.html";
  }

  if (this.score > this.high_score)
  {
    this.high_score = this.score;
    localStorage.mall_cop_me_high_score = this.score;
  }
}