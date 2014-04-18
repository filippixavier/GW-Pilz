(function()
{
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var player, t1, t2, dt,playmusique1,playmusique2, enemies = {n1:[], n2:[], n3:[]}, state = "menu";

	function initMenu () {
		AssetsManager.init()
		// timer.start();
		// MusiqueManager.musique1.play();
		//MusiqueManager.musique2.play();
		//MusiqueManager.musique3.play();
		// MapManager.init();
		renderingManager.init();
		renderingManager.drawMenu();
		// playmusique1 = playmusique2 = false;
		// requestAnimationFrame(loadAssets);
		if (state == "play")
		{
			init();
		}
		else
		{
			requestAnimationFrame(initMenu);
		}
		// init();
	}
	function init () {
		// AssetsManager.init()
		timer.start();
		MusiqueManager.musique1.play();
		//MusiqueManager.musique2.play();
		//MusiqueManager.musique3.play();
		MapManager.init();
		// renderingManager.init();
		playmusique1 = playmusique2 = false;
		requestAnimationFrame(loadAssets);
		game_State = "menu";
	}

	function loadAssets()
	{
		if(AssetsManager.checkDone())
		{
			MapManager.onNewEnemies(addEnemies);
			MapManager.onRemoveEnemies(clearEnemies);
			MapManager.loadMap("bloc_operatoire",2,2);
			MapManager.onKill(killEnemy);
			timer.subscribe(MapManager.onStateChange);

			t1 = Date.now();
			player = new Character(0,0,0.25, 64, 64, "mainchar");
			renderingManager.follow(player);
			requestAnimationFrame(run);

		}
		else
		{
			requestAnimationFrame(loadAssets);
		}
	}

	function run () {
		//if(game_State == "play")
		//{

		t2 = Date.now();
		dt = t2 - t1;
		t1 = t2;

		player.move(direction, dt);
		player.render(dt);
		updateEnemies();
		
		timer.update(dt);
		//}
		renderingManager.render(game_State);


		if(timer.state == 2 && !playmusique1)
		{
			MusiqueManager.musique3.stop();
			MusiqueManager.musique2.play();


				
			playmusique1= true;
			playmusique2 = false;
		}

		if(timer.state == 3 && !playmusique2)
		{
			MusiqueManager.musique2.stop();
			MusiqueManager.musique3.play();
			playmusique1 = false;
			playmusique2= true;	
		}
		if(timer.state == 1)
		{
		MusiqueManager.musique2.stop();
		}

		requestAnimationFrame(run);
	}

	function addEnemies (enemy,n) {
		enemies[n] = enemy;
	}

	function clearEnemies (n) {
		enemies[n] = [];
	}

	function updateEnemies () {
		for(var n = 1; n < 4; n++)
		{
			for (var i = enemies["n"+n].length - 1; i >= 0; i--) {
				enemies["n"+n][i].protectTerritory(player, dt);
				if(enemies["n"+n][i] !== undefined)
					enemies["n"+n][i].render(dt);
			};
		}
	}

	function killEnemy (n, enemy)
	{
		var index = enemies[n].indexOf(enemy);
		enemies[n].splice(index, 1);
		console.log("hello");
		timer.changeTime(-10000); 
	}


	addEventListener("load", initMenu);
})();