var id = ''
var change_site = '';
var change_group = '';
var flag = 0;

$(document).ready(function(){
  var port = chrome.runtime.connect({name: "options"});
  port.postMessage({ask: "first"});
  port.onMessage.addListener(function(msg) {
    var sites_string = "";
    var sites_arr = [];
    var html_inner = "";
    var group_name = "";

    for (var i=0; i<4; i++){
      switch(i){
      case 0: group_name = "ui";
              break;
      case 1: group_name = "un";
             break;
      case 2: group_name = "ni";
              break;
     default: group_name = "nn";
     }

      if (msg.question == String("group_"+i)) {
        sites_string = msg.answer;
        sites_arr = sites_string.split(';');
        if ((sites_string!=undefined) && (sites_string!="")){
          for(var j=0; j<sites_arr.length; j++){
            html_inner += '<li class="site" id="site_'+group_name+'_'+j+'">'+sites_arr[j]+'</li>'
          }
        }

        $('#list_'+group_name).append(html_inner);
      }
      sites_arr.length = 0;
      html_inner = "";  
    }

    setInterval(sec, 1000);

    function sec(){
        if (flag == 1){
          flag = 0;
          port.postMessage({ask: "change", change_site: change_site, change_group: change_group});
        }
    }   
  });

  $('ul').on('click', "li", function(){
    var txt = $(this).text(); // вытащим текст из нажатого элемента
    document.getElementById('input1').value = txt;
    id = $(this).attr("id");
  });
  
  $("#but1").click(function(){
    var select = $("select#select").val();
    var input = $("#input1").val();
    var group = "";

    switch(select){
      case '1': 
              group="ui";
              break;
      case '2':   
              group="ni";
              break;
      case '3': 
              group="un";
              break;
      default:
              group="nn";
      }

    if (input != "") {
      $("#"+id).remove();
      $("#list_"+group).prepend('<li class="site" id="'+id+'">'+input+'</li>');
      change_site = input; 
      change_group = group;
      flag = 1;
      }    
  });
});   


