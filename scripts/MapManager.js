var MapManager = function ()
{
	var map = [];
	var mapCollection = {};
	var mapList;
	var obstacles = {};
	var title;

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

		if(!mapCollection.hasOwnProperty(mapData.name))
		{
			mapCollection[title] = {};
			mapCollection[title].map = map;
			mapCollection[title].door = mapData.texture.door;
			mapCollection[title].wall = mapData.texture.wall;
			mapCollection[title].floor = mapData.texture.floor;
		}

		for ( var i in mapData.objects)
		{
			var obstacle = new Obstacle(mapData.objects[i]);
			obstacles[mapName][i] = obstacle;
		}
		console.log(obstacles);
	}

	function switchMap(door)
	{
		nextMap = door.target.name;
		nextPositionX = door.target.x;
		nextPositionY = door.target.y;
		console.log(nextMap);
		loadMap(nextMap,nextPositionX,nextPositionY);

	}

	function loadMap(mapName,x,y)
	{
		if(mapCollection.hasOwnProperty(mapName))
		{
			map = mapCollection[mapName];
		}
		else
		{
			createMap(mapName);
		}
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
					console.log('toto');
					switchMap(mapList[title].doors[i]);
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

		if (map.length-1 < pos.w)
		{
			objet.x -= objet.x - ((pos.w - 1) * 100) - 36 +1;
		}
		if (objet.x < 0)
		{
			objet.x -= objet.x -1;
		}
		if (map[0].length-1 < pos.h)
		{
			objet.y -= objet.y - ((pos.h - 1) * 100) - 36 +1;
		}
		if (objet.y < 0)
		{
			objet.y -= objet.y -1;
		}

		pos.w = ((objet.x + objet.width)/ 100)|0 ;
		pos.h = ((objet.y + objet.height)/ 100)|0 ;

		if (pos.x >= 0 && pos.y >= 0 && pos.w <= map.length && pos.h <= map[0].length)
		{
			if ( map[pos.w][pos.h] == 0)
			{
				if (map[pos.w][pos.y] == 0)
				{
					objet.x -= objet.x - ((pos.x) * 100) - 36 +1;
				}
				if (map[pos.x][pos.h] == 0)
				{
					objet.y -= objet.y - ((pos.y) * 100) - 36 +1;
				}
				if (map[pos.x][pos.h] != 0 && map[pos.w][pos.y] != 0)
				{
					var xy = { x : objet.x - ((pos.x) * 100) - 36 +1, y : objet.y - ((pos.y) * 100) - 36 +1};
					return xy;
				}
			}
			if ( map[pos.x][pos.y] == 0)
			{
				if (map[pos.w][pos.y] == 0)
				{
					objet.y -= objet.y - ((pos.y+1) * 100) - 1;
				}
				if (map[pos.x][pos.h] == 0)
				{
					objet.x -= objet.x - ((pos.x+1) * 100) - 1;
				}
				if (map[pos.x][pos.h] != 0 && map[pos.w][pos.y] != 0)
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
				if(direction.y == 0)
				{
				if(direction.x == -1)
					objet.x = (obstacles[title][i].x*100) +100;
				else if(direction.x == 1)
					objet.x = (obstacles[title][i].x*100) - objet.width;
				}
				else
				{
					if(direction.x == 0)
					{
						if(direction.y == -1)
							objet.y = (obstacles[title][i].y*100) +100;
						else if(direction.y == 1)
							objet.y = (obstacles[title][i].y*100) - objet.height;
					}
					if (direction.x == 1)
					{
						objet.y = (obstacles[title][i].y*100) - objet.height;
						if(direction.x == 1)
							objet.x ++;
						else if(direction.x == -1)
							objet.x --;
					}
					if (direction.x == 1)
					{
						objet.y = (obstacles[title][i].y*100) +100;
						if(direction.x == 1)
							objet.x ++;
						else if(direction.x == -1)
							objet.x --;
					}
				}

				//bugs quand 2 touches appuyées
			}
			// if (objet.x > (obstacles[title][i].x*100) && objet.x < (obstacles[title][i].x*100) + obstacles[title][i].width && objet.y > (obstacles[title][i].y*100) && objet.y < (obstacles[title][i].y*100) + obstacles[i].height)
			// {
			// 	return true;
			// }
		}
	}

	return {
		init: init,
		loadMap : loadMap,
		collision : collision,
		collideDoor : collideDoor,
		collideObstacles : collideObstacles,
		get actualMap() {
			return map;
		}
	}
}();

var mapdata = {
	height : 50,
	width : 50,
	name: "test_map01",
	subs : [
		{
			x : 1,
			y : 1,
			height : 10,
			width : 10
		}
	],
	doors: [{
			x: 5,
			y: 1,
			id: 0
		}]
}