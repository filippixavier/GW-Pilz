function Character(x,y,speed, height, width, type)
{
	this.x = x;
	this.y = y;
	this.orientation = 0;
	this.speed = speed;
	this.height = height;
	this.width = width;

	this.type = type;

	this.anim = new Animation(this, type, "up");
	
	this.event = new EventListener();
	this.event.create("move");
	// player.event.subscribe("move", clb);
	
	this.sightRadius = -1;
	this.angleRadius = -1;
	this.territoryCenter = {x: 0, y: 0};
	this.territoryRadius = -1;
	this.pattern = [];
	this.patternMaxDist = -1;
	this.isIA = false;
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
		this.anim.stop();
	}
	else if(this.anim.pause)
	{
		var sens;
		switch(this.orientation)
		{
			case 0:
				sens = "up";
				break;
		}
		this.anim.start(sens);
	}
	MapManager.collision(this);
	MapManager.collideDoor(this);

	MapManager.collideObstacles(this, direction);


	this.event.emit("move", this.x, this.y);

};

Character.prototype.teleport = function(x, y) {
	this.x = x;
	this.y = y;

	this.event.emit("move", this.x, this.y);
};

Character.prototype.render = function(dt) {
	this.anim.x = this.x;
	this.anim.y = this.y;

	this.anim.update(dt);
};

Character.prototype.delete = function() {
	this.anim.delete();
};


Character.prototype.setIa = function(x, y ) {
	this.territoryCenter.x = this.x;
	this.territoryCenter.x = this.x;
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