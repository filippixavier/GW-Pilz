var renderingManager = function ()
{
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                      window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
     
	var cameraCanvas , cameraCtx, mapCanvas, mapCtx,dynamicCanvas, dynamicCtx, cameraX = 0 , cameraY = 0;

	var floor, wall, door;

	var assetsRendered = [], staticObjects = [];
	
	function init ()
	{
		cameraCanvas = document.getElementById("canvas");
		cameraCanvas.height = 720;
		cameraCanvas.width = 1080;
		cameraCtx = document.getElementById("canvas").getContext("2d");

		mapCanvas = document.createElement("canvas");
		mapCanvas.width = 2000;
		mapCanvas.height = 2000;
  		mapCtx = mapCanvas.getContext("2d");

  		dynamicCanvas = document.createElement("canvas");
		dynamicCanvas.width = 2000;
		dynamicCanvas.height = 2000;
  		dynamicCtx = dynamicCanvas.getContext("2d");

  		assetsRendered = [];
  		staticObjects = [];
	}

	function drawMap (map, doorname, floorname, wallname)
	{
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
					mapCtx.drawImage(floor, row*100, line*100, 100, 100);
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
					mapCtx.drawImage(wall, row*100, line*100, 100, 100);
				}
			}
		}
	}

	function render (game)
	{
		cameraCtx.fillStyle = "#000000";
		cameraCtx.fillRect ( 0 , 0 , 1080 , 720 );
		cameraCtx.fillStyle = "#f00";

		dynamicCtx.clearRect(0, 0, dynamicCanvas.width, dynamicCanvas.height);
		for(var i = 0; assetsRendered[i]; i++)
		{
			if(assetsRendered[i].spritesheet === undefined)
			{
				//cameraCtx.fillRect (assetsRendered[i].posiX - cameraX, assetsRendered[i].posiY - cameraY, assetsRendered[i].width, assetsRendered[i].height);
			}
			else
			{
				dynamicCtx.drawImage(assetsRendered[i].spritesheet, assetsRendered[i].spriteX, assetsRendered[i].spriteY , assetsRendered[i].width, assetsRendered[i].height, assetsRendered[i].x, assetsRendered[i].y, assetsRendered[i].width, assetsRendered[i].height);
			}
		}

		cameraCtx.drawImage(mapCanvas, cameraX, cameraY, cameraCanvas.width, cameraCanvas.height, 0, 0, cameraCanvas.width, cameraCanvas.height);
		cameraCtx.drawImage(dynamicCanvas, cameraX, cameraY, cameraCanvas.width, cameraCanvas.height, 0, 0, cameraCanvas.width, cameraCanvas.height);
		//cameraCtx.fillRect ( game.perso.x , game.perso.y , game.perso.w , game.perso.h );
	}

	function clearStaticObjects ()
	{
		staticObjects = [];
	}

	function addToStaticObjects (assetData) 
	{
		staticObjects.push(assetData);
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
		var index = assetData.indexOf(assetData);
		assetData.splice(index, 1);
	}

	function follow (character) {
		character.event.subscribe("move",moveCamera);
		// cameraX = character.x + (cameraCanvas.height/2);
		// cameraY = character.y + (cameraCanvas.height/2);
	}

	function moveCamera (x, y) {
		cameraX = x - (cameraCanvas.width/2);
		cameraY = y - (cameraCanvas.height/2);;
	}

	return {
		drawMap : drawMap,
		init : init,
		render : render,
		clearStaticObjects: clearStaticObjects,
		addToStaticObjects: addToStaticObjects,
		addToDynamicObjects: addToDynamicObjects,
		removeFromDynamicObjects: removeFromDynamicObjects,
		follow: follow,
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
		}
	};
}();