function displayTime(time){
	var str_time = "";
	str_time = Math.floor(time / 3600) + " ч " + (Math.floor(time / 60) - (Math.floor(time / 3600) * 60)) + " м " + time % 60;
	return str_time;
}

$(document).ready(function(){
	var с = ["group_0","group_1","group_2","group_3","result_0","result_1","result_2","result_3"];
	var sum = 0; 
	chrome.storage.local.get(с, function(b) { 
  		var result = [];
  		for (var i=0; i<4; i++){
    		result[i] = b["group_"+String(i)];
    		result[i+4] = b["result_"+String(i)];
    	}

    	for (var i = 4; i<8; i++){
			if (result[i] == undefined){
				result[i] = "0";
			} else
			{sum += result[i];}
		}


		$('#information').append('<class="text">Время проведенно всего: '+displayTime(sum)+' с;');
		$('#information').append('<class="text"><br>Время проведенное на важных и срочных сайтах: '+displayTime(result[4])+' с;');
		$('#information').append('<class="text"><br>Время проведенное на важных, но не срочных сайтах: '+displayTime(result[5])+' с;');
		$('#information').append('<class="text"><br>Время проведенное на не важных, но срочных сайтах: '+displayTime(result[6])+' с;');
		$('#information').append('<class="text"><br>Время проведенное зря: '+displayTime(result[7])+' с;');

		var insert='';

		for (var i=0; i<4; i++){
			var side = Math.floor((result[i+4]/sum)*200);
			insert='<div id="group_'+i+'"></div>';
			$('#diagram').append(insert);
			$('#group_'+i).css("width",side+"px");
			$('#group_'+i).css("height",side+"px");
			switch(i){
      			case 0: 
              		$('#group_'+i).css("top",200-side+"px");
					$('#group_'+i).css("left",200-side+"px");
              		break;
      			case 2:   
              		$('#group_'+i).css("top",200-side+"px");
					$('#group_'+i).css("left","200px");
              		break;
      			case 1: 
              		$('#group_'+i).css("top","200px");
					$('#group_'+i).css("left",200-side+"px");
              		break;
      			default:
              		$('#group_'+i).css("top","200px");
					$('#group_'+i).css("left","200px");
      		}
		}
	});
});       