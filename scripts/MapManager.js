var MapManager = function ()
{
	var map = [];
	var mapCollection = {};
	var mapList;

	function init () {
		mapList = maps;
	}

	function createMap(mapName)
	{
		map = [];
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
			mapCollection[mapData.name] = map;
		}
	}

	function loadMap(mapName)
	{
		if(mapCollection.hasOwnProperty(mapName))
		{
			map = mapCollection[mapName];
		}
		else
		{
			createMap(mapName);
		}

		renderingManager.drawMap(map);
	}

	return {
		init: init,
		loadMap : loadMap,
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