var renderingManager = function ()
		{
			var cameraCanvas , cameraCtx, mapCanvas, mapCtx, cameraX = 0 , cameraY = 0;

			var assetsRendered = [];
			
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

	      		assetsRendered = [];
			}

			function drawMap (map)
			{
				mapCtx.clearRect(0,0,mapCanvas.width,mapCanvas.height);
				mapCtx.fillStyle = "#CCCCCC";
				// for (var i in game.rooms)
				// {
				// 	// console.log(game.mapCtx);
				// 	if (game.perso.room == i)
				// 	{

				// 		game.mapCtx.fillRect(0,0,game.rooms[i].width,game.rooms[i].height);
				// 		for (var j in game.rooms[i].doors)
				// 		{
				// 			game.mapCtx.fillStyle = "#f00";
				// 			game.mapCtx.fillRect(game.rooms[i].doors[j].x, game.rooms[i].doors[j].y ,64,64);
				// 		}
				// 	}
				// }

				for (var line = map.length-1; line >=  0; line --)
				{
					for (var row = map[line].length-1; row >= 0; row --)
					{
						if (map[line][row] == 1)
						{
							mapCtx.fillStyle = "#CCCCCC";
							mapCtx.fillRect(line*100,row*100,100,100);
						}
						else if (map[line][row] == 0)
						{
							mapCtx.fillStyle = "#000000";
							mapCtx.fillRect(line*100,row*100,100,100);
						}
						else if (map[line][row] == 2)
						{
							mapCtx.fillStyle = "#f00";
							mapCtx.fillRect(line*100,row*100,100,100);
						}
					}
				}
			}

			function checkIfInsideCamera (renderData) 
			{
				if(renderData.posiX + renderData.width >= cameraX
					&& renderData.posiX <= cameraX + cameraCanvas.width
					&& renderData.posiY <= cameraY + cameraCanvas.height
					&& renderData.posiY + renderData.height >= cameraY)
				{
					if(assetsRendered.indexOf(renderData) === -1)
					{
						assetsRendered.push(renderData);
					}
				}
				else
				{
					var index = assetsRendered.indexOf(renderData);
					assetsRendered.splice(1, index);
				}

			}

			function render (game)
			{
				cameraCtx.fillStyle = "#000000";
				cameraCtx.fillRect ( 0 , 0 , 1080 , 720 );
				cameraCtx.fillStyle = "#f00";
				cameraCtx.drawImage(mapCanvas, cameraX , cameraY , mapCanvas.width, mapCanvas.height);
				
				for(var i = 0; assetsRendered[i]; i++)
				{
					if(assetsRendered[i].img === undefined)
					{
						cameraCtx.fillRect (assetsRendered[i].posiX - cameraX, assetsRendered[i].posiY - cameraY, assetsRendered[i].width, assetsRendered[i].height);
					}
					else
					{
						//cameraCtx.drawImage(assetsRendered.img, cameraX , cameraY , mapCanvas.width, mapCanvas.height);
					}
				}

				//cameraCtx.fillRect ( game.perso.x , game.perso.y , game.perso.w , game.perso.h );
			}
			return {
				drawMap : drawMap,
				init : init,
				render : render,
				checkIfInsideCamera: checkIfInsideCamera,
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