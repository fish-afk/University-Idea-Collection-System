let jwt_key = localStorage.getItem("jwtToken");
let refreshToken = localStorage.getItem("refreshToken");
let username = localStorage.getItem("username");

const userData = JSON.parse(localStorage.getItem("userData"));

if (userData?.role_id <= 1) {
	window.location.href = "/profile.html";
}

const confirmJwt = async () => {
	let post_body = { username, jwt_key };
	await fetch("/api/users/confirmjwt", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(post_body),
	})
		.then(async (res) => {
			const response = await res.json();

			if (response?.auth == false) {
				await fetch("/api/users/refresh", {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ refreshToken, username }),
				})
					.then(async (res) => {
						const response = await res.json();

						if (response?.status == true) {
							localStorage.setItem("jwtToken", response?.jwt);
						} else {
							Swal.fire({
								title: "Error!",
								text: "Your Session has expired and you will need to log in again",
								icon: "error",
								confirmButtonText: "Ok",
							});
							window.location.href = "/login.html";
						}
					})
					.catch((err) => {
						Swal.fire({
							title: "Error!",
							text: "Unknown error occured whilst confirming jwt",
							icon: "error",
							confirmButtonText: "Ok",
						});
						console.error(err);
					});
			}
		})
		.catch((err) => {
			Swal.fire({
				title: "Error!",
				text: "Unknown error occured whilst confirming jwt",
				icon: "error",
				confirmButtonText: "Ok",
			});
			console.error(err);
		});
};

async function getStats() {
	let post_body = { username, jwt_key };


	let stats;
	await fetch("/api/stats/getallstats", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(post_body),
	})
		.then(async (res) => {
			const response = await res.json();
			console.log(response)
			stats = response;
		})
		.catch((err) => {
			console.error(err);
			Swal.fire({
				title: "Error!",
				text: "Unknown error occured",
				icon: "error",
				confirmButtonText: "Ok",
			});
		});
	
	return stats;
}

const populateExceptionReportsDom = (reports) => {
	document.getElementById("ideas-without-comments").innerText =
		reports.ideasWithoutComments;
	
	document.getElementById("anonymous-ideas").innerText =
		reports.anonymousIdeasCount;
	
	document.getElementById("anonymous-comments").innerText =
		reports.anonymousCommentsCount;
	
}

function drawCharts(stats) {
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

const main = async () => {
	await confirmJwt()
	let stats = await getStats()
	populateExceptionReportsDom(stats)

	google.charts.load("current", { packages: ["corechart"] });
	google.charts.setOnLoadCallback(drawCharts);
}

main()
