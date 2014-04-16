function Animation(parent, spritesheetName, startAnim)
{
	this.parent = parent;
	this.x = parent.x;
	this.y = parent.y;

	this.spritesheet = AssetsManager.getImage(spritesheetName);
	this.subAnims = AssetsManager.getAnimData(spritesheetName);

	this.dt = 0;
	this.pause = false;
	this.sens = 1;


	this.width = this.subAnims[startAnim].spriteWidth;
	this.height = this.subAnims[startAnim].spriteHeight;
	this.spriteX = 0;
	this.spriteY = this.subAnims[startAnim].line * this.height;
	this.loop = this.subAnims[startAnim].loop;
	this.reverse = this.subAnims[startAnim].reverse;
	this.duration = this.subAnims[startAnim].duration;
	this.numberOfFrames = this.subAnims[startAnim].numberOfFrames;

	renderingManager.addToDynamicObjects(this);
	this.stop();
}

Animation.prototype.start = function(subAnimName) {
	if(subAnimName === undefined)
		return;
	this.pause = false;
	this.spriteY = this.subAnims[subAnimName].line;
	this.spriteX = 0;
	this.dt = 0;
	this.loop = this.subAnims[subAnimName].loop;
	this.reverse = this.subAnims[subAnimName].reverse;
	this.duration = this.subAnims[subAnimName].duration;
};

Animation.prototype.stop = function() {
	var durOneFrame = this.duration/this.numberOfFrames;
	this.pause = true;
	this.dt = durOneFrame;
};

Animation.prototype.update = function(dt) {
	var durOneFrame = this.duration/this.numberOfFrames;
	if(!this.pause)
	{
		this.dt += dt * this.sens;
		if(this.reverse)
		{
			if(this.dt > this.duration)
			{
				this.dt = this.duration - durOneFrame;
				this.sens = -1;
			}

			if(this.dt < 0 && this.loop)
			{
				this.dt = durOneFrame;
				this.sens = 1;
			}
		}
		else if(this.loop)
		{
			if(this.dt < 0)
			{
				this.dt = 0;
				this.sens = 1;
			}

			this.dt = this.dt % this.duration;
		}
		
	}
	this.spriteX = ((this.dt/durOneFrame)|0) * this.width;
};

Animation.prototype.delete = function() {
	renderingManager.removeFromDynamicObjects(this);
};