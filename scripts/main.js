(function()
{
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var player, t1, t2, dt,playmusique1,playmusique2;

		
	function init () {
		AssetsManager.init()
		timer.start();
		MusiqueManager.musique1.play();
		//MusiqueManager.musique2.play();
		//MusiqueManager.musique3.play();
		MapManager.init();
		renderingManager.init();
		playmusique1 = playmusique2 = false;
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
		timer.update(dt);
		console.log(timer.state);
		if(timer.state == 2 && !playmusique1)
		{
			MusiqueManager.musique2.play();
			MusiqueManager.musique3.stop();	
			playmusique1= true;
			playmusique2 = false;
		}

		if(timer.state == 3 && !playmusique2)
		{
			MusiqueManager.musique3.play();
			MusiqueManager.musique2.stop();
			playmusique1 = false;


			playmusique2= true;	
		}

		requestAnimationFrame(run);
	}

	addEventListener("load", init);
})();