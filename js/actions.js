function Actions()
{
  this.actions = new Array();
}

Actions.prototype.AddAction = function(func, time, blocking)
{
  var action = new Object();
  action.func = func;
  action.remaining_time = time;
  action.blocking = blocking;
  this.actions.push(action);
}

Actions.prototype.Update = function(dt)
{
  for (var i = 0; i < this.actions.length; ++i)
  {
    var action = this.actions[i];
    action.remaining_time -= dt;
    if (action.func(dt) == 0 || action.remaining_time <= 0)
    {
      var swap = this.actions[this.actions.length - 1];
      this.actions[this.actions.length - 1] = this.actions[i];
      this.actions[i] = swap;
      delete this.actions[this.actions.length - 1];
      this.actions.pop();
    }
    else if (action.blocking == true)
      return;
  }
}