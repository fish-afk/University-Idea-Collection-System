const staff_signup_btn = document.getElementById("staff_signup_btn");

const fetchAndPopulatedepartmentsDom = async () => {
	let departments_dom = document.getElementById("department_select");

	await fetch("/api/departments/getalldepartments", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		
	})
		.then(async (res) => {
			const response = await res.json();

			let departments = response?.data;
			for (let i = 0; i < departments?.length; i++) {
				departments_dom.innerHTML += `<option value="${departments[i]?.department_id}" label="${departments[i]?.name}">`;
			}
		})
		.catch((err) => {
			Swal.fire({
				title: "Error!",
				text: "Unknown error occured",
				icon: "error",
				confirmButtonText: "Ok",
			});
			console.error(err);
		});
};

fetchAndPopulatedepartmentsDom();

staff_signup_btn.addEventListener("click", () => {
	let username = document.getElementById("username").value;
	let firstname = document.getElementById("firstname").value;
	let lastname = document.getElementById("lastname").value;
	let email = document.getElementById("email").value;
	let password = document.getElementById("password").value;
	let confirm_password = document.getElementById("confirm_password").value;
	let department_id = document.getElementById("department_select").value;
	let staff_type_id = document.getElementById("staff_type_select").value;

	if (password != confirm_password) {
		Swal.fire({
			title: "Error!",
			text: "Passwords dont match!",
			icon: "error",
			confirmButtonText: "Ok",
		});
	} else {
		let post_body = {
			username,
			firstname,
			lastname,
			email,
			password,
			department_id,
			staff_type_id,
		};

		console.log(post_body);

		fetch("/api/users/signup", {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(post_body),
		})
			.then(async (res) => {
				const data = await res.json();
				Swal.fire({
					title: "Info",
					text: data?.message,
					icon: "info",
					confirmButtonText: "Ok",
				});

				if (data?.status == "SUCCESS") {
					window.location.href = "/login.html";
				}
			})
			.catch((err) => {
				console.log(err);
				Swal.fire({
					title: "Error!",
					text: "unknown error occured!",
					icon: "error",
					confirmButtonText: "Ok",
				});
			})
			.finally(() => {
				// window.location.reload()
			});
	}
});


