var AssetsManager = function()
{
	var imageList = {};
	var imgNumber = 0, imgCount = 0;

	function init()
	{
		for(imgName in assets)
		{
			if(assets.hasOwnProperty(imgName))
			{
				imgNumber++;
			}
		}

		for(imgName in assets)
		{
			if(assets.hasOwnProperty(imgName))
			{
				imageList[imgName] = new Image();
				imageList[imgName].src = assets[imgName].source;
				imageList[imgName].onload = function(){
					imgCount++;
				};
			}
		}
	}

	function checkDone ()
	{
		if(imgCount === imgNumber)
		{
			return true;
		}
		return false;
	}

	function getImage(name)
	{
		return imageList[name];
	}

	function getAnimData(name)
	{
		return assets[name].datas;
	}

	return {
		init: init,
		checkDone: checkDone,
		getImage: getImage,
		getAnimData: getAnimData
	}
}();