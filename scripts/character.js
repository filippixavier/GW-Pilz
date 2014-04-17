function Character(x,y,speed, height, width, type)
{
	this.x = x;
	this.y = y;
	this.orientation = 0;
	this.speed = speed;
	this.height = height;
	this.width = width;
	this.keys = [];
	this.type = type;

	this.anim = new Animation(this, type, "up");
	
	this.event = new EventListener();
	this.event.create("move");
	
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

	if (direction.x != 0 || direction.y != 0)
	{
		if(direction.x === 1)
		{
			this.orientation = 1;
		}
		else if(direction.x === -1)
		{
			this.orientation = 3;
		}
		if(direction.y === -1)
		{
			this.orientation = 0;
		}
		else if(direction.y === 1)
		{
			this.orientation = 2;
		}
	}
	if(this.orientation !== previousOrientation)
	{
		previousOrientation = this.orientation;
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
			case 1:
				sens = "right";
				break;
			case 2:
				sens = "down";
				break;
			case 3:
				sens = "left";
				break;
		}
		this.anim.start(sens);
	}
	MapManager.collision(this);
	MapManager.collideDoor(this);
	MapManager.checkFacingObstacles(this);
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

Character.prototype.setIa = function(tradius) {
	this.territoryCenter.x = this.x;
	this.territoryCenter.x = this.x;
	this.territoryRadius = tradius || 200;
	this.isIA = true;
};

Character.prototype.protectTerritory = function(character) {
	var x,y,dx=0,dy=0;
	if(this.isIA)
	{
		x = character.x - this.x;
		y = character.y - this.y;

		if(x*x + y*y <= this.sightRadius*this.sightRadius)
		{
			if(character.x + character.width < this.x)
				dx = -1;
			else if(character.x > this.x + this.width)
				dx = 1;
			if (character.y + character.height < this.y)
				dy = -1;
			else if(character.y > this.y + this.height)
				dy = 1;
		}
		else
		{
			if(this.territoryCenter.x < this.x)
				dx = -1;
			else if(this.territoryCenter.x > this.x + this.width)
				dx = 1;
			if (this.territoryCenter.y < this.y)
				dy = -1;
			else if(this.territoryCenter.y > this.y + this.height)
				dy = 1;
		}
	}
};

var direction = {x:0, y:0};

(function(){
	var eventList = {};

	window.addEventListener("keydown", function(e)
	{
		eventList[e.keyCode] = true;
		calculateDirection();
	});

	window.addEventListener("keyup", function(e)
	{
		eventList[e.keyCode] = false;
		calculateDirection();
	});

	function calculateDirection()
	{
		if(eventList[90])
			direction.y -= 1;
		if(eventList[83])
			direction.y += 1;
		if(eventList[81])
			direction.x -= 1;
		if(eventList[68])
			direction.x += 1;

		if(direction.x < -1)
			direction.x = -1;
		if(direction.x > 1)
			direction.x = 1;
		if(direction.y < -1)
			direction.y = -1;
		if(direction.y > 1)
			direction.y = 1;

		if(!eventList[90] && !eventList[83])
			direction.y = 0;
		if(!eventList[81] && !eventList[68])
			direction.x = 0;
	}
})();