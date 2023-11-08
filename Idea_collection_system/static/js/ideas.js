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

//like animations
function like(idea_id) {
	let post_body = { username, jwt_key, idea_id };
	fetch("/api/ideas/likepost", {
		method: "PATCH",
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
			}).then(() => {
				window.location.reload();
			});
		})
		.catch(async (err) => {
			Swal.fire({
				title: "Error!",
				text: "Unknown error occured whilst liking post",
				icon: "error",
				confirmButtonText: "Ok",
			});
			console.error(err);
		});
}

function dislike(idea_id) {
	let post_body = { username, jwt_key, idea_id };
	fetch("/api/ideas/dislikepost", {
		method: "PATCH",
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
			}).then(() => {
				window.location.reload();
			});
		})
		.catch(async (err) => {
			Swal.fire({
				title: "Error!",
				text: "Unknown error occured whilst liking post",
				icon: "error",
				confirmButtonText: "Ok",
			});
			console.error(err);
		});
}

const fetchAllIdeas = async () => {
	let post_body = { jwt_key, username };

	let ideas;

	await fetch("/api/ideas/getallideas", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(post_body),
	})
		.then(async (res) => {
			const response = await res.json();
			ideas = response?.data;
		})
		.catch((err) => {
			console.error(err);
			Swal.fire({
				title: "Error!",
				text: "Unknown error occured whilst fetching ideas",
				icon: "error",
				confirmButtonText: "Ok",
			});
		});

	return ideas;
};

const reportPost = (idea_id) => {
	Swal.fire({
		title: "Enter your report :",
		input: "text",
		inputAttributes: {
			autocapitalize: "off",
		},
		showCancelButton: true,
		confirmButtonText: "Submit",
		showLoaderOnConfirm: true,
		preConfirm: (value) => {
			// You can access the entered value here
			return value;
		},
		allowOutsideClick: () => !Swal.isLoading(),
	}).then(async (result) => {
		if (result.isConfirmed) {
			// User has confirmed the input, now you can send it to the API
			const inputValue = result.value;
			if (inputValue == "" || !inputValue) {
				Swal.fire({
					title: "Error!",
					text: "Please enter a report",
					icon: "error",
					confirmButtonText: "Ok",
				});
				return;
			}
			let post_body = { jwt_key, username, report: inputValue, idea_id };
			await fetch("/api/reports/newreport", {
				method: "POST",
				body: JSON.stringify(post_body),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
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
					console.error(err);
					Swal.fire({
						title: "Error!",
						text: "Unknown error occured",
						icon: "error",
						confirmButtonText: "Ok",
					});
				});
		}
	});
};

const populateDomWithIdeas = (ideas) => {
	const idea_dom_part = document.getElementById("idea-list");
	const pagination_part = document.getElementById("pagination");
	const view_by = document.getElementById("view-by");

	console.log(ideas);
	if (ideas?.length < 1) {
		idea_dom_part.innerHTML = `<div 
				style="display:flex;background-color:white;width:100%;justify-content:center;height:50vh;align-items:center;">
				<h1>No Ideas Posted Yet</h1></div>`;

		pagination_part.style.display = "none";
		view_by.style.display = "none";
	} else {
		for (let i = 0; i < ideas.length; i++) {
			idea_dom_part.innerHTML += `<div class="idea one">
                <div class="info">
                    <div class="user">
                        <img src="images/profile.jpg" alt="">
                        <p>${
													ideas[i]?.post_is_anonymous == 1
														? "anonymous"
														: ideas[i]?.username
												}</p>
                    </div>
                    <div class="tag">
                        <h3>Category:</h3>
                        <p class="category">${ideas[i]?.category_name}</p>
						<button class='report-btn' onClick={reportPost(${
							ideas[i]?.idea_id
						})} id="report-${ideas[i]?.idea_id}">Report Post</button>
                    </div>
                </div>
				<br>
                <div class="content">
					<h2>${ideas[i]?.idea_title}</h2>
					<br>
                    <p>${ideas[i]?.idea_body}</p>
					<br>
					<br>
                    <div class="docs" style="display:${
											!ideas[i]?.idea_documents ? "none" : ""
										};">
						
                        <div class="name">
                            <i class="fas fa-file"></i>
                            <a target="_blank" href="/api/ideas/getdocumentfile?filename=${
															ideas[i]?.idea_documents
														}&token=${jwt_key}&username=${username}"><p style="color:wheat;">Download Attached Document</p></a>
                        </div>
                        <a target="_blank" href="/api/ideas/getdocumentfile?filename=${
													ideas[i]?.idea_documents
												}&token=${jwt_key}&username=${username}"><i class="fas fa-cloud-download-alt"></i></a>
                    </div>
                </div>


                <div class="reactions">
                    <div class="react">
                        <div class="feedback likes">
                            <i class="like like far fa-thumbs-up" id="like" onclick="like(${
															ideas[i]?.idea_id
														})"></i>
                            <p>${ideas[i].num_likes}</p>
                        </div>
                        <div class="feedback dislikes">
                            <i class="dislike far fa-thumbs-down" id="dislike" onclick="dislike(${
															ideas[i]?.idea_id
														})"></i>
                            <p>${ideas[i].num_dislikes}</p>
                        </div>
                        <div class="feedback comment-icon">
                            <a href='/comments.html?idea_id=${
															ideas[i]?.idea_id
														}' target='_blank'>
								<i class="comment far fa-comment" id="commenticon"></i>
							</a>
                            
                        </div>
                    </div>
                    <div class="report">
                        Posted On: ${new Date(
													ideas[i]?.date_and_time_posted_on,
												)}
                    </div>
                </div>
                `;
		}
	}
};

const main = async () => {
	await confirmJwt();
	let ideas = await fetchAllIdeas();
	populateDomWithIdeas(ideas);
};

main();
