$(function() {
	// Tab widget
	$("#tabs").tabs();

	// Events -> Browser events
	$(window).resize(function() {
		$('div#browser_resize').text($(window).width());
	});

	//Both buttons are disable at the of loading the page
	$("#sbutton").button();	
	$("#nbutton").button({ disabled: true });
	$("#pbutton").button({ disabled: true });

	// generate accordian element dynamically
	$
			.getJSON(
					"config/kasia2.js",
					function(data) {
						var str = "";
						var preandpost = data.preandprod;

						// Load the relational configuration map.
						rel = data.rel;
						accept_header = data.accept;

						$.each(data.modules, function(i, item) {
							str += "<h3><a href=\"#\">" + item.name
									+ "</a></h3><div><dt>";
									
							if(item.docs){							
							$.each(item.docs, function(k, doc){
								str += "<dl><a href=\""
										+ generate_doc_uri(preandpost,item,doc)
										+ "\" id=\"docuri\">"
										+ doc.label + "</a></dl>";
							});
						 }
									
							$.each(item.resources, function(j, resource) {
								str += "<dl><a href=\""
										+ generate_uri(preandpost, item,
												resource)
										+ "\" id=\"resourceuri\">"
										+ resource.label + "</a></dl>";
							});
							
							str += "</dt></div>";
						});
						$("div#accordion").html(str);

						// Accordion widget
						$("div#accordion").accordion({
							autoHeight : false,
							navigation : true
						});
						
						// handle doc uri link click event
						$("a#docuri").click(function(){
							$("div#bcontent").hide();							
							$("div#bodyContent").show();	
							$("iframe#ibodyContent").attr("src",$(this).attr("href"));						
							return false;
						});

						// handle resource uri link click event
						$("a#resourceuri")
								.click(
										function() {
											$("div#bodyContent").hide();
											$("div#bcontent").show();
											clear_div_content();
											var aurl = $(this).attr("href");
											$("#iurl").attr("value", aurl);

											// generate request form dynamically
											var ruri = $("#iurl").attr("value");
											var tokens = ruri.split("/");
											if(tokens.length>0){
											var str_html = "<table id=\"tblrequest\" cellpadding=\"3\" cellspacing=\"3\"><tbody>";
														//+ "<tr><td colspan=\"3\"><span style=\"color:red\">* indicates mandatory</span></td></tr>";
											for (i = 0; i < tokens.length; i++) {
												var token = tokens[i];
												if (token.length > 1 && 
														(token.charAt(0) == '<' && 
															token.charAt((token.length) - 1) == '>')) {
													token = token.substr(1,
															token.length - 2);
													str_html += "<tr><td width=\"100px\">";
													str_html += token
															+ "</td><td width=\"2px\"><span style=\"color: red\">*</span></td><td>";
													str_html += "<input type=\"text\" class=\"rdatatext\" id=\""
															+ token + "\"/>"
													str_html += "</td></tr>";
												} 
												else if (token.length > 1 && 
														(token.charAt(0) == '['
															&& token.charAt((token.length) - 1) == ']')) {
													token = token.substr(1,token.length - 2);
													str_html += "<tr><td width=\"100px\">";
													str_html += token
															+ "</td><td width=\"6px\"><span>&nbsp;</span></td><td>";
													str_html += "<input type=\"text\" class=\"rdatatext\" id=\""
															+ token + "\"/>"
													str_html += "</td></tr>";
												}
											}
											str_html += "</tbody></table>";																						
											}
															
											str_html += "<table id=\"tblrequestd\" cellpadding=\"3\" cellspacing=\"3\"><tbody><tr><td width=\"100px\"> headers </td><td width=\"6px\"><span>&nbsp;</span></td><td>";
											str_html += "<textarea col=\"80\" rows=\"2\" id=\"rheaders\">";
											str_html += "</textarea></td></tr>";
											var rmethod=get_method(ruri);
											if(rmethod!=null && (rmethod=="PUT" || rmethod=="POST")){												
												str_html += "<tr><td width=\"100px\"> data </td><td width=\"6px\"><span>&nbsp;</span></td><td>";
												str_html += "<textarea col=\"80\" rows=\"25\" id=\"rbody\">";
												str_html += "</textarea></td></tr>";
											}
											str_html += "</tbody></table>";
											
											$("div#request").html(str_html);
											
											if(tokens.length>0){
												// handle enter key for request
												$("#tblrequest").keypress(function(e) {
													if(e.which == 13) {
    													jQuery(this).blur();
      											jQuery('#sbutton').focus().click();
    											}
												$("#pbutton").button({ disabled: true });													
												});
											}

											if(rmethod!=null && (rmethod=="PUT" || rmethod=="POST")){
												set_schema(ruri);
											}

											populate_header_and_data();
											
											// view the request tab
											$("#a-tab-1").trigger('click');
											return false;
										});
					});
					
	// handle onclick event on sbutton
	$("#sbutton").click(
			function() {
				clear_div_content();
				var uri = $("#iurl").val();
				var tokens = get_ruri_tokens(uri), token = "";
				for (i = 0; i < tokens.length; i++) {
					token = tokens[i];
					uri = uri.replace(token, $(
							"input#" + token.substr(1, token.length - 2)).attr(
							"value"));
				}
				uri=replace_last_slash(uri);

				//using $.ajax();
				var turi = uri.substring((uri.indexOf("}")) + 1),
						rmethod=get_method(uri),
						rdata=$.parseJSON(get_request_data());

				if((rdata!=null && rdata!="") && (rmethod=='PUT' || rmethod=='POST')){
					try{
						rdata = $.parseJSON(rdata);
						if(rdata!=null && rdata['stempel']){
							if(rdata.stempel.sys){
								rdata.stempel.sys='apitool';							
							}
						}

						if(rdata!=null && rdata['klient-system']){
							rdata['klient-system']='apitool';							
						}

						rdata = JSON.stringify(rdata);
						console.log(rdata);
					}catch(err){
						$('#derror').empty().html('<div id="dialog-modal" title="Error"><p>' + err +'</p></div>');	
						$( "#dialog-modal" ).dialog({
							height: 140,
							modal: true});
						return;
					}
				}

				$.ajax({
					url: turi,
					processData:false,
					type: rmethod,
					data: rdata,
					beforeSend:function(jqXHR, settings){
						$('body').css('cursor','wait');
						jqXHR.setRequestHeader("Accept", accept_header);
    					jqXHR.setRequestHeader("Content-Type", accept_header);
    					set_additional_headers(jqXHR);
					},
					success: function(data, textStatus, jqXHR){
						latest_json={};
						if(rmethod=="GET"){
							lhistory.push(uri);
							cur = (lhistory.length) - 1;
						}						

						if($.isXMLDoc(data)){
							$("div#response").empty().html("<pre id=\"rspre\"></pre>");
							$("pre#rspre").text($(data).xml());
						}else{						
							latest_json=data;
							$("div#response").empty().html('<img id="popup" src="images/icon.jpg"/><pre id="rspre">' + JSON.stringify(data, replacer, 4)
									+ '</pre>');

							popup_image_click();
							render_json_as_tree(data);						
						}

						render_response_header(jqXHR,false);
						// view the
						if(data==undefined || data==null || data == ""){
							$("#a-tab-3").trigger('click');
						}else{
							$("#a-tab-2").trigger('click');
						}	
						if(($("pre#rspre").height())>650){
							$("pre#rspre").height(650);
						}
						$("#nbutton").button({ disabled: true });

						if(lhistory.length>1){
							$("#pbutton").button({ disabled: false });
						}						
					},
					error: function(jqXHR, textStatus, errorThrown){
						render_response_header(jqXHR,true);
						$("#a-tab-3").trigger('click');
					},
					complete: function(jqXHR,textStatus){
						$('body').css('cursor','auto');
					}						
				});
				
			});

	// handle dummy button event
	$("#dbutton").click(
			function() {				
				clear_div_content();
				var uri = $("#iurl").val();
				var tokens = get_ruri_tokens(uri), token = "";
				for (i = 0; i < tokens.length; i++) {
					token = tokens[i];
					uri = uri.replace(token, $(
							"input#" + token.substr(1, token.length - 2)).attr(
							"value"));
				}

				uri = uri.substring((uri.indexOf("}")) + 1);

				$.ajax({
					url: uri,
					processData:false,
					type: "GET",					
					beforeSend:function(jqXHR, settings){
						$('body').css('cursor','wait');
						jqXHR.setRequestHeader("Accept", accept_header);
    					jqXHR.setRequestHeader("Content-Type", accept_header);
    					//set_additional_headers(jqXHR);
					},
					success: function(data, textStatus, jqXHR){
						if($.isXMLDoc(data)){
							$("div#response").empty().html("<pre id=\"rspre\"></pre>");
							$("pre#rspre").text($(data).xml());
						}else{		
							latest_json=data;
							$("div#response").html(
								'<img id="popup" src="images/icon.jpg"/><pre id="rspre">' + JSON.stringify(data, replacer, 4)
										+ '</pre>');
							popup_image_click();			  		
							render_json_as_tree(data);
				  		}
										  
				  		render_response_header(jqXHR,false);			 			
								  
				  		// view the
						if(data==undefined || data==null || data == ""){
							$("#a-tab-3").trigger('click');
						}else{
							$("#a-tab-2").trigger('click');
						}	
						if(($("pre#rspre").height())>650){
					  		$("pre#rspre").height(650);
				  		}	
					},
					error: function(jqXHR, textStatus, errorThrown){
						render_response_header(jqXHR,true);
						$("#a-tab-3").trigger('click');
					},
					complete: function(jqXHR,textStatus){
						$('body').css('cursor','auto');
					}						
				});
			});

	

	// handle onclick event for prev button
	$("#nbutton").click(function() {
		$("div#request").empty();
		if (lhistory.length > 0 && cur < (lhistory.length) - 1) {
			cur += 1;
			$("#iurl").attr("value", lhistory[cur]);
			$("#dbutton").trigger('click');
			$("#pbutton").button({ disabled: false });			
			if(cur == (lhistory.length) - 1) {
				$("#nbutton").button({ disabled: true });				
			}
		} else {
			$("#nbutton").button({ disabled: true });
		}
	});

	// handle onclick event for next button
	$("#pbutton").click(function() {
		$("div#request").empty();
		if (cur > 0) {
			cur -= 1;
			$("#iurl").attr("value", lhistory[cur]);
			$("#dbutton").trigger('click');			
			$("#nbutton").button({ disabled: false });
			if(cur == 0) {
				$("#pbutton").button({ disabled: true });				
			}
		} else {
			$("#pbutton").button({ disabled: true });
		}
	});

});

