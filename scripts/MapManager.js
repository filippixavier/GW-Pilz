﻿var MapManager = function ()
{
	var map = [];
	var mapCollection = {};
	var mapList;
	var obstacles = {};
	var title;
	var enemies = {n1:[], n2:[], n3:[]};

	function init () {
		mapList = maps;
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
		enemies.n1 = [];
		enemies.n2 = [];
		enemies.n3 = [];
		var enemiesList, width, enemy, state, n;
		console.log(timer.state);
		state = timer.state;
		while(state > 0)
		{
			n='n'+state;
			//createEnemies(n);
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
			enemy = new Character(enemiesList[i].x*width, enemiesList[i].y*width,0.2,width,64,enemiesList[i].type);
			enemies[n].push(enemy);
		};
	}

	function deleteEnemies (n) 
	{
		for (var i = enemies[n].length - 1; i >= 0; i--) {
			enemies[n][i].delete();
		}
		enemies[n] = [];
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
					if (action == true)
					{
						switchMap(mapList[title].doors[i],objet);
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
		for ( var i in obstacles[title])
		{
			if (objet.x + objet.width > (obstacles[title][i].x*100) && objet.x < (obstacles[title][i].x*100)+100 && objet.y + objet.height > (obstacles[title][i].y*100) && objet.y < (obstacles[title][i].y*100)+100)
			{
				if (objet.orientation == 2 )
				{
					objet.y = (obstacles[title][i].y*100) - objet.height;
					if(direction.x == 1)
						objet.x ++;
					else if(direction.x == -1)
						objet.x --;
				}
				else if (objet.orientation == 1 )
				{
					objet.x = (obstacles[title][i].x*100) - objet.width;
					if(direction.y == 1)
						objet.y ++;
					else if(direction.y == -1)
						objet.y --;
				}
				else if (objet.orientation == 0 )
				{
					objet.y = (obstacles[title][i].y*100) +100;
					if(direction.x == 1)
						objet.x ++;
					else if(direction.x == -1)
						objet.x --;
				}
				else if (objet.orientation ==  3)
				{
					objet.x = (obstacles[title][i].x*100) +100;
					if(direction.y == 1)
						objet.y ++;
					else if(direction.y == -1)
						objet.y --;
				}
			}
		}
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
			//createEnemies(n);
		}
		n = "n"+(state+1);
		if(enemies[n] != undefined)
		{
			deleteEnemies(n);
		}
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
		onStateChange: onStateChange
	}
}();