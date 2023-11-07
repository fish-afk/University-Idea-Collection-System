let jwt_key = localStorage.getItem("jwtToken");
let refreshToken = localStorage.getItem("refreshToken");
let username = localStorage.getItem("username");

//Hamburger menu on mobile devices

//enable submit idea button when user agrees to terms and conditions
function enable() {
	var check = document.getElementById("check");
	var submit = document.getElementById("submit-idea-btn");

	if (check.checked) {
		submit.removeAttribute("disabled");
	} else {
		submit.setAttribute("disabled", "true");
	}
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

const fetchAndPopulateCategoriesDom = async () => {
	let categories_dom = document.getElementById("categories");

	let post_body = { username, jwt_key };
	await fetch("/api/categories/getallcategories", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(post_body),
	})
		.then(async (res) => {
			const response = await res.json();

			let categories = response?.data;
			for (let i = 0; i < categories?.length; i++) {
				categories_dom.innerHTML +=
					`<option value="${categories[i]?.category_id}" label="${categories[i]?.name}">`;
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
const submitIdea = async () => {
	const idea_title = document.getElementById("idea-title").value;
	const idea_body = document.getElementById("idea-content").value;
	const post_is_anonymous = document.getElementById("anonymous").value;
	const category_id = document.getElementById("categories").value;

	let post_body = {
		idea_title,
		idea_body,
		post_is_anonymous,
		category_id,
		username,
		jwt_key,
	};

	await fetch("/api/ideas/newidea", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(post_body),
	})
		.then(async (res) => {
			const response = await res.json();
			Swal.fire({
				title: "Info",
				text: response?.message,
				icon: "info",
				confirmButtonText: "Ok",
			});
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

fetchAndPopulateCategoriesDom()

document
	.getElementById("submit-idea-btn")
	.addEventListener("click", async () => {
		await confirmJwt();
		await submitIdea();
	});
