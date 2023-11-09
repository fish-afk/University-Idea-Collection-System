let jwt_key = localStorage.getItem("jwtToken");
let refreshToken = localStorage.getItem("refreshToken");
let username = localStorage.getItem("username");

//Hamburger menu on mobile devices

const userData = JSON.parse(localStorage.getItem("userData"));

if (userData?.role_id > 1) {
	window.location.href = "/profile.html";
}


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
	await confirmJwt()
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

	if (idea_title == "" || idea_title.length < 5 || idea_body == "" || idea_body.length < 5) {
		Swal.fire({
			title: "Error!",
			text: "Please enter a longer idea title and idea body",
			icon: "error",
			confirmButtonText: "Ok",
		});
		return;
	}

	let post_body = {
		idea_title,
		idea_body,
		post_is_anonymous,
		category_id,
		username,
		jwt_key,
	};

	let idea_id;

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
			idea_id = response?.idea_id;
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
	
	return idea_id;
};

const submitIdeaDocuments = async (idea_id) => {
	const fileInput = document.getElementById("Documents");
	const selectedFile = fileInput.files[0];

	let formData = new FormData();
	formData.append("username", username);
	formData.append("jwt_key", jwt_key);
	formData.append("file", selectedFile);
	formData.append("idea_id", idea_id);

	if (selectedFile) {
		console.log(selectedFile);
		await fetch("api/ideas/uploadideadocument", {
			body: formData,
			method: "PUT",
		}).then(async (res) => {
			const response = await res.json()
			console.log(response)
		});

	} else {
		console.log("no file uploaded");
		return;
	}
}

fetchAndPopulateCategoriesDom()

document
	.getElementById("submit-idea-btn")
	.addEventListener("click", async () => {
		await confirmJwt();
		const idea_id = await submitIdea();
		submitIdeaDocuments(idea_id)
	});
