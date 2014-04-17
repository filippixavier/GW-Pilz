var timer = function()
{
	// var 
	var time;
	var state;
	var sec;
	var min;
	var pause = false;
	var timer;
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

	if(time> 1000)
	{
		sec ++;
		time -= 1000;
	}
	if(sec > 60)
	{
		min ++;
		sec -= 60;
	}
	if( time < 1000)
	{
		sec --;
		time += 1000;
	}
	if(sec < 60)
	{
		min --;
		sec += 60;
	}

	timer = min+":"+sec;
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

	return {start : start, update : update, changeTime : changeTime,set pause(x){pause = x;}, get time(){return timer;}};
		
}(); 
		  

