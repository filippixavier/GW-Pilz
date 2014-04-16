function Character(speed, height, width, type)
{
	this.x = 0;
	this.y = 0;
	this.orientation = 0;
	this.speed = speed;
	this.height = height;
	this.width = width;

	this.anim = {};
}

Character.prototype.move = function(direction, dt) {
	var previousOrientation = this.orientation;

	this.x += direction.x * this.speed * dt;
	this.y += direction.y * this.speed * dt;

	if(direction.x === 1)
		this.orientation = 1;
	else
		this.orientation = 3;
	if(direction.y === -1)
		this.orientation = 0;
	else
		this.orientation = 2;

	if(this.orientation !== previousOrientation)
	{
		//this.anim.changeOrientation(this.orientation);
	}
	else
	{
		//this.anim.update(dt);
	}

	if(direction.x === 0 && direction.y === 0)
	{
		//this.anim.stop();
	}
};

Character.prototype.teleport = function(position) {
	this.x = position.x;
	this.y = position.y;
};

Character.prototype.render = function() {
	this.anim.posiX = this.x;
	this.anim.posiY = this.y;
	this.anim.height = this.height;
	this.anim.width = this.width;
	renderingManager.checkIfInsideCamera(this.anim);
};

var direction = {x:0, y:0};

addEventListener("keydown", function(e)
{
	switch(e.keyCode)
	{
		case 90:
			direction.y = -1;
			break;
		case 83:
			direction.y = 1;
			break;
		case 81:
			direction.x = -1;
			break;
		case 68:
			direction.x = 1;
			break;
	}
});

addEventListener("keyup", function(e)
{
	if(e.keyCode === 90 || e.keyCode === 83)
		direction.y = 0;
	if(e.keyCode === 81 || e.keyCode === 68)
		direction.x = 0;
});