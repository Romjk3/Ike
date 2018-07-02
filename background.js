function Site(url){
	var name = url;
	var time = 0;
	var group = 'nn';

	this.sec = function(){
	  time = time + 1;
	}

  this.setTime = function(time_set){
    time = time_set;
  }

  this.getTime = function(){
    return time;
  };

	this.getName = function() {
	  return name;
	}

  this.setGroup = function(group_set){
    group = group_set;
  }
    
  this.getGroup = function(){
    return group;
  }
}

function Group(group){
	var name = group;
	var group_time = 0;
  var groups_sites = [];

  this.setSites = function(str_sites){
    if ((str_sites!="") && (str_sites!="undefined") && (str_sites!=undefined)){
      var sites_arr = str_sites.split(";");

      for(var i=0; i<sites_arr.length; i++){
        for(var j=0; j<localStorage.length; j++){
          var str = String(window.eval('site_'+j+'.getName();'));
          if (str.localeCompare(String(sites_arr[i])) == 0){
            window.eval('site_'+j+'.setGroup("'+name+'");');
          }
        }
      }
    }
  }

	this.getSites = function(){
		for (var i=0,j=0; i<localStorage.length; i++){
  			var sites_group = String(window.eval('site_'+i+'.getGroup();'));
    		if (sites_group.localeCompare(String(name)) == 0) {
    			groups_sites[j] = String(window.eval('site_'+i+'.getName();'))
          j++;
        	}
        }

    groups_sites.length = j;

    var sites_str = groups_sites.join(';');
    return sites_str;
	}

	this.getGroupTime = function(){
    var time = 0;
    for (var i=0; i<localStorage.length; i++){
        var sites_group = String(window.eval('site_'+i+'.getGroup();'));
        if (sites_group.localeCompare(String(name)) == 0) {
          time += window.eval('site_'+i+'.getTime();');
        }
    }
    group_time = time;
		return group_time;
	}
}

//localStorage.clear();
//chrome.storage.local.clear();

for (var i=0; i<4; i++){
  var group_name = "";
  switch(i){
    case 0: group_name = "ui";
            break;
    case 1: group_name = "un";
            break;
    case 2: group_name = "ni";
            break;
    default: group_name = "nn";
  }

  window.eval('var group_'+i+' = new Group("'+group_name+'");');
}

for (var i=0,key,value; i < localStorage.length; i++) {
    // получаем имя ключа
    key = localStorage.key(i);
    
    // получаем значение по имени ключа
    value = localStorage.getItem(key);

    window.eval('var site_'+i+' = new Site("'+key+'");');
    window.eval('site_'+i+'.setTime('+value+');');
  }

var с = ["group_0","group_1","group_2","group_3"]; 
chrome.storage.local.get(с, function(b) { 
  var result = [];
  for (var i=0; i<4; i++){
    result[i] = b["group_"+String(i)];
    window.eval('group_'+i+'.setSites("'+result[i]+'")');
    }
});

for (var i=0; i<8; i++){
        var a = {};
        if (i<4){
          a["group_"+String(i)] = window.eval('group_'+i+'.getSites();');
        } 
        else {
          a["result_"+String(i-4)] = window.eval('group_'+(i-4)+'.getGroupTime();');
        }
        chrome.storage.local.set(a);
      }

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  var site_name = request.site;
  var site_id = localStorage.length;

  if (localStorage[site_name] == undefined){
  	localStorage[site_name] = '0';
    window.eval('var site_'+site_id+' = new Site("'+site_name+'");');
  }

  localStorage[site_name] =  parseInt(localStorage[site_name],10) +1;

  for (var i=0; i<localStorage.length; i++){
  	var resite = String(window.eval('site_'+i+'.getName();'));
    if (resite.localeCompare(String(site_name)) == 0) {
    	window.eval('site_'+i+'.sec();');
    	break;
    }
  }

  for (var i=0; i<8; i++){
        var a = {};
        if (i<4){
          a["group_"+String(i)] = window.eval('group_'+i+'.getSites();');
        } 
        else {
          a["result_"+String(i-4)] = window.eval('group_'+(i-4)+'.getGroupTime();');
        }
        chrome.storage.local.set(a);
      }
});

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "options");
  port.onMessage.addListener(function(msg) {
    if (msg.ask == "first") {
      var sites_message_option = [];
      var group_message_option = '';
      var question_message = '';

      for (var i=0; i<4; i++){
        sites_message_option[i] = window.eval('group_'+i+'.getSites();');
        question_message = "group_"+i;
        port.postMessage({question: question_message, answer: sites_message_option[i]});
      } 
    }
    else if (msg.ask == "change") {
      var change_site = msg.change_site;
      var change_group = msg.change_group;

      for (var i=0; i<=localStorage.length; i++){
        var change_url = String(window.eval('site_'+i+'.getName();'));
          if (change_url.localeCompare(String(change_site)) == 0) {
            window.eval('site_'+i+'.setGroup("'+change_group+'");');
            break;
          }
      }

      for (var i=0; i<8; i++){
        var a = {};
        if (i<4){
          a["group_"+String(i)] = window.eval('group_'+i+'.getSites();');
        } 
        else {
          a["result_"+String(i-4)] = window.eval('group_'+(i-4)+'.getGroupTime();');
        }
        chrome.storage.local.set(a);
      }
    }
  });
});
