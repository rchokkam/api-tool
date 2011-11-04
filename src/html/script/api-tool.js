$(function() {
	// Tab widget
	$("#tabs").tabs();

	// Events -> Browser events
	$(window).resize(function() {
		$('div#browser_resize').text($(window).width());
	});

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
											$("div#response").empty();
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
											
											
											var rmethod=ruri.substring(ruri.indexOf("{")+1,ruri.indexOf("}"));
											if(rmethod!=null && (rmethod=="PUT" || rmethod=="POST")){
												str_html += "<tr><td> Data </td><td>";
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
				$("div#response").empty();
				var uri = $("#iurl").val();
				var tokens = get_ruri_tokens(uri), token = "";
				for (i = 0; i < tokens.length; i++) {
					token = tokens[i];
					uri = uri.replace(token, $(
							"input#" + token.substr(1, token.length - 2)).attr(
							"value"));
				}

				var turi = uri.substring((uri.indexOf("}")) + 1);
				$.getJSON(turi, {
					"error" : function(errorObject) {
						$("div#response").html(errorObject);
					}
				}, function(data) {
					lhistory.push(uri);
					cur = (lhistory.length) - 1;
					$("div#response").html(
							"<pre>" + JSON.stringify(data, replacer, 4)
									+ "</pre>");
				});

				// view the
				$("#a-tab-2").trigger('click');
			});

	// handle dummy button event
	$("input#dbutton").click(
			function() {
				$("div#response").empty();
				var uri = $("#iurl").val();
				var tokens = get_ruri_tokens(uri), token = "";
				for (i = 0; i < tokens.length; i++) {
					token = tokens[i];
					uri = uri.replace(token, $(
							"input#" + token.substr(1, token.length - 2)).attr(
							"value"));
				}

				uri = uri.substring((uri.indexOf("}")) + 1);
				$.getJSON(uri, {
					"error" : function(errorObject) {
						$("div#response").html(errorObject);
					}
				}, function(data) {
					$("div#response").html(
							"<pre>" + JSON.stringify(data, replacer, 4)
									+ "</pre>");
				});

				// view the
				$("#a-tab-2").trigger('click');
			});

	// handle onclick event for prev button
	$("input#nbutton").click(function() {
		if (lhistory.length > 0 && cur < (lhistory.length) - 1) {
			cur += 1;
			$("#iurl").attr("value", lhistory[cur]);
			$("input#dbutton").trigger('click');
		} else {
			alert("no next");
		}

	});

	// handle onclick event for next button
	$("input#pbutton").click(function() {
		if (cur > 0) {
			cur -= 1;
			$("#iurl").attr("value", lhistory[cur]);
			$("input#dbutton").trigger('click');
		} else {
			alert("no prev");
		}
	});

});

/**
 * based on the environment build the context of uri dynamically.
 */
function generate_uri(preandprod, module, resource) {
	var hosts = preandprod.toString();
	var ruri = "{" + resource.method + "}" + module.context;
	if (hosts.match(location.hostname) != null) { // preprod and production
													// environment
		ruri += resource.uri;
	} else { // other than preprod and production environment
		ruri += "-v" + resource.version + resource.uri;
	}
	return ruri;
}

function set_schema(ruri){
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
}

/**
 * Replacer callback function for JSON.stringnify.
 */
function replacer(key, value) {
	if (key != null && key == "href") {
		var urlStart = location.protocol + "//" + location.host;
		var avalue = value.replace(urlStart, "");
		return "<span class='nesturi' onclick='nested_call(this)'>" + avalue
				+ "</span>";
	}
	return value;
}

function simple_replacer(key, value) {
	return value;
}
/**
 * 
 */
function nested_call(rspan) {
	$("#iurl").attr("value", $(rspan).text());
	$("input#sbutton").trigger('click');
}

/**
 * This function returns token by parsing the uri based on <token> pattern.
 */
function get_ruri_tokens(ruri) {
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
}