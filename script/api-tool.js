//TODO copy the script block in jqry-app.js file
  $(function(){
    // Tab widget    	
    	$( "#tabs" ).tabs();
    
    
    //Events -> Browser events
    $(window).resize(function() {
      $('div#browser_resize').text($(window).width());
    });
    
    // generate accordian element dynamically
    $.getJSON("/config/k2-modules.json", function(data) {
    	var str="";
    	$.each(data.modules, function(i, item){
    		str += "<h3><a href=\"#\">" + item.module_name + "</a></h3><div><dt>";
    		$.each(item.resources, function(j,resource){
    			str += "<dl><a href=\"" + resource.uri + "\" id=\"resourceuri\">" + resource.label + "</a></dl>";
    		});
    		str+="</dt></div>";
    	});
    	$("div#accordion").html(str);
    	
    	// Accordion widget
	    $("div#accordion").accordion({
  	    autoHeight: false,
    	  navigation: true
    	});
    	
    	// handle resource uri link click event
	    $("a#resourceuri").click(function(){ 
	     $("div#response").empty(); 	  	
  	  	var aurl=get_selected_env_url() + $(this).attr("href");
  	  	$("#iurl").attr("value",aurl);
  	  	
  	  	// generate request form dynamically
    	var ruri=$("#iurl").attr("value");	 
      var tokens=ruri.split("/");	 
      //var iparams=[];
      var str_html="<table id=\"tblrequest\" cellpadding=\"5\" cellspacing=\"5\"><tbody>"; 
      for(i=0;i<tokens.length;i++) {      
        var token=tokens[i];
        if(token.length>1 && token.charAt(0)=='<' && token.charAt((token.length)-1)=='>'){
          token=token.substr(1,token.length-2);
          str_html+="<tr><td>";
          str_html+=token + "</td><td>";  
          str_html+="<input type=\"text\" id=\"" + token + "\"/>"
          //iparams.push(token.substr(1,token.length-2));
          str_html+="</td></tr>";	 
        }	 
      }
      str_html+="</tbody></table>";      
      $("div#request").html(str_html);
    	
    	// view the request tab
    	$("#a-tab-1").trigger('click');    	
  	  	return false;
    	});
    	
    	
    });
    
    // handle onclick event on sbutton
    $("input#sbutton").click(function(){
      $("div#response").empty();
      var uri=$("#iurl").val();
      var tokens=get_ruri_tokens(uri),token="";      
      for(i=0;i<tokens.length;i++){
        token=tokens[i];
        uri=uri.replace(token,$("input#" + token.substr(1,token.length-2)).attr("value"));  
      }
            
      $.getJSON(uri, { 
        "format" : "json",
        "Accept" : "application/vnd.yousee.kasia2.adresse+json;version=1;charset=UTF-8",
			  "Content-Type" : "application/vnd.yousee.kasia2.adresse+json;version=1;charset=UTF-8",
			  "error": function(errorObject){
			     $("div#response").html(prettyPrint(errorObject));
			  }}, function(data){
      	   $("div#response").html(prettyPrint(data));
      });

      // view the       
      $("#a-tab-2").trigger('click');
    });
  });
  
  /**
    *
    */
  function get_selected_env_url(){
  	var url="";
  	$("select#environment option:selected").each(function () {
        url=$(this).val();
    });
    return url;
  }
  
  /**
    *
    */
  function get_ruri_tokens(ruri){
    var tokens=ruri.split("/");	 
    var iparams=[];
    for(i=0;i<tokens.length;i++) {      
      var token=tokens[i];
      if(token.length>1 && token.charAt(0)=='<' && token.charAt((token.length)-1)=='>'){
        iparams.push(token);
      }	 
    }
    return iparams;    
  }