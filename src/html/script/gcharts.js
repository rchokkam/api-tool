// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']});
      
// Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(drawChart);
      
// Callback that creates and populates a data table, 
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {
   // Create the data table.
   var data = new google.visualization.DataTable();
   data.addColumn('string', 'Request');
   data.addColumn('number', 'Count');
   data.addRows([
      ['GET', 30],
      ['POST', 10],
      ['PUT', 20], 
      ['DELETE', 40]
   ]);

   // Set chart options
   var options = {'title':'Service requests',
                  'width':450,
                  'height':300};

   // Instantiate and draw our chart, passing in some options.
   var pieChart = new google.visualization.PieChart(document.getElementById('pie_chart_div'));
   pieChart.draw(data, options);

   var barChart = new google.visualization.BarChart(document.getElementById('bar_chart_div'));
   barChart.draw(data, options);

   var lineChartData = new google.visualization.DataTable();
   lineChartData.addColumn('string','Year');
   lineChartData.addColumn('number','Sales');
   lineChartData.addColumn('number','Expense');
   lineChartData.addRows(4);
   lineChartData.setValue(0,0,'2004');
   lineChartData.setValue(0,1,1000);
   lineChartData.setValue(0,2,400);

   lineChartData.setValue(1,0,'2005');
   lineChartData.setValue(1,1,1170);
   lineChartData.setValue(1,2,460);

   lineChartData.setValue(2,0,'2006');
   lineChartData.setValue(2,1,860);
   lineChartData.setValue(2,2,580);

   lineChartData.setValue(3,0,'2007');
   lineChartData.setValue(3,1,1050);
   lineChartData.setValue(3,2,540);

   var lineChart = new google.visualization.LineChart(document.getElementById('line_chart_div'));
   lineChart.draw(lineChartData,options);

   var columnChartData = new google.visualization.DataTable();
   columnChartData.addColumn('string', 'Status');
   columnChartData.addColumn('number', 'GET');
   columnChartData.addColumn('number', 'PUT');
   columnChartData.addColumn('number', 'POST');
      
   columnChartData.addRows(4);
   columnChartData.setValue(0, 0, '200');
   columnChartData.setValue(0, 1, 180);
   columnChartData.setValue(0, 2, 400);
   columnChartData.setValue(0, 3, 400);

   columnChartData.setValue(1, 0, '400');
   columnChartData.setValue(1, 1, 1170);
   columnChartData.setValue(1, 2, 460);
   columnChartData.setValue(1, 3, 300);

   columnChartData.setValue(2, 0, '501');
   columnChartData.setValue(2, 1, 660);
   columnChartData.setValue(2, 2, 1120);
   columnChartData.setValue(2, 3, 200);

   columnChartData.setValue(3, 0, '409');
   columnChartData.setValue(3, 1, 1030);
   columnChartData.setValue(3, 2, 540);
   columnChartData.setValue(3, 3, 100);

   var columnChart = new google.visualization.ColumnChart(document.getElementById('column_chart_div'));
   columnChart.draw(columnChartData, {width: 450, height: 240, title: 'Access Log Status',
                          hAxis: {title: 'Status', titleTextStyle: {color: 'red'}}
                       });

   var areaChartData = new google.visualization.DataTable();
   areaChartData.addColumn('string', 'Method');
   areaChartData.addColumn('number', 'kunde');
   areaChartData.addColumn('number', 'address');
   areaChartData.addColumn('number', 'ordre');
   areaChartData.addRows([
          ['GET', 1000, 400, 120],
          ['POST', 1170, 460, 350],
          ['PUT', 660, 1120, 450],
          ['DELETE', 1030, 540, 50]
        ]);

   var areaChart = new google.visualization.AreaChart(document.getElementById('area_chart_div'));
        areaChart.draw(areaChartData, {width: 450, height: 240, title: 'Company Performance',
                          hAxis: {title: 'Year', titleTextStyle: {color: '#FF0000'}}
                       });

}