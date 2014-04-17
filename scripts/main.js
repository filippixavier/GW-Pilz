(function()
{
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var player, t1, t2, dt;
	function init () {
		AssetsManager.init()
		MusiqueManager.musique1.play();
		//MusiqueManager.musique2.play();
		//MusiqueManager.musique3.play();
		MapManager.init();
		renderingManager.init();
		requestAnimationFrame(loadAssets);

	}

	function loadAssets()
	{
		if(AssetsManager.checkDone())
		{
			MapManager.loadMap("bloc_operatoire",2,2);
			console.log("done");
			t1 = Date.now();
			player = new Character(0,0,0.25, 64, 64, "mainchar");
			renderingManager.follow(player);
			console.log(player.anim);
			requestAnimationFrame(run);

		}
		else
		{
			requestAnimationFrame(loadAssets);
		}
	}

	function run () {
		t2 = Date.now();
		dt = t2 - t1;
		t1 = t2;
		player.move(direction, dt);
		player.render(dt);
		renderingManager.render();
		if(timer.state == 2)
		{
			MusiqueManager.musique2.play();	
		}

		if(timer.state == 3)
		{
			MusiqueManager.musique3.play();	
		}

		requestAnimationFrame(run);
	}

	addEventListener("load", init);
})();