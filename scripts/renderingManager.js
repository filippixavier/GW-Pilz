var renderingManager = function ()
{
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                      window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
     
	var cameraCanvas , cameraCtx, mapCanvas, mapCtx, dynamicCanvas, dynamicCtx, textCanvas, textCtx, cameraX = 0 , cameraY = 0;

	var floor, wall, door;

	var assetsRendered = [], staticObjects = [], debug = [];
	var exclamP;
	var t = "0";
	var drawing = false;
	var drawX, drawY;
	// var menu, aide;
	var menuImageStatus = false;

	function init ()
	{
		cameraCanvas = document.getElementById("canvas");
		cameraCanvas.height = 720;
		cameraCanvas.width = 1080;
		cameraCtx = cameraCanvas.getContext("2d");

		mapCanvas = document.createElement("canvas");
		mapCanvas.width = 2000;
		mapCanvas.height = 2000;
  		mapCtx = mapCanvas.getContext("2d");

  		dynamicCanvas = document.createElement("canvas");
		dynamicCanvas.width = 2000;
		dynamicCanvas.height = 2000;
  		dynamicCtx = dynamicCanvas.getContext("2d");

  		textCanvas = document.createElement("canvas");
  		textCanvas.height = 720;
  		textCanvas.width = 1080;
  		textCtx = textCanvas.getContext('2d');
  		foreground = new Image();
		foreground.src = "assets/Stade_01.png";
		foreground2 = new Image();
		foreground2.src = "assets/Stade_02.png";
		foreground3 = new Image();
		foreground3.src = "assets/Stade_03.png";
		
		menu = new Image();
		menu.src = "assets/menu2.png";
		menu.onload = function(){
			menuImageStatus = true;
		}
		aide = new Image();
		aide.src = "assets/aide.png";

  		assetsRendered = [];
  		staticObjects = [];
  		exclamP = AssetsManager.getImage('exclam');
	}
	function drawMenu (){
		if (!menu.complete)
		{
			return;
		}
		cameraCtx.drawImage(menu, 0,0,1080,720);
	}

	function drawMap (map, doorname, floorname, wallname)
	{
		var floorD, wallD, doorD;
		floorD = AssetsManager.getAnimData(floorname);
		wallD = AssetsManager.getAnimData(wallname);
		doorD = AssetsManager.getAnimData(doorname);
		floor = AssetsManager.getImage(floorname);
		wall = AssetsManager.getImage(wallname);
		door = AssetsManager.getImage(doorname);
		mapCtx.clearRect(0,0,mapCanvas.width,mapCanvas.height);
		mapCtx.fillStyle = "#CCCCCC";

		for (var row = map.length-1; row >=  0; row --)
		{
			for (var line = map[row].length-1; line >= 0; line --)
			{
				if (map[row][line] == 1)
				{
					mapCtx.drawImage(floor, floorD.spriteX*floorD.spriteWidth, floorD.spriteY*floorD.spriteHeight, floorD.spriteWidth, floorD.spriteHeight, row*100, line*100, 100, 100);
				}
				else if (map[row][line] == 0)
				{
					mapCtx.fillStyle = "#000000";
					mapCtx.fillRect(row*100,line*100,100,100);
				}
				else if (map[row][line] == 2)
				{
					mapCtx.fillStyle = "#f00";
					mapCtx.fillRect(row*100,line*100,100,100);
				}
				else if (map[row][line] === 3)
				{
					mapCtx.drawImage(wall,wallD.spriteX*wallD.spriteWidth, wallD.spriteY*wallD.spriteHeight, wallD.spriteWidth, wallD.spriteHeight, row*100, line*100, 100, 100);
				}
			}
		}

		for (var i = staticObjects.length - 1; i >= 0; i--) {
			mapCtx.drawImage(staticObjects[i].img, staticObjects[i].spriteX*staticObjects[i].width, staticObjects[i].spriteY*staticObjects[i].height, staticObjects[i].width, staticObjects[i].height,staticObjects[i].x*staticObjects[i].width, staticObjects[i].y*staticObjects[i].height, staticObjects[i].width, staticObjects[i].height);
		};
	}

	function render (game)
	{
		var temp;
		cameraCtx.fillStyle = "#000000";
		cameraCtx.fillRect ( 0 , 0 , 1080 , 720 );
		cameraCtx.fillStyle = "#f00";

		//dynamicCtx.drawImage(mapCanvas, 0, 0, dynamicCanvas.width, dynamicCanvas.height);
		dynamicCtx.clearRect(0,0,dynamicCanvas.width,dynamicCanvas.height);
		for(var i = 0; assetsRendered[i]; i++)
		{
			if(assetsRendered[i].spritesheet === undefined)
			{
				//cameraCtx.fillRect (assetsRendered[i].spriteX - cameraX, assetsRendered[i].spriteY - cameraY, assetsRendered[i].width, assetsRendered[i].height);
			}
			else
			{
				dynamicCtx.drawImage(assetsRendered[i].spritesheet, assetsRendered[i].spriteX, assetsRendered[i].spriteY*assetsRendered[i].height , assetsRendered[i].width, assetsRendered[i].height, assetsRendered[i].x, assetsRendered[i].y, assetsRendered[i].width, assetsRendered[i].height);
			}
		}

		for(var i = 0; debug[i]; i++)
		{
			dynamicCtx.fillStyle = debug[i].color;
			dynamicCtx.fillRect(debug[i].x, debug[i].y, debug[i].width, debug[i].height);
		}

		if (drawing)
		{
			drawing = false;
			drawExclamPoint();
		}
		temp = timer.time;
		if(temp !== t)
		{
			textCtx.clearRect(0,0,textCanvas.width,textCanvas.height);
			t = temp;
			textCtx.fillStyle = "#FF0000";
			textCtx.font = "50px Verdana";
			textCtx.fillText(t,200,100);
		}


		cameraCtx.drawImage(mapCanvas, cameraX, cameraY, cameraCanvas.width, cameraCanvas.height, 0, 0, cameraCanvas.width, cameraCanvas.height);
		cameraCtx.drawImage(dynamicCanvas, cameraX, cameraY, cameraCanvas.width, cameraCanvas.height, 0, 0, cameraCanvas.width, cameraCanvas.height);
		cameraCtx.drawImage(textCanvas, 0,0,textCanvas.width,textCanvas.height);
		
		if(timer.state == 3)
		{
			cameraCtx.drawImage(foreground3, 0,0);
		}
		if(timer.state == 2)
		{
			cameraCtx.drawImage(foreground2, 0,0);
		}
		else
		{
			cameraCtx.drawImage(foreground, 0,0);
		}
		cameraCtx.drawImage(textCanvas, 0,0,textCanvas.width,textCanvas.height);
		//cameraCtx.fillRect ( game.perso.x , game.perso.y , game.perso.w , game.perso.h );
	}

	function clearStaticObjects ()
	{
		staticObjects = [];
	}

	function addToStaticObjects (img, x, y, width, height, spriteX, spriteY) 
	{
		var obj = {
			img: img,
			x: x,
			y: y,
			spriteX: spriteX || 0,
			spriteY: spriteY || 0,
			width: width,
			height: height
		}
		staticObjects.push(obj);
	}

	function addToDynamicObjects (assetData) 
	{
		if(assetsRendered.indexOf(assetData) == -1)
		{
			assetsRendered.push(assetData);
		}
	}

	function removeFromDynamicObjects (assetData) 
	{
		var index = assetsRendered.indexOf(assetData);
		assetsRendered.splice(index, 1);
	}

	function addToDebug (debugObject) {
		debug.push(debugObject);
	}

	function removeFromDebug (debugObject) {
		var index = debug.indexOf(debugObject);
		debug.splice(index, 1);
	}

	function follow (character) {
		character.event.subscribe("move",moveCamera);
		// cameraX = character.x + (cameraCanvas.height/2);
		// cameraY = character.y + (cameraCanvas.height/2);
	}

	function moveCamera (x, y) {
		cameraX = x - (cameraCanvas.width/2);
		cameraY = y - (cameraCanvas.height/2);
	}
	function drawExclamPoint() {
		dynamicCtx.drawImage(exclamP, drawX, drawY,100,100);
		// dynamicCtx.fillStyle = "#FFFFFF";
		// dynamicCtx.fillRect(drawX,drawY,100,100);
	}

	return {
		drawMap : drawMap,
		init : init,
		render : render,
		clearStaticObjects: clearStaticObjects,
		addToStaticObjects: addToStaticObjects,
		addToDynamicObjects: addToDynamicObjects,
		addToDebug: addToDebug,
		removeFromDebug: removeFromDebug,
		removeFromDynamicObjects: removeFromDynamicObjects,
		follow: follow,
		drawMenu : drawMenu,
		drawExclamPoint : drawExclamPoint,
		set drawing(x){
			drawing = x;
		},
		set drawX(x){
			drawX = x;
		},
		set drawY(y){
			drawY = y;
		},
		get cameraX(){
			return cameraX;
		},
		set cameraX(x){
			cameraX = x;
		},
		get cameraY(){
			return cameraY;
		},
		set cameraY(y){
			cameraY = y;
		},
		get menuImageStatus()
		{
			return menuImageStatus;
		}
	};
}();