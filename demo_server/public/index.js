$(function () {

function checkTolerances(data){
	var result = "";
	if(data.humidity>60){
		result += "<h3>CHECK HUMIDITY!!</h3>";
	}
	if(data.pressure>1020){
		result += "<h3>CHECK PRESSURE!!</h3>";
	}
	if(data.temp>33.5){
		result += "<h3>CHECK TEMPERATURE!!</h3>";
	}
	document.getElementById("msg").innerHTML = result;

}
var socket = io();
socket.on('update', function(msg){
	  var data = msg;
	  var d = new Date(data.timestamp);
	  var n = d.toString();
	  document.getElementById("time").innerHTML = n;
	  document.getElementById("humidity").innerHTML = msg.humidity;
	  document.getElementById("temperature").innerHTML = msg.temp;
	  document.getElementById("pressure").innerHTML = msg.pressure;
	  updateChart(data);
	  checkTolerances(data);
});
	
var dps1 = []; // dataPoints
var dps2 = []; // dataPoints
var dps3 = []; // dataPoints

var chart = new CanvasJS.Chart("chartContainer", {
	title :{
		text: "Data Chart"
	},
	legend: {
            cursor: "pointer",
            itemclick: function (e) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }

                e.chart.render();
            }
        },
	axisY: {
		includeZero: false
	},      
	data: [
	{
		name: "Humidity",
		showInLegend: true,
		type: "line",
		dataPoints: dps1
	},
	{
		name: "Temperature",
		showInLegend: true,
		type: "line",
		dataPoints: dps2
	},
	{
		name: "Pressure",
		showInLegend: true,
		type: "line",
		dataPoints: dps3
	},
	]
});

var dataLength = 20; // number of dataPoints visible at any point

function updateChart(chartData) {

	dps1.push({
			x: new Date(chartData.timestamp),
			y: Math.round(chartData.humidity)
		});
		
	dps2.push({
			x: new Date(chartData.timestamp),
			y: Math.round(chartData.temp)
		});	
	dps3.push({
			x: new Date(chartData.timestamp),
			y: Math.round(chartData.pressure)
		});

	if (dps1.length > dataLength) {
		dps1.shift();
		dps2.shift();
		dps3.shift();
		}

	chart.render();
};


  });
