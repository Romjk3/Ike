function sec() //выполняется каждую секунду
	{

	  if(document.webkitVisibilityState == 'visible')//если страница активна
	    {	
	    	if ((url!="undefined") || (url!="")){
            chrome.runtime.sendMessage({site:url});
       		}
		}
	}

var url = location.hostname;

setInterval(sec, 1000);// использовать функцию