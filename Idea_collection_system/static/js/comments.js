const urlParams = new URLSearchParams(window.location.search);
let jwt_key = localStorage.getItem("jwtToken");
let refreshToken = localStorage.getItem("refreshToken");
let username = localStorage.getItem("username");

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

const fetchComments = async () => {
	const idea_id = urlParams.get(["idea_id"]);
	let post_body = { idea_id, username, jwt_key };

	let comments;
	await fetch("/api/comments/getallcommentsforidea", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(post_body),
	})
		.then(async (res) => {
			const response = await res.json();

			comments = response?.data;
		})
		.catch((err) => {
			Swal.fire({
				title: "Error!",
				text: "Unknown error occured whilst fetching comments",
				icon: "error",
				confirmButtonText: "Ok",
			});
			console.error(err);
		});

	return comments;
};

const populateDomWithComments = (comments) => {
	let comments_dom = document.getElementById("comments-div");

	console.log(comments);
	if (comments?.length < 1) {
		comments_dom.innerHTML = `<div 
				style="display:flex;background-color:white;width:100%;justify-content:center;height:50vh;align-items:center;">
				<h1>No Comments Have Been Posted On this Idea Yet.</h1></div>`;
	}
	for (let i = 0; i < comments?.length; i++) {
		comments_dom.innerHTML += `<div class="comment">
                        <div class="img">
                            <img src="images/profile.jpg" alt="">
                        </div>
                        <div class="content">
                            <h3 class="user-name">${
															comments[i]?.post_is_anonymous == 1
																? "anonymous"
																: comments[i]?.username
														}</h3>

                            
                            <p class="text">${comments[i]?.comment}</p>
                           
                            <br>
                            <p class="text"><em>Posted On:${new Date(
															comments[i]?.date_and_time_posted_on,
														)}</em> </p>

                        </div>
                    </div><div class="line"></div>`;
	}
};

const main = async () => {
	await confirmJwt();
	let comments = await fetchComments();
	populateDomWithComments(comments);
};

main();

document
	.getElementById("post-comment-btn")
	.addEventListener("click", async () => {
		const comment = document.getElementById("comment-post-body").value;
		const idea_id = urlParams.get(["idea_id"]);
		const post_is_anonymous =
			document.getElementById("anonymous-comment").value;

		let post_body = { username, jwt_key, comment, idea_id, post_is_anonymous };

		await fetch("/api/comments/newcomment", {
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
	});
