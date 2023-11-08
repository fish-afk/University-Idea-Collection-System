google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawCharts);

const userData = JSON.parse(localStorage.getItem('userData'))

if (userData?.role_id <= 1) {
	window.location.href = '/profile.html'
}

function drawCharts() {
	//ideas per dept chart
	var data = google.visualization.arrayToDataTable([
		["Department", "Ideas", { role: "style" }],
		["School of \nBusiness", 8.94, "#0275b1"],
		["School of \nComputing", 10.49, "#0275b1"],
		["School of \nFinance", 19.3, "#0275b1"],
		["Accounting", 21.45, "#0275b1"],
	]);

	var view = new google.visualization.DataView(data);
	view.setColumns([
		0,
		1,
		{
			calc: "stringify",
			sourceColumn: 1,
			type: "string",
			role: "annotation",
		},
		2,
	]);

	var options = {
		title: "Ideas per Department",
		width: 600,
		height: 200,
		bar: { groupWidth: "90%" },
		legend: { position: "none" },
	};
	var chart = new google.visualization.BarChart(
		document.getElementById("ideas-numbers"),
	);
	chart.draw(view, options);

	//draw pie chart
	var pieData = google.visualization.arrayToDataTable([
		["School", "Ideas per Department"],
		["School of business and finance", 11],
		["School of Computing", 2],
		["School of Accounting", 2],
		["School of Social Science", 2],
		["School of Finance", 7],
	]);

	var pieOptions = {
		title: "Ideas per Department (Percentage)",
		width: 600,
		height: 200,
	};

	var chart = new google.visualization.PieChart(
		document.getElementById("piechart"),
	);

	chart.draw(pieData, pieOptions);

	//Contributors per dept chart
	var data = google.visualization.arrayToDataTable([
		["Department", "Ideas", { role: "style" }],
		["School of \nBusiness", 8, "#0275b1"],
		["School of \nComputing", 10, "#0275b1"],
		["School of \nFinance", 19.3, "#0275b1"],
		["School of \nAccouting", 21.45, "#0275b1"],
	]);

	var view = new google.visualization.DataView(data);
	view.setColumns([
		0,
		1,
		{
			calc: "stringify",
			sourceColumn: 1,
			type: "string",
			role: "annotation",
		},
		2,
	]);

	var options = {
		title: "Contributors per Department",
		width: 600,
		height: 200,
		bar: { groupWidth: "90%" },
		legend: { position: "none" },
	};
	var chart = new google.visualization.BarChart(
		document.getElementById("contributor-numbers"),
	);
	chart.draw(view, options);
}
