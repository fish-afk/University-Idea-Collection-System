const qa_coordinator_signup_btn = document.getElementById(
	"qa_coordinator_signup_btn",
);

qa_coordinator_signup_btn.addEventListener("click", () => {
	let username = document.getElementById("username").value;
	let firstname = document.getElementById("firstname").value;
	let lastname = document.getElementById("lastname").value;
	let email = document.getElementById("email").value;
	let password = document.getElementById("password").value;
	let confirm_password = document.getElementById("confirm_password").value;
	let department_id = document.getElementById("department_select").value;
	let high_priv_key = document.getElementById("high_priv_key").value;

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
			high_priv_key,
			role_id: 2,
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
					text: response?.message,
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
