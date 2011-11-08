$(function() {
	// Tab widget
	$("#tabs").tabs();

	// Events -> Browser events
	$(window).resize(function() {
		$('div#browser_resize').text($(window).width());
	});

	//Both buttons are disable at the of loading the page
	$("input#nbutton").attr("disabled", true);
	$("input#pbutton").attr("disabled", true);

	// generate accordian element dynamically
	$
			.getJSON(
					"config/kasia2.js",
					function(data) {
						var str = "";
						var preandpost = data.preandprod;
						$.each(data.modules, function(i, item) {
							str += "<h3><a href=\"#\">" + item.name
									+ "</a></h3><div><dt>";
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

						// handle resource uri link click event
						$("a#resourceuri")
								.click(
										function() {
											clear_div_content();
											var aurl = $(this).attr("href");
											$("#iurl").attr("value", aurl);

											// generate request form dynamically
											var ruri = $("#iurl").attr("value");
											var tokens = ruri.split("/");

											var str_html = "<table id=\"tblrequest\" cellpadding=\"5\" cellspacing=\"5\"><tbody>";
											for (i = 0; i < tokens.length; i++) {
												var token = tokens[i];
												if (token.length > 1
														&& token.charAt(0) == '<'
														&& token
																.charAt((token.length) - 1) == '>') {
													token = token.substr(1,
															token.length - 2);
													str_html += "<tr><td>";
													str_html += token
															+ "</td><td>";
													str_html += "<input type=\"text\" id=\""
															+ token + "\"/>"
													str_html += "</td></tr>";
												}
											}

											var rmethod=get_method(ruri);
											if(rmethod!=null && (rmethod=="PUT" || rmethod=="POST")){
												str_html += "<tr><td> data </td><td>";
												str_html += "<textarea col=\"80\" rows=\"30\" id=\"rbody\">";
												str_html += "</textarea></td></tr>";
											}
											str_html += "</tbody></table>";
											$("div#request").html(str_html);

											if(rmethod!=null && (rmethod=="PUT" || rmethod=="POST")){
												set_schema(ruri);
											}

											// view the request tab
											$("#a-tab-1").trigger('click');
											return false;
										});

					});

	// handle onclick event on sbutton
	$("input#sbutton").click(
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

				//using $.ajax();
				var turi = uri.substring((uri.indexOf("}")) + 1),
						rmethod=get_method(uri),
						rdata=$.parseJSON(get_request_data());

				$.ajax({
					url: turi,
					processData:false,
					type: rmethod,
					data: rdata,
					beforeSend:function(jqXHR, settings){
						jqXHR.setRequestHeader("Accept", "application/vnd.yousee.kasia2+json;charset=UTF-8");
    				jqXHR.setRequestHeader("Content-Type", "application/vnd.yousee.kasia2+json;charset=UTF-8");
    				render_request_header(jqXHR);
					},
					success: function(data, textStatus, jqXHR){
						if(rmethod=="GET"){
							lhistory.push(uri);
							cur = (lhistory.length) - 1;
						}
						$("div#response").empty().html("<pre id=\"rspre\">" + JSON.stringify(data, replacer, 4)
									+ "</pre>");
						render_response_header(jqXHR,false);
						// view the
						$("#a-tab-2").trigger('click');
						if(($("pre#rspre").height())>650){
							$("pre#rspre").height(650);
						}
						$("input#nbutton").attr("disabled", true);
						$("input#nbutton").empty();
						if(lhistory.length>1){
							$("input#pbutton").removeAttr("disabled");
						}						
					},
					error: function(jqXHR, textStatus, errorThrown){
						//$("div#reqheader").empty().html(prettyPrint(jqXHR,{maxDepth: 1}));
						render_response_header(jqXHR,true);
						$("#a-tab-4").trigger('click');
					}						
				});
			});

	// handle dummy button event
	$("input#dbutton").click(
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
				$.getJSON(uri, function(data) {
					$("div#response").html(
							"<pre id=\"rspre\">" + JSON.stringify(data, replacer, 4)
									+ "</pre>");
				  if(($("pre#rspre").height())>650){
					  $("pre#rspre").height(650);
				  }
				});

				// view the
				$("#a-tab-2").trigger('click');				
			});

	// handle enter key for request
	$("#request").keypress(function(e) {
        	if(e.which == 13) {
            		jQuery(this).blur();
            		jQuery('input#sbutton').focus().click();
        	}
		$("input#pbutton").attr("disabled", true);
	});

	// handle onclick event for prev button
	$("input#nbutton").click(function() {
		if (lhistory.length > 0 && cur < (lhistory.length) - 1) {
			cur += 1;
			$("#iurl").attr("value", lhistory[cur]);
			$("input#dbutton").trigger('click');
			$("input#pbutton").removeAttr("disabled");
				if(cur == (lhistory.length) - 1) {
					$("input#nbutton").attr("disabled", true);
				}
		} else {
			$("input#nbutton").attr("disabled", true);
		}
	});

	// handle onclick event for next button
	$("input#pbutton").click(function() {
		if (cur > 0) {
			cur -= 1;
			$("#iurl").attr("value", lhistory[cur]);
			$("input#dbutton").trigger('click');
			$("input#nbutton").removeAttr("disabled");
				if(cur == 0) {
					$("input#pbutton").attr("disabled", true);
				}
		} else {
			$("input#pbutton").attr("disabled", true);
		}
	});

});


/**
 * clear request header,response header and response.
 */
var clear_div_content=function(){
	$("div#response").empty();
	$("div#reqheader").empty();
	$("div#resheader").empty();
};
/**
 * render request header.
 */
var render_request_header=function(jqXHR){
	var str = "<table style=\"width:100%\"><tbody>";
	//str += "<tr><td>test</td><td>test</td></tr>";
	str += "</tbody></table>";
	$("div#reqheader").empty().html(str);
};
/**
 * render response header.
 */
var render_response_header=function(jqXHR,error){
	var str = "<table style=\"width:100%\"><tbody>";
	str += "<tr><td width=\"30%\">Ready State</td><td>" + jqXHR.readyState + "</td></tr>";
	//str += "<tr><td>Response Text</td><td>" + jqXHR.responseText + "</td></tr>";
	str += "<tr><td>Status</td><td>" + jqXHR.status + "</td></tr>";
	str += "<tr><td>Status Text</td><td>" + jqXHR.statusText + "</td></tr>";
	if(error){
		str += "<tr><td>Response Text</td><td><pre>" + JSON.stringify(jqXHR.responseText, simple_replacer, 4) + "</pre></td></tr>";
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
}

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
		return "<span class='nesturi' onclick='nested_call(this)'>" + avalue
				+ "</span>";
	}
	return value;
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
	$("#iurl").attr("value", $(rspan).text());
	$("input#sbutton").trigger('click');
};

/**
 * This function returns token by parsing the uri based on <token> pattern.
 */
var get_ruri_tokens=function(ruri) {
	var tokens = ruri.split("/");
	var iparams = [];
	for (i = 0; i < tokens.length; i++) {
		var token = tokens[i];
		if (token.length > 1 && token.charAt(0) == '<'
				&& token.charAt((token.length) - 1) == '>') {
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