/**
 *
 **/
var popup_image_click=function(){
	$("img#popup").click(function(){
		var wid = $(window).width();
		var hei = $(window).height();
		var popwid = 800;
		var pophei = 600;
		var left_pos = (wid-popwid)/2;
		var top_pos = (hei-pophei)/2;
		var popup_window=window.open('','API Tool Popup','width='+popwid+',height='+pophei+',top='+top_pos+',left='+left_pos+',location=0,scrollbars=yes');
		popup_window.document.write('<pre>' + JSON.stringify(latest_json, simple_replacer, 2) + '</pre>');
	});
};
/**
 * This function set the additional headers
 * expected header is key:value.
 */
var set_additional_headers=function(jqXHR){
	var rheaders=$("textarea#rheaders").val();
	if(rheaders){
		var headers=rheaders.split('\n');
		$.each(headers,function(i,header){		
			if(header.indexOf(":")!=-1){
				var key=header.substring(0,header.indexOf(":")),
						value=header.substring(header.indexOf(":")+1);
				jqXHR.setRequestHeader(key,value);
			}
		});	
	}
}

/**
 * recursive function to replace the last slashes.
 */
var replace_last_slash=function(ruri){
	if(ruri.charAt(ruri.length-1)=='/'){
		return replace_last_slash(ruri.substring(0,ruri.length-1));
	}
	return ruri;
};
/**
 * clear request header,response header and response.
 */
