var Obstacle = function(config){
	this.x = config.x;
	this.y = config.y;
	this.content = config.content;
	this.img = AssetsManager.getImage(config.type);
	// this.width = this.img.width;
	// this.height = this.img.height;
	if (config.facing == 1)
	{
		this.currentFrame = 0;
	}
	else if (config.facing == 2)
	{
		this.currentFrame = 1;
	}
	else if (config.facing == 3)
	{
		this.currentFrame = 2;
	}
	else if (config.facing == 0)
	{
		this.currentFrame = 3;
	}
	this.draw = function(context)
	{
		// context.drawImage(this.img, 0, 0, this.currentFrame*this.width, 0, this.x, this.y, this.width, this.height);
	}
	this.action = function()
	{
		this.content.substr(0,this.content.length-2);
		if (this.content == "pilz")
		{
			// ajouter pilz
		}
		else if (this.content == "key")
		{
			//  ajouter clef
		}
		else if (this.content == "note")
		{
			//  afficher une note
		}
		this.content = "";
	}
}