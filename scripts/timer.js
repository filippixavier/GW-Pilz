var timer = function()
{
	// var 
	var time=0;
	var state;
	var sec=0;
	var min=0;
	var pause = false;
	var timer;
	//function
	var events = new EventListener;

	events.create('onStateChage');

	function start()
	{
		time = 243000;
	}
	function update (dt) 
	{
		if(pause == false)
		{
			time -= dt;
		}
		stateUpdate();
		
		sec = Math.floor(time/1000)%60;
		min = Math.floor(time/60000)%60;
		if(time <= 0)
		{
			time = 0;
			sec = 0;
			min = 0;
		}

		stateUpdate();
		timer = min+":";
		timer += (sec<10)? "0"+sec :sec;
	}
	
	function stateUpdate()
	{
		var previous = state;
		if(time >= 240000)
		{
			state = 3;
		}
		else if(time >= 120000)
		{
			state = 2;
		}
		else
		{
			state = 1;
		}
		if(state != previous)
		{
			events.emit("onStateChage", state);
		}
	}
	
	function changeTime(x)
	{
		time += x;
	}

	function subscribe(clb)
	{
		events.subscribe('onStateChage', clb);
	}

	function unsubscribe (clb) {
		events.subscribe('onStateChage', clb);
	}

	return {start : start,
		update : update, 
		changeTime : changeTime,
		set pause(x){pause = x;}, 
		get time()
		{
			return timer;
		},
		get state()
		{
			return state;
		},
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
		
}(); 
		  

