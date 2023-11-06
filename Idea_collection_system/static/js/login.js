const login_btn = document.getElementById("login_btn");

login_btn.addEventListener("click", () => {
	let username = document.getElementById("username").value;
	let password = document.getElementById("password").value;
	const appkey = "Idea_Collection_System_APPKEY123"; // could be hidden in a better way

	let post_body = { username, password, appkey };
	fetch("/api/users/login", {
		method: "POST",
		body: JSON.stringify(post_body),
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	})
		.then(async (res) => {
			const data = await res.json();
			if (data?.status == "FAILURE") {
				Swal.fire({
					title: "Error!",
					text: data?.message,
					icon: "error",
					confirmButtonText: "Ok",
				});
			} else {
				localStorage.setItem("jwtToken", data?.jwtToken);
				localStorage.setItem("refreshToken", data?.refreshToken);
				localStorage.setItem("username", username);
				window.location.href = "/profile.html";
			}

			console.log(data);
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
});
