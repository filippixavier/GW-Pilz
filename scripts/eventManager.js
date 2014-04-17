function EventListener ()
{
	var eventList = {};

	this.create = function (name) {
		if(typeof eventList[name] === "undefined")
		{
			eventList[name] = [];
		}
	};

	this.subscribe = function (name, callback) {
		if(eventList.hasOwnProperty(name))
		{
			eventList[name].push(callback);
		}
		else
		{
			throw "Event doesn't exist";
		}
	};

	this.unsubscribe = function (name, callback)
	{
		var index;
		if(eventList.hasOwnProperty(name))
		{
			index = eventList[name].indexOf(callback);
			if(index !== -1)
			{
				index.splice(index, 1);
			}
		}
		else
		{
			throw "Event doesn't exist";
		}
	}

	this.emit = function () {
		var args = Array.prototype.slice.call(arguments);
        var eventName = args.shift();
        if(!eventList.hasOwnProperty(eventName))
        	return
        var listeners = eventList[eventName];
        for (var i=0; i < listeners.length; i++) {
        	listeners[i].apply(this, args);
        }
	}
}