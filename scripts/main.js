(function()
{
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var player, t1, t2, dt;
	function init () {
		//AssetsManager.init()
		player = new Character(1, 100, 100, "player");
		MapManager.init();
		renderingManager.init();
		requestAnimationFrame(loadAssets);
	}

	function loadAssets()
	{
		if(AssetsManager.checkDone())
		{
			MapManager.loadMap("bloc_operatoire");
			console.log("done");
			t1 = Date.now();
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
		player.render();
		renderingManager.render();
		requestAnimationFrame(run);
	}

	addEventListener("load", init);
})();