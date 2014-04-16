function Animation(parent, spritesheetName, subAnimDatas, startAnim)
{
	this.parent = parent;
	this.x = parent.x;
	this.y = parent.y;

	this.spritesheet = AssetsManager.getImage(spritesheetName);
	this.subAnims = subAnimDatas;

	
	this.dt = 0;
	this.pause = false;


	this.width = this.subAnims[startAnim].spriteWidth;
	this.height = this.subAnims[startAnim].spriteHeight;
	this.spriteX = 0;
	this.spriteY = this.subAnims[startAnim].line * this.height;
	this.loop = this.subAnims[startAnim].loop;
	this.reverse = this.subAnims[startAnim].reverse;
	this.duration = this.subAnims[startAnim].duration;
	this.numberOfFrames = this.subAnims[startAnim].numberOfFrames;
}

Animation.prototype.start = function(subAnimName) {
	this.spriteY = this.subAnims[subAnimName].line;
	this.spriteX = 0;
	this.dt = 0;
	this.loop = this.subAnims[subAnimName].loop;
	this.reverse = this.subAnims[subAnimName].reverse;
	this.duration = this.subAnims[subAnimName].duration;
};

Animation.prototype.update = function(dt) {
	var durOneFrame = this.duration/this.numberOfFrames;
	if(!this.pause)
	{
		this.dt += dt;
		this.dt = this.dt % this.duration;
		this.spriteX = ((this.dt/durOneFrame)|0) * this.width;
		renderingManager.updateDisplayData(this);
	}
};

var renderingManager = function (argument) {
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                      window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    var canvas, ctx, animations;

    function init()
    {
    	animations = [];
    	canvas = document.getElementById("canvas");
		canvas.height = 720;
		canvas.width = 1080;
		ctx = document.getElementById("canvas").getContext("2d");
    }

    function update()
    {
    	for(var i = 0; animations[i]; i++)
    	{
    		//console.log(i);
    		ctx.fillRect(0,0,1000,1000);
    		ctx.drawImage(animations[i].spritesheet, animations[i].spriteX, animations[i].spriteY, animations[i].width, animations[i].height, animations[i].x, animations[i].y, animations[i].width, animations[i].height);
    		// ctx.drawImage(animations[i].spritesheet, 0, 0, 750, 750, 0,0, )
    	}
    }

    function updateDisplayData (animation) {
    	var i = animations.indexOf(animation);
    	if(i == -1)
    	{
    		animations.push(animation);
    	}
    }

    return {
    	init : init,
    	update: update,
    	updateDisplayData: updateDisplayData
    }
}();

var test;
var t1, t2;


function init () {
	renderingManager.init();
	AssetsManager.init();

	test = {};
	test.x = 250;
	test.y = 250;
	test.anim = new Animation(test, "mainchar",
	 AssetsManager.getAnimData("mainchar"),
	  "up");

	t1 = Date.now();
	run();
}

function run () {
	t2 = Date.now();
	var dt = t2-t1;
	t1 = t2;

	test.anim.update(dt);
	renderingManager.update();

	requestAnimationFrame(run);
}

onload = init;