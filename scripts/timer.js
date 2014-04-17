var timer = function()
{
	// var 
	var time;
	var state;
	var pause = false;
	//function
	function start()
	{
		time = 60000;
	}
	function update (dt) 
	{
		if(pause == false)
		{
			time -= dt;
		}
		stateUpdate();
	}
	function stateUpdate()
	{
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
	}
	function changeTime(x)
	{
		time += x;
	}

	return {start : start, update : update, changeTime : changeTime,set pause(x){pause = x;}, get time(){return time;}};
		
}(); 
		  

