var AssetsManager = function()
{
	var assets = {};
	var imgNumber = 0, imgCount = 0;

	function init()
	{
		var assetsList = JSON.parse(assets);

		for(imgName in assetsList)
		{
			if(assetsList.hasOwnProperty(imgName))
			{
				imgNumber++;
			}
		}

		for(imgName in assetsList)
		{
			if(assetsList.hasOwnProperty(imgName))
			{
				assets[imgName] = new Image();
				assets[imgName] = assetsList[imgName];
				assets[imgName].onload(function(){
					imgCount++;
				});
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
		return assets[name];
	}

	return {
		init: init,
		checkDone: checkDone,
		getImage: getImage
	}
}();