let jwt_key = localStorage.getItem("jwtToken");
let refreshToken = localStorage.getItem("refreshToken");
let username = localStorage.getItem("username");

const confirmJwt = () => {
	let post_body = { username, jwt_key };
	fetch("/api/users/confirmjwt", {
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
				fetch("/api/users/refresh", {
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
							alert(
								"Your Session has expired and you will need to log in again",
							);
							window.location.href = "/login.html";
						}
					})
					.catch((err) => {
						console.error(err);
					});
			}
		})
		.catch((err) => {
			console.error(err);
		});
};

const submitIdea = () => {
	const idea_title = document.getElementById("idea-title").value;
	const idea_body = document.getElementById("idea-content").value;
	const post_is_anonymous = document.getElementById("anonymous").value;
	const category_id = document.getElementById("categories").value;

	let post_body = { idea_title, idea_body, post_is_anonymous, category_id, username, jwt_key };

	fetch("/api/ideas/newidea", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(post_body),
	})
		.then(async (res) => {
			const response = await res.json();
			alert(response?.message);
		})
		.catch((err) => {
			alert("Unknown error occured");
			console.error(err);
		});
};

document.getElementById('submit-idea-btn').addEventListener('click', () => {
    confirmJwt();
    submitIdea();
})