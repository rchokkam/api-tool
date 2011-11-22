// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']});
// TODO dummy configuration object, maintain the configuration file.
/**
 * Configuration object.
 **/
var config;
/* = {
	method_names : ['GET','PUT','POST','DELETE'],
	status_codes : [200,400,404,406,501],
	module_names : ['abonnement','address','afsaetning','kunde','logistik','ordre','produkt','provisionering']
};*/
/**
 * Access Log JSON Object.
 **/
var accessLogObj;
/**
 * Module, method, status and its count.
 */
var ModuleMethodStatusCount = function(module_name,method_name,status_code,total_count){
	this.module_name = module_name;
	this.method_name = method_name;
	this.status_code = status_code;
	this.total_count = total_count;
};
/**
 * {
 *	modules: [{
 *		module_name: 'kunde',
 *		methods: [{
 *			method_name: 'GET',
 *			scodes: [{
 *				status_code: '200',
 *				total_count: 0 	
 * 			}]
 *		}]	
 * }]
 * }
 **/
var access_log_data = {
	modules: []
};
/**
 *
 **/
var initialize_log_data = function(){
access_log_data.modules=[];
$.each(config.module_names, function(i, mdl_name){
	var moduleMethodStatusCount = {
		module_name: mdl_name,
		methods: []	
	};
	$.each(config.method_names, function(j, m_name){
		var methodStatusCount = {
			method_name: m_name,
			scodes: []
		};
		$.each(config.status_codes, function(k, s_code){			
			(methodStatusCount.scodes).push({status_code:s_code,total_count:0});
		});
		(moduleMethodStatusCount.methods).push(methodStatusCount);
	});	
	(access_log_data.modules).push(moduleMethodStatusCount);
});
}; 
/**
 *
 **/
var update_count = function(module_name,method_name,status_code) {
$.each(access_log_data.modules,function(i, module){
	if(module.module_name == module_name){
		$.each(module.methods, function(j, method){
			if(method.method_name == method_name){
				$.each(method.scodes, function(k, scode){
					if(scode.status_code == status_code){
						scode.total_count += 1;
					}
				});
			}
		});	
	}	
});
};
/**
 *
 **/
var google_chart_data = {
	cols: [{id: 'request', label: 'Request', type: 'string'}],
	rows: []		
};
/**
 *
 **/
var initialize_google_chart_data_cols = function(){
	$.each(config.status_codes, function(k, s_code){			
		(google_chart_data.cols).push({id: ('' + s_code), label: ('' + s_code), type: 'number'});
	});
};
/**
 *
 **/
var initialize_google_chart_data_rows = function(module_name){
google_chart_data.rows = [];
$.each(access_log_data.modules,function(i, module){
	if(module.module_name == module_name){
		$.each(module.methods,function(j, method){
			var row = {
				c:[{v: method.method_name}]
			}
			$.each(method.scodes,function(k, scode){
				(row.c).push({v: scode.total_count});
			});
			(google_chart_data.rows).push(row);
		});
	}	
});
};
/**
 *
 **/
var draw_column_chart = function(module_name,gchart_data,chart_div_id){
	var column_chart_data = new google.visualization.DataTable(gchart_data);
	// Set column chart options
	var column_chart_options = {
		title: module_name,
		width:770,
		height:470,
		vAxis: {title: 'Status Count', titleTextStyle: {color: 'red'}},
		hAxis: {title: 'Request Method', titleTextStyle: {color: 'red'}}
	};
	// Instantiate and draw our chart, passing in some options.
	var column_chart = new google.visualization.ColumnChart(document.getElementById(chart_div_id));
	column_chart.draw(column_chart_data, column_chart_options);	
};
// On document load ready
$(function(){

// load configuration file.
$.getJSON("config/charts-config.js", function(data) {
	config=data;
	// Populate all_module_method_status_count array based on the configuration file.
 	initialize_log_data();
});	

// load dummy access log data
$.getJSON('config/charts-data.js', function(data) {
	accessLogObj=data;

	// traverse the accessLogObject and update the array count field.
	$.each(accessLogObj.access_logs,function(i,item){
		update_count(item.module_name,item.method_name,item.status_code);
	});

	// render the array object after updating.
	console.log(access_log_data);	

	// prepare slides container.
	var slideDiv = '';
	$.each(config.module_names,function(i, module_name){
		slideDiv += '<div class="slide"><div id="' + module_name + '_slide"></div>'
				  + '<div class="caption"><p>' + module_name + '</p></div></div>';
	});
	$('.slides_container').empty().html(slideDiv);



	$('#slides').slides({
		preload: true,
		preloadImage: 'img/loading.gif',
		play: 5000,
		pause: 2500,
		hoverPause: true,
		animationStart: function(current){
			$('.caption').animate({
				bottom:-35
			},50);
			if (window.console && console.log) {
				// example return of current slide number
				console.log('animationStart on slide: ', current);
			};
		},
		animationComplete: function(current){
			$('.caption').animate({
				bottom:0
			},100);
			if (window.console && console.log) {
				// example return of current slide number
				console.log('animationComplete on slide: ', current);
			};
		},
		slidesLoaded: function() {
			$('.caption').animate({
				bottom:0
			},100);
		}
	});

	// build data table of google chart api.
	initialize_google_chart_data_cols();

	// repeate for each module
	$.each(config.module_names,function(i, module_name){
		// initialize google chart data rows.
		initialize_google_chart_data_rows(module_name);	
		// draw google charts.

		draw_column_chart(module_name,google_chart_data,module_name + '_slide');
		//draw_column_chart(module_name,google_chart_data,module_name + '_column_chart_div');
	});

});	


});
