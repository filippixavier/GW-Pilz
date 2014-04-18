var MapManager = function ()
{
	var map = [];
	var mapCollection = {};
	var mapList;
	var obstacles = {};
	var title;
	var enemies = {n1:[], n2:[], n3:[]};

	var events;

	function init () {
		mapList = maps;
		events = new EventListener();
		events.create('onNewEnemies');
		events.create('onRemoveEnemies');
		events.create('onKillEnemy');
	}

	function createMap(mapName)
	{
		obstacles[mapName] = [];
		map = [];
		title = mapName;
		var mapData = mapList[mapName];

		if(typeof mapData === "undefined")
			throw {type: "Element not found", msg: "Map not found"};

		for (var row = 0; row < mapData.width; row++) {
			map.push([]);
			for (var line = 0; line < mapData.height; line++) {
				map[row][line] = 0;
			};
		};

		for(var i = 0, sub = mapData.subs[0]; mapData.subs[i]; i++, sub = mapData.subs[i])
		{
			for (var x = sub.x; x < sub.x + sub.width; x++) {
				for(var y = sub.y; y < sub.y + sub.height; y++)
				{
					map[x][y] = 1;
				}
			}
		}

		for(i = 0, door = mapData.doors[0]; mapData.doors[i]; i++, door = mapData.doors[i])
		{
			map[mapData.doors[i].x][mapData.doors[i].y] = 2;
		}

		getWallsPosition();

		if(!mapCollection.hasOwnProperty(mapData.name))
		{
			mapCollection[title] = {};
			mapCollection[title].map = map;
			mapCollection[title].door = mapData.texture.door;
			mapCollection[title].wall = mapData.texture.wall;
			mapCollection[title].floor = mapData.texture.floor;
		}
 	}

	function createObjects()
	{
		if(obstacles[title].length === 0)
		{
			for (var i in mapList[title].objects)
			{
				var obstacle = new Obstacle(mapList[title].objects[i]);
				obstacles[title][i] = obstacle;
			}
		}
		for (var i = obstacles[title].length - 1; i >= 0; i--) {
			obstacles[title][i].awake();
		}
	}

	function createEnemiesOnMapChange()
	{
		deleteEnemies("n3");
		deleteEnemies("n2");
		deleteEnemies("n1");
		var enemiesList, width, enemy, state, n;
		state = timer.state;
		while(state > 0)
		{
			n='n'+state;
			createEnemies(n);
			state--;
		}

	}

	function createEnemies(n)
	{
		enemiesList = mapList[title].enemies[n];
		if(enemiesList === undefined)
			return;
		width = (n === "n3")? 128:64;
		for (var i = enemiesList.length - 1; i >= 0; i--) {
			enemy = new Character(enemiesList[i].x*100, enemiesList[i].y*100,0.2,width,width,enemiesList[i].type);
			enemy.setIA();
			enemy.event.subscribe("die", findEnemy)
			enemies[n].push(enemy);
		};

		events.emit("onNewEnemies", enemies[n], n);
		console.log(enemies[n].length);
	}

	function findEnemy(enemy)
	{
		var index;
		for(var i = 1; i < 4; i++)
		{
			index = enemies["n"+i].indexOf(enemy);
			if(index != -1)
			{
				killEnemy("n"+i, enemy);
				break;
			}
		}
	}

	function deleteEnemies (n) 
	{
		for (var i = enemies[n].length - 1; i >= 0; i--) {
			enemies[n][i].delete();
		}
		enemies[n] = [];
		events.emit("onRemoveEnemies", n);
	}

	function switchMap(door,objet)
	{
		nextMap = door.target.name;
		nextPositionX = door.target.x*100;
		nextPositionY = door.target.y*100;
		console.log(nextMap);
		title = nextMap;
		loadMap(nextMap,nextPositionX,nextPositionY);
		objet.teleport(nextPositionX,nextPositionY);
	}


	function loadMap(mapName,x,y)
	{

		renderingManager.clearStaticObjects();
		if(mapCollection.hasOwnProperty(mapName))
		{
			map = mapCollection[mapName].map;
			title = mapName;
		}
		else
		{
			createMap(mapName);
		}
		createObjects();
		createEnemiesOnMapChange();
		renderingManager.drawMap(map, mapCollection[mapName].door, mapCollection[mapName].floor, mapCollection[mapName].wall);
		//player.x = x;
		//player.y = y;
	}
	
	function collideDoor (objet)
	{
		for (var i = 0; i < mapList[title].doors.length; i++)
		{	
			// if (i == title)
			// {
				// console.log(i, title, mapList[title], mapList[title].doors, mapList[title].doors[i]);
				// console.log(objet.x > (mapList[title].doors[i].x*100), objet.x < (mapList[title].doors[i].x*100)+100, objet.y > (mapList[title].doors[i].y*100), objet.y < (mapList[title].doors[i].y*100)+100);
				if (objet.x > (mapList[title].doors[i].x*100) && objet.x < (mapList[title].doors[i].x*100)+50 && objet.y > (mapList[title].doors[i].y*100) && objet.y < (mapList[title].doors[i].y*100)+50)
				{
					// afficher point d'exclamation

					renderingManager.drawing = true;
					renderingManager.drawX = (objet.x-10);
					renderingManager.drawY = (objet.y-70);
					renderingManager.drawExclamPoint();

					if (action == true)
					{
						if (mapList[title].doors[i].lock == null)
						{
							switchMap(mapList[title].doors[i],objet);
						}
						else
						{
							for (var j in objet.keys)
							{
								console.log(mapList[title].doors[i].lock);
								if (mapList[title].doors[i].lock == objet.keys[j].substring(objet.keys[j].length-1,objet.keys[j].length))
								{
									switchMap(mapList[title].doors[i],objet);
								}
							}
						}
					}
				}
			// }
		}
	}
	function collision (objet)
	{
		var pos = {};
		pos.x = (objet.x / 100)|0 ;
		pos.y = (objet.y / 100)|0 ;
		pos.w = ((objet.x + objet.width)/ 100)|0 ;
		pos.h = ((objet.y + objet.height)/ 100)|0 ;
		// console.log(pos);

		pos.w = ((objet.x + objet.width)/ 100)|0 ;
		pos.h = ((objet.y + objet.height)/ 100)|0 ;

		if (pos.x >= 0 && pos.y >= 0 && pos.w <= map.length && pos.h <= map[0].length)
		{
			if ( map[pos.w][pos.h] == 0 || map[pos.w][pos.h] == 3)
			{
				if (map[pos.w][pos.y] == 0 || map[pos.w][pos.y] == 3)
				{
					objet.x -= objet.x - ((pos.x) * 100) - 36 +1;
				}
				if (map[pos.x][pos.h] == 0 || map[pos.x][pos.h] == 3)
				{
					objet.y -= objet.y - ((pos.y) * 100) - 36 +1;
				}
				if (map[pos.x][pos.h] != 0 && map[pos.x][pos.h] != 0)
				{
					var xy = { x : objet.x - ((pos.x) * 100) - 36 +1, y : objet.y - ((pos.y) * 100) - 36 +1};
					return xy;
				}
			}
			if ( map[pos.x][pos.y] == 0 || map[pos.x][pos.y] == 3)
			{
				if (map[pos.w][pos.y] == 0 || map[pos.w][pos.y] == 3)
				{
					objet.y -= objet.y - ((pos.y+1) * 100) - 1;
				}
				if (map[pos.x][pos.h] == 0 || map[pos.x][pos.h] == 3)
				{
					objet.x -= objet.x - ((pos.x+1) * 100) - 1;
				}
				if (map[pos.x][pos.h] != 0 && map[pos.x][pos.h] != 0)
				{
					var xy = { x : objet.x - ((pos.x+1) * 100) - 1, y : objet.y - ((pos.y+1) * 100) - 1};
					return xy;
				}
			}
		}
	}

	function collideObstacles(objet)
	{
		var insideX=0, insideY=0,posiX, posiY, obs = obstacles[title], width, height;
		for ( var i in obs)
		{
			posiX = obs[i].x*100;
			posiY = obs[i].y*100;
			if (objet.x + objet.width > posiX 
				&& objet.x < posiX+100 
				&& objet.y + objet.height > posiY 
				&& objet.y < posiY+100)
			{
				insideX = posiX - objet.x;
				insideY = posiY - objet.y;

				width = objet.width;
				height = objet.height;

				if(posiX < objet.x)
				{
					insideX *= -1;
					width = 100;
				}
				if(posiY < objet.y)
				{
					insideY *= -1;
					height = 100;
				}

				if(insideX > 0)
					insideX = (width - insideX);
				else
					insideX = (100 - insideX);
				if(insideY > 0)
					insideY = (height - insideY);
				else
					insideY = (100 - insideY);

				console.log(insideX, insideY);

				if(insideY <= insideX)
				{
					insideX = 0;
				}
				else
				{
					insideY = 0;
				}

				console.log(insideX, insideY);

			}
		}
		return {x: insideX, y: insideY};
	}
	function checkFacingObstacles (objet)
	{
		var pos = {};
		pos.x = (objet.x / 100)|0 ;
		pos.y = (objet.y / 100)|0 ;
		pos.w = ((objet.x + objet.width)/ 100)|0 ;
		pos.h = ((objet.y + objet.height)/ 100)|0 ;

		for ( var i in obstacles[title])
		{
			if (objet.orientation == 0)
			{
				if (pos.x == obstacles[title][i].x && (pos.y == obstacles[title][i].y || pos.w == obstacles[title][i].y+1))
				{
					if (objet.orientation == (obstacles[title][i].facing+2)%4)
					{
						renderingManager.drawing = true;
						renderingManager.drawX = (objet.x-10);
						renderingManager.drawY = (objet.y-70);
						renderingManager.drawExclamPoint();
						// afficher point d'exclamation
						if (action == true)
						obstacles[title][i].action(objet);
					}
				}
			}
			else if (objet.orientation == 1)
			{
				if (pos.y == obstacles[title][i].y && (pos.w == obstacles[title][i].x || pos.w == obstacles[title][i].x-1))
				{
					if (objet.orientation == (obstacles[title][i].facing+2)%4)
					{
						renderingManager.drawing = true;
						renderingManager.drawX = (objet.x-10);
						renderingManager.drawY = (objet.y-70);
						renderingManager.drawExclamPoint();
						// afficher point d'exclamation
						if (action == true)
						obstacles[title][i].action(objet);
					}
				}
			}
			else if (objet.orientation == 2)
			{
				if (pos.x == obstacles[title][i].x && (pos.h == obstacles[title][i].y || pos.w == obstacles[title][i].y-1))
				{
					if (objet.orientation == (obstacles[title][i].facing+2)%4)
					{
						renderingManager.drawing = true;
						renderingManager.drawX = (objet.x-10);
						renderingManager.drawY = (objet.y-70);
						renderingManager.drawExclamPoint();
						// afficher point d'exclamation
						if (action == true)
						obstacles[title][i].action(objet);
					}
				}
			}
			else if (objet.orientation == 3)
			{
				if (pos.y == obstacles[title][i].y && (pos.x == obstacles[title][i].x || pos.w == obstacles[title][i].x+1))
				{
					if (objet.orientation == (obstacles[title][i].facing+2)%4)
					{
						renderingManager.drawing = true;
						renderingManager.drawX = (objet.x-10);
						renderingManager.drawY = (objet.y-70);
						renderingManager.drawExclamPoint();
						// afficher point d'exclamation
						if (action == true)
						obstacles[title][i].action(objet);
					}
				}
			}
		}
	}

	function getWallsPosition () {
		var previous = false;
		for (var x = map.length - 1; x >= 0; x--) {
			for(var y = 0; y < map[0].length; y++)
			{
				if(map[x][y] === 0)
					previous = true;
				if((map[x][y] === 1 || map[x][y] === 2)&& previous)
				{
					previous = false;
					map[x][y-1] = 3;
				}
			}
		};
	}

	function onStateChange(state)
	{
		var n = "n"+state;
		if(enemies[n] != undefined && enemies[n].length === 0)
		{
			createEnemies(n);
		}
		n = "n"+(state+1);
		if(enemies[n] != undefined)
		{
			deleteEnemies(n);
		}
	}

	function onNewEnemies (clb)
	{
		events.subscribe("onNewEnemies", clb);
	}

	function onRemoveEnemies (clb) {
		events.subscribe("onRemoveEnemies", clb);
	}

	function killEnemy (n, enemy) {
		var index = enemies[n].indexOf(enemy);
		enemies[n][index].delete();
		enemies[n].splice(index, 1);
		events.emit("onKillEnemy", n, enemy);
	}

	function onKill(clb)
	{
		events.subscribe("onKillEnemy", clb);
	}

	return {
		init: init,
		loadMap : loadMap,
		collision : collision,
		collideDoor : collideDoor,
		collideObstacles : collideObstacles,
		checkFacingObstacles : checkFacingObstacles,
		get actualMap() {
			return map;
		},
		onStateChange: onStateChange,
		onRemoveEnemies: onRemoveEnemies,
		onNewEnemies: onNewEnemies,
		onKill: onKill
	}
}();