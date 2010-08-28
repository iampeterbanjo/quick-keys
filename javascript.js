if(typeof quickKeys === "undefined"){ quickKeys = {}; }

quickKeys.previousElement = null;
quickKeys.currentElement = null; 

//modifier to let us provide alternative to ALT + SHIFT
window.onmousedown = function(){ quickKeys.clickhold = true; };
window.onmouseup = function(){ quickKeys.clickhold = false; };

//trigger access keys using LEFT CLICK + key
//there is a conflict between google chrome access keys 
//and ALT + SHIFT and windows os language bar
quickKeys.triggerAccessKeys = function(){
	//triggers a click event on an element
	function triggerClick(el){
		if(el.dispatchEvent){
			el.style.color = "green";
			
			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent("click", true, true);
			
			el.dispatchEvent(evt);
		} else {
			throw "triggerClick() says: I cannot dispatch an event on this";
		}
	}
	
	//wait for shift modifier or else keyCode is not accurate. why?
	//holding down LEFT CLICK + keyCode will click on access key
	if(quickKeys.clickhold){
		try {		
			var selector = ["[accesskey=",quickKeys.keymap[event.keyCode],"]"].join("");			
			quickKeys.currentElement = document.querySelector(selector);
			
			if(quickKeys.currentElement){				
				triggerClick(quickKeys.currentElement);			
			} else {
				throw "triggerAccessKeys() says: element not found for " + selector;
			}
			
			if(quickKeys.previousElement){ quickKeys.previousElement.style.color = "inherit"; }
			
			quickKeys.previousElement = quickKeys.currentElement;			
		} catch(e){
			//an accesskey with a number value
			//syntax error dom exception 12
			if(e.code === 12){
				//find it the hard way
				var accessKeys = document.querySelectorAll("[accesskey]");
				var limit = accessKeys.length;
				var counter = 0;
				var found = false;
				
				while(counter < limit && !found){ 
					if(accessKeys[counter].getAttribute("accesskey") === quickKeys.keymap[event.keyCode]){
						triggerClick(accessKeys[counter]);
						
						found = true;
					}					
					counter++; 
				}
			} else {
				if(quickKeys._debug){
					console.warn(e.message);
				}			
			}
		}	
	}
}

window.onkeypress = quickKeys.triggerAccessKeys;