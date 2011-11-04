$(function() {
  $("#tabs").tabs();
  $(window).resize(function() {
    $("div#browser_resize").text($(window).width())
  });
  $.getJSON("config/kasia2.json", function(a) {
    var c = "", b = a.preandprod;
    $.each(a.modules, function(a, d) {
      c += '<h3><a href="#">' + d.name + "</a></h3><div><dt>";
      $.each(d.resources, function(a, e) {
        c += '<dl><a href="' + generate_uri(b, d, e) + '" id="resourceuri">' + e.label + "</a></dl>"
      });
      c += "</dt></div>"
    });
    $("div#accordion").html(c);
    $("div#accordion").accordion({autoHeight:false, navigation:true});
    $("a#resourceuri").click(function() {
      $("div#response").empty();
      var a = $(this).attr("href");
      $("#iurl").attr("value", a);
      var a = $("#iurl").attr("value").split("/"), c = '<table id="tblrequest" cellpadding="5" cellspacing="5"><tbody>';
      for(i = 0;i < a.length;i++) {
        var b = a[i];
        b.length > 1 && b.charAt(0) == "<" && b.charAt(b.length - 1) == ">" && (b = b.substr(1, b.length - 2), c += "<tr><td>", c += b + "</td><td>", c += '<input type="text" id="' + b + '"/>', c += "</td></tr>")
      }
      c += "</tbody></table>";
      $("div#request").html(c);
      $("#a-tab-1").trigger("click");
      return false
    })
  });
  $("input#sbutton").click(function() {
    $("div#response").empty();
    var a = $("#iurl").val(), c = get_ruri_tokens(a), b = "";
    for(i = 0;i < c.length;i++) {
      b = c[i], a = a.replace(b, $("input#" + b.substr(1, b.length - 2)).attr("value"))
    }
    c = a.substring(a.indexOf("}") + 1);
    $.getJSON(c, {error:function(a) {
      $("div#response").html(a)
    }}, function(b) {
      lhistory.push(a);
      cur = lhistory.length - 1;
      $("div#response").html("<pre>" + JSON.stringify(b, replacer, 4) + "</pre>")
    });
    $("#a-tab-2").trigger("click")
  });
  $("input#dbutton").click(function() {
    $("div#response").empty();
    var a = $("#iurl").val(), c = get_ruri_tokens(a), b = "";
    for(i = 0;i < c.length;i++) {
      b = c[i], a = a.replace(b, $("input#" + b.substr(1, b.length - 2)).attr("value"))
    }
    a = a.substring(a.indexOf("}") + 1);
    $.getJSON(a, {error:function(a) {
      $("div#response").html(a)
    }}, function(a) {
      $("div#response").html("<pre>" + JSON.stringify(a, replacer, 4) + "</pre>")
    });
    $("#a-tab-2").trigger("click")
  });
  $("input#nbutton").click(function() {
    lhistory.length > 0 && cur < lhistory.length - 1 ? (cur += 1, $("#iurl").attr("value", lhistory[cur]), $("input#dbutton").trigger("click")) : alert("no next")
  });
  $("input#pbutton").click(function() {
    cur > 0 ? (cur -= 1, $("#iurl").attr("value", lhistory[cur]), $("input#dbutton").trigger("click")) : alert("no prev")
  })
});
function generate_uri(a, c, b) {
  c = "{" + b.method + "}" + c.context;
  c += a.toString().match(location.hostname) != null ? b.uri : "-v" + b.version + b.uri;
  return c
}
function replacer(a, c) {
  return a != null && a == "href" ? "<span class='nesturi' onclick='nested_call(this)'>" + c.replace(location.protocol + "//" + location.host, "") + "</span>" : c
}
function nested_call(a) {
  $("#iurl").attr("value", $(a).text());
  $("input#sbutton").trigger("click")
}
function get_ruri_tokens(a) {
  var a = a.split("/"), c = [];
  for(i = 0;i < a.length;i++) {
    var b = a[i];
    b.length > 1 && b.charAt(0) == "<" && b.charAt(b.length - 1) == ">" && c.push(b)
  }
  return c
}
;