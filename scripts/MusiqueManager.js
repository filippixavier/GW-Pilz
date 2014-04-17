var MusiqueManager = function()
{
	var musique1 = new Howl({
	  	urls: ['son/violon.mp3'],
	  	loop: true,
        volume: 1,
	  });

	var musique2 = new Howl({
		urls: ['son/piano.mp3'],
		loop: true,
		volume: 0.5,
	});

	var musique3 = new Howl({
		urls: ['son/orgue.mp3'],
		loop: true,
		volume: 0.20,
	});
	
	return {
		get musique1() {return musique1;},
		get musique2() {return musique2;},
		get musique3() {return musique3;}
	};  
}();

		
	