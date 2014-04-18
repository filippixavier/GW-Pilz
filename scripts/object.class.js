var Obstacle = function(config){
	this.x = config.x;
	this.y = config.y;
	this.content = config.content;
	this.facing = config.facing;
	this.animData = AssetsManager.getAnimData(config.type);
	if (this.animData != null)
	{
		if (this.animData.duration == undefined)
		{
			//this.img = AssetsManager.getImage(config.type);
		}
	}
	this.img = AssetsManager.getImage(config.type);
	this.width = this.animData.spriteWidth;
	this.height = this.animData.spriteHeight;
	
	// if (config.facing == 1)
	// {
	// 	this.currentFrame = 0;
	// }
	// else if (config.facing == 2)
	// {
	// 	this.currentFrame = 1;
	// }
	// else if (config.facing == 3)
	// {
	// 	this.currentFrame = 2;
	// }
	// else if (config.facing == 0)
	// {
	// 	this.currentFrame = 3;
	// }
	// this.draw = function(context)
	// {
	// 	// context.drawImage(this.img, 0, 0, this.currentFrame*this.width, 0, this.x, this.y, this.width, this.height);
	// 	context.drawImage(this.img, this.x, this.y, this.width, this.height);
	// }

	this.action = function(charac)
	{
		if (this.content == "pilz")
		{
			timer.changeTime(60000);
		}
		else if (this.content.substr(0,this.content.length-1) == "key")
		{
			charac.keys.push(this.content)
			console.log(charac.keys);
		}
		this.content = "";
	}

	this.awake = function()
	{
		renderingManager.addToStaticObjects(this.img,this.x,this.y,this.width,this.height, this.animData.spriteX, this.animData.spriteY);
	}
}