var clear_div_content=function(){
	$("div#response").empty();
	$("div#resheader").empty();
	$('div#jstreeview').empty();
};
/**
 * render response header.
 */
var render_response_header=function(jqXHR,error){
	var str = "<table style=\"width:100%\" cellpadding=\"3\" cellspacing=\"3\"><tbody>";
	$.each(jqXHR.getAllResponseHeaders().split('\n'),function(i,header){		
		if(header.indexOf(":")!=-1){
			var key=header.substring(0,header.indexOf(":")),
					value=header.substring(header.indexOf(":")+1);
			str += "<tr><td>" + key + "</td><td>" + value + "</td></tr>";

			if(key=='ETag' || key=='etag'){
				etag_value = value;
			}
		}
	});
	
	str += "<tr><td width=\"120px\">Ready State</td><td>" + jqXHR.readyState + "</td></tr>";
	str += "<tr><td>Status</td><td>" + jqXHR.status + "</td></tr>";
	str += "<tr><td>Status Text</td><td>" + jqXHR.statusText + "</td></tr>";
	
	if(error){
		str += "<tr><td>Response Text</td><td>" + jqXHR.responseText + "</td></tr>";
	}
	str += "</tbody></table>";
	$("div#resheader").empty().html(str);
};
/**
 * return request data.
 */
var get_request_data=function(){
	var rdata=$("textarea#rbody").attr("value");
	if(rdata==null){
		rdata="";
	} else {
		rdata=rdata.replace(new RegExp("\\n", "g" ),"");
		rdata=rdata.replace(new RegExp("\\r", "g" ),"");
	}
	return JSON.stringify(rdata);
};
/**
 * based on the environment build the context of uri dynamically.
 */
var generate_uri=function(preandprod, module, resource) {
	var hosts = preandprod.toString();
	var ruri = "{" + resource.method + "}" + module.context;
	if (hosts.match(location.hostname) != null) { // preprod and production
		ruri += resource.uri;
	} else { // other than preprod and production environment
		ruri += "-v" + resource.version + resource.uri;
	}
	return ruri;
};
/**
 *
 */ 
var generate_doc_uri=function(preandprod, module, doc) {
	var hosts = preandprod.toString();
	var duri = module.context;
	//if (hosts.match(location.hostname) != null) { // preprod and production
	//	duri += doc.uri;
	//} else { // other than preprod and production environment
	duri += "-v" + doc.version + doc.uri;
	//}
	return duri;
};
/**
 *
 */
var set_schema=function(ruri){
	$.getJSON("config/kasia2.js",function(data) {
		var str = "";	
		var preandpost = data.preandprod;
		$.each(data.modules, function(i, item) {
			$.each(item.resources, function(j, resource) {
				if(ruri == generate_uri(preandpost, item,resource)){
					if(resource.method == "PUT" || resource.method == "POST"){
						$.getJSON("config/" + resource.schema + ".js",function(data) {
							$("textarea#rbody").attr("value",JSON.stringify(data,simple_replacer,2));							
						})
					} 
				}
			});
		});		
	});	
};
/**
 * Replacer callback function for JSON.stringnify.
 */
var replacer=function(key, value) {
	if (key != null && key == "href") {
		var urlStart = location.protocol + "//" + location.host;
		var avalue = value.replace(urlStart, "");
		avalue = get_method_name_by_rel() + avalue;
		return "<span class='nesturi' onclick='nested_call(this)'>" + avalue
				+ "</span>";
	}

	if(key == 'rel'){
		latest_rel = value;
	}
	return value;
};
/**
 * This returns the method name based on the relation object default returns GET.
 **/
var get_method_name_by_rel=function(){
	try{
		var method_name = rel[latest_rel];
		if(method_name == 'PUT' ||
		 method_name == 'POST' || 
		 method_name == 'DELETE'){
			return '${' + latest_rel + '}{' + method_name + '}';
		}
		return "{GET}";		
	}catch(err){
		return "{GET}";
	}
};
/**
 * 
 */
var simple_replacer=function(key, value) {
	return value;
};
/**
 * 
 */
var nested_call=function(rspan) {
	$("div#request").empty();
	s_header=[];
	s_data=[];
	var ruri=$(rspan).text();
	/* if relation found then handle it specialy */
	if(ruri.search(/[$][{][a-z]*[}]/i)!=-1){
		var matchStr = ruri.match(/[$][{][a-z]*[}]/i);		
		var rel = matchStr[0].replace('${','').replace('}','');		
		ruri = ruri.replace(matchStr[0],'');
		prepare_header_and_data(rel);
		$("#dresourceuri > #resourceuri").attr("href",ruri);		
		$('#dresourceuri > #resourceuri').trigger('click');
	}else{
		/* Default execution */
		$("#iurl").attr("value", ruri);
		$("#sbutton").trigger('click');
	}
};
/**
 *
 **/
var prepare_header_and_data=function(rel){
	if(etag_value!=''){
		s_header.push('If-Match:' + etag_value);
	}

	if(rel=='opret' ||
        rel=='opdater' ||
        rel=='slet' ||
        rel=='opsig' ||
        rel=='vaelg-aftale' ||
        rel=='fjern-advarsler'){
        try{
	       	var kunde_data='';
	       	var array_init='';
	       	if(latest_json['kunde-data']){
	       		kunde_data=latest_json['kunde-data'];
	       	}
	       	if(latest_json['array-init']){
	       		array_init=latest_json['array-init'];
	       	}
	       	s_data.push({'kunde-data':kunde_data,'array-init':array_init});
        }catch(err){
        	s_data.push({});
        }
	} else if(rel=='bestil'){
		try{
	       	var kunde_data='';
	       	var bestil_info='';
	       	if(latest_json['kunde-data']){
	       		kunde_data=latest_json['kunde-data'];
	       	}
	       	if(latest_json['bestil-info']){
	       		bestil_info=latest_json['bestil-info'];
	       	}
	       	s_data.push({'kunde-data':kunde_data,'bestil-info':bestil_info});
        }catch(err){
        	s_data.push({});
        }
	}
};  
/**
 *
 **/
var populate_header_and_data=function(){
	if(s_header.length!=0){
		$.each(s_header, function(k,v){
			$("textarea#rheaders").attr('value',v);
		});		
	}

	if(s_data.length!=0){
		$.each(s_data, function(k,v){
			$("textarea#rbody").attr("value",JSON.stringify(v,simple_replacer,2));
		});	
	}
	s_header=[];
	s_data=[];
} 
/**
 * This function returns token by parsing the uri based on <token> pattern.
 */
var get_ruri_tokens=function(ruri) {
	var tokens = ruri.split("/");
	var iparams = [];
	for (i = 0; i < tokens.length; i++) {
		var token = tokens[i];
		if (token.length > 1 && ((token.charAt(0) == '<'
				&& token.charAt((token.length) - 1) == '>') ||(token.charAt(0) == '['
				&& token.charAt((token.length) - 1) == ']'))) {
			iparams.push(token);
		}
	}
	return iparams;
};
/**
 * Default method return 'GET'
 */
var get_method=function(ruri){
	var rmethod=ruri.substring(ruri.indexOf("{")+1,ruri.indexOf("}"));
	rmethod=rmethod.toUpperCase();
	if((rmethod == "POST") || (rmethod == "PUT") || (rmethod == "DELETE")){
		return rmethod;
	}	
	return "GET";  
};
/**
 * Recursive function to traverse the json object and convert into ul li format.
 */
var traverse = function(key, jsonObj) {
    if( jsonObj!= null && typeof jsonObj == "object") {    	
        $.each(jsonObj, function(k,v) {             
            if( v != null && typeof v == "object" ){
            	gstr += '<li class="closed"><span class="folder">' + k + '</span><ul>'	
            	traverse(k, v); 
            	gstr += '</ul></li>';
            } else{
            	gstr += '<li><span class="file">' + k + ' :=> ' + v + '</span>'	
            }             
        });        
    }
    else {
        // jsonOb is a number or string
        gstr += '<li><span class="file">' + key + ' :=> ' + jsonObj + '</span></li>';
    }
};
/**
 * Function to render the json tree.
 */
var render_json_as_tree=function(jsonObj){
	gstr='';
	var str = '<ul>';
	traverse("",jsonObj);
	str += gstr + '</ul>';
	$('div#jstreeview').empty().html(str).treeview();	
};