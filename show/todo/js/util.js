

function addClass(element, newClassName) {
	if (element.className === '') {
		element.className = newClassName;
	} else {
		var reg = new RegExp("\b" + newClassName +"\b");
		if (!reg.test(element.className)) {
			element.className += " " + newClassName;
		}
		
	}
	return element;
}

function removeClass(element, oldClassName){
	var reg = new RegExp("\s?" + oldClassName, "g");
	element.className = element.className.replace(reg, "");
	return element;
}

function getPositionOnPage(element) {
	var temp = element, 
		left = 0, 
		top = 0;
	if (temp.offsetParent) {
		left += temp.offsetLeft;
		top += temp.offsetTop;
		temp = temp.offsetParent;
	}
	return {
		x: left,
		y: top
	};
}


function showElement(el,boolean){
	if(boolean){
		//el.style.visibility = 'visible';
		el.style.display = 'block';
	} else {
		el.style.display = 'none';
		//el.style.visibility = 'hidden';
	}
}


var addEvent = function (element, event, listener) {
	if (element.addEventListener) {
		element.addEventListener(event, listener, false);
	} else if (element.attachEvent) {
		element.attachEvent("on" + event, listener);
	} else {
		element["on" + event] = listener;
	}
};

var removeEvent = function(element, event, listener) {
	if (element.removeEventListener) {
		element.removeEventListener(event, listener);
	} else if (element.detachEvent) {
		element.detachEvent("on" + event, listener);
	} else {
		element["on" + event] = null;
	}
};

/*
	其他地方要用，拿出来
*/
function getElementsByAttributeName(element, attribute, value) {
		var result = [], 
			root = element.getElementsByTagName("*");

		var process = function(rootSet) {
			if (rootSet.length > 0) {
				for (var i = 0, len = rootSet.length; i < len; i++) {
					var attrValue = rootSet[i].getAttribute(attribute);
					if (attrValue !== '') {
						if (value){
							attrValue === value && result.push(rootSet[i]);
						} else {
							result.push(rootSet[i]);
						}
					}
					arguments.callee(rootSet[i]);
				}

			}
		};

		process(root);
		return result;
	}



function getIndex(e){
	var t = e.target;
	return Array.prototype.indexOf.call(t.parentNode.childNodes, t);
}



