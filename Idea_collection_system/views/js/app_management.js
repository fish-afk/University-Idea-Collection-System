const userData = JSON.parse(localStorage.getItem("userData"));
let jwt_key = localStorage.getItem("jwtToken");
let refreshToken = localStorage.getItem("refreshToken");
let username = localStorage.getItem("username");

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

const fetchCategories = async () => {
	let categories;
	let post_body = { jwt_key, username };

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
			categories = response?.data;
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

	return categories;
};

const editCategory = async (category_id) => {
	Swal.fire({
		title: "Enter a new category name :",
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
					text: "Please enter a category name",
					icon: "error",
					confirmButtonText: "Ok",
				});
				return;
			}
			let post_body = { jwt_key, username, category_id, name: inputValue };
			await fetch("/api/categories/updatecategory", {
				method: "PATCH",
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
					}).then(() => {
						window.location.reload();
					});
				})
				.catch((err) => {
					console.error(err);
					Swal.fire({
						title: "Error!",
						text: "Unknown error occured",
						icon: "error",
						confirmButtonText: "Ok",
					}).then(() => {
						window.location.reload();
					});
				});
		}
	});
};

const deleteCategory = async (category_id) => {
	Swal.fire({
		title: "Warning",
		text: "Are you sure you want to delete this category ?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonText: "Yes, delete it!",
		cancelButtonText: "No, keep it",
	}).then(async (result) => {
		if (result.isConfirmed) {
			let post_body = { jwt_key, username, category_id };
			await fetch("/api/categories/deletecategory", {
				method: "DELETE",
				body: JSON.stringify(post_body),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then(async (res) => {
					const response = await res.json();
					console.log(response);
					Swal.fire({
						title: "Info",
						text: response?.message,
						icon: "info",
						confirmButtonText: "Ok",
					}).then(() => {
						window.location.reload();
					});
				})
				.catch((err) => {
					console.error(err);
					Swal.fire({
						title: "Error!",
						text: "Unknown error occured",
						icon: "error",
						confirmButtonText: "Ok",
					}).then(() => {
						window.location.reload();
					});
				});
		}
	});
};

const addNewCategory = async () => {
	Swal.fire({
		title: "Enter a new category",
		html: `
        <label for="name">Category Name</label>
        <input id="name" class="swal2-input" placeholder="Category name" style="border: 1px solid cyan;" autofocus>
        <label for="description">Category Description</label>
        <input id="description" class="swal2-input" placeholder="Category description" style="border: 1px solid cyan;">
    `,
		showCancelButton: true,
		confirmButtonText: "Submit",
		showLoaderOnConfirm: true,
		preConfirm: () => {
			const name = Swal.getPopup().querySelector("#name").value;
			const description = Swal.getPopup().querySelector("#description").value;
			if (!name || !description) {
				Swal.showValidationMessage(`Name and description are required`);
			}
			return { name, description };
		},
		allowOutsideClick: () => !Swal.isLoading(),
	}).then(async (result) => {
		if (result.isConfirmed) {
			// User has confirmed the input, now you can send it to the API
			const { name, description } = result.value;

			let post_body = { jwt_key, username, name, description };
			await fetch("/api/categories/newcategory", {
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
					}).then(() => {
						window.location.reload();
					});
				})
				.catch((err) => {
					console.error(err);
					Swal.fire({
						title: "Error!",
						text: "Unknown error occurred",
						icon: "error",
						confirmButtonText: "Ok",
					}).then(() => {
						window.location.reload();
					});
				});
		}
	});
};

const fetchAndPopulateClosureDates = async () => {
	let post_body = { username, jwt_key };
	await fetch("/api/ideas/getclosuredates", {
		method: "POST",
		body: JSON.stringify(post_body),
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	})
		.then(async (res) => {
			const response = await res.json();
			console.log(response);

			document.getElementById("closure-date").value = response.closure_date;
			document.getElementById("fclosure").value = response.final_closure_date;
		})
		.catch((err) => {
			Swal.fire({
				title: "Error!",
				text: "Unknown error occurred when fetching closure dates",
				icon: "error",
				confirmButtonText: "Ok",
			});
			console.error(err);
		});
};

const updateClosureDates = async () => {
	const newClosureDate = document.getElementById("closure-date").value;
	const newFinalClosureDate = document.getElementById("fclosure").value;

	if (!newClosureDate || !newFinalClosureDate) {
		alert("Missing details");
	}

	let post_body = { username, jwt_key, newClosureDate, newFinalClosureDate };

	await fetch("/api/ideas/setclosuredates", {
		method: "PATCH",
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
				text: response.message,
				icon: "info",
				confirmButtonText: "Ok",
			}).then(() => {
				window.location.reload();
			});
		})
		.catch((err) => {
			Swal.fire({
				title: "Error!",
				text: "Unknown error occurred when fetching closure dates",
				icon: "error",
				confirmButtonText: "Ok",
			}).then(() => {
				window.location.reload();
			});
			console.error(err);
		});
};

const fetchAllUsers = async () => {
	let post_body = { username, jwt_key };

	let users;
	await fetch("/api/users/getallusers", {
		method: "POST",
		body: JSON.stringify(post_body),
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	})
		.then(async (res) => {
			const response = await res.json();
			users = response?.data;
			console.log(users);
		})
		.catch((err) => {
			Swal.fire({
				title: "Error!",
				text: "Unknown error occurred when fetching users",
				icon: "error",
				confirmButtonText: "Ok",
			});
			console.error(err);
		});

	return users;
};

const fetchAllUsersByDepartment = async (department_id) => {
	let post_body = { username, jwt_key, department_id };

	let users;
	await fetch("/api/users/getallusersbydept", {
		method: "POST",
		body: JSON.stringify(post_body),
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	})
		.then(async (res) => {
			const response = await res.json();
			users = response?.data;
			console.log(users);
		})
		.catch((err) => {
			Swal.fire({
				title: "Error!",
				text: "Unknown error occurred when fetching users",
				icon: "error",
				confirmButtonText: "Ok",
			});
			console.error(err);
		});

	return users;
};


const BanUser = async (accountUsername) => {
	Swal.fire({
		title: "Warning",
		text: "Are you sure you want to ban this user ?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonText: "Yes, ban them!",
		cancelButtonText: "Cancel",
	}).then(async (result) => {
		if (result.isConfirmed) {
			let post_body = { jwt_key, username, accountUsername };
			await fetch("/api/users/disableaccount", {
				method: "PATCH",
				body: JSON.stringify(post_body),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then(async (res) => {
					const response = await res.json();
					console.log(response);
					Swal.fire({
						title: "Info",
						text: response?.message,
						icon: "info",
						confirmButtonText: "Ok",
					}).then(() => {
						window.location.reload();
					});
				})
				.catch((err) => {
					console.error(err);
					Swal.fire({
						title: "Error!",
						text: "Unknown error occured",
						icon: "error",
						confirmButtonText: "Ok",
					}).then(() => {
						window.location.reload();
					});
				});
		}
	});
};

const UnBanUser = async (accountUsername) => {
	Swal.fire({
		title: "Warning",
		text: "Are you sure you want to unban this user ?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonText: "Yes, unban them!",
		cancelButtonText: "Cancel",
	}).then(async (result) => {
		if (result.isConfirmed) {
			let post_body = { jwt_key, username, accountUsername };
			await fetch("/api/users/enableaccount", {
				method: "PATCH",
				body: JSON.stringify(post_body),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then(async (res) => {
					const response = await res.json();
					console.log(response);
					Swal.fire({
						title: "Info",
						text: response?.message,
						icon: "info",
						confirmButtonText: "Ok",
					}).then(() => {
						window.location.reload();
					});
				})
				.catch((err) => {
					console.error(err);
					Swal.fire({
						title: "Error!",
						text: "Unknown error occured",
						icon: "error",
						confirmButtonText: "Ok",
					}).then(() => {
						window.location.reload();
					});
				});
		}
	});
};

const hidePostsAndComments = async (accountUsername) => {
	Swal.fire({
		title: "Warning",
		text: "Are you sure you want to hide posts and comments for this user ?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonText: "Yes, hide them!",
		cancelButtonText: "Cancel",
	}).then(async (result) => {
		if (result.isConfirmed) {
			let post_body = { jwt_key, username, accountUsername };
			await fetch("/api/users/hideposts", {
				method: "PATCH",
				body: JSON.stringify(post_body),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then(async (res) => {
					const response = await res.json();
					console.log(response);
					Swal.fire({
						title: "Info",
						text: response?.message,
						icon: "info",
						confirmButtonText: "Ok",
					}).then(() => {
						window.location.reload();
					});
				})
				.catch((err) => {
					console.error(err);
					Swal.fire({
						title: "Error!",
						text: "Unknown error occured",
						icon: "error",
						confirmButtonText: "Ok",
					}).then(() => {
						window.location.reload();
					});
				});
		}
	});
};

const UnhidePostsAndComments = async (accountUsername) => {
	Swal.fire({
		title: "Warning",
		text: "Are you sure you want to Unhide posts and comments for this user ?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonText: "Yes, unhide them!",
		cancelButtonText: "Cancel",
	}).then(async (result) => {
		if (result.isConfirmed) {
			let post_body = { jwt_key, username, accountUsername };
			await fetch("/api/users/unhideposts", {
				method: "PATCH",
				body: JSON.stringify(post_body),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then(async (res) => {
					const response = await res.json();
					console.log(response);
					Swal.fire({
						title: "Info",
						text: response?.message,
						icon: "info",
						confirmButtonText: "Ok",
					}).then(() => {
						window.location.reload();
					});
				})
				.catch((err) => {
					console.error(err);
					Swal.fire({
						title: "Error!",
						text: "Unknown error occured",
						icon: "error",
						confirmButtonText: "Ok",
					}).then(() => {
						window.location.reload();
					});
				});
		}
	});
};

const fetchReportedPosts = async () => {
	let post_body = { username, jwt_key };

	let posts;
	await fetch("/api/reports/getallreports", {
		method: "POST",
		body: JSON.stringify(post_body),
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	})
		.then(async (res) => {
			const response = await res.json();
			posts = response?.data;
			console.log(posts);
		})
		.catch((err) => {
			Swal.fire({
				title: "Error!",
				text: "Unknown error occurred when fetching reported posts",
				icon: "error",
				confirmButtonText: "Ok",
			});
			console.error(err);
		});

	return posts;
};

function formatDateToDDMMYYYY(date) {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
}

const populateDomWithReportedPosts = (posts) => {
	const reportsDom = document.getElementById("reports-tbody");
	const reportsContainer = document.getElementById("reports-container");

	reportsDom.innerHTML = ``;

	if (posts.length < 1) {
		reportsContainer.innerHTML = `<br><br><center><h1>No posts have been reported yet. Looking good !</h1></center><br><br>`;
	}

	for (let i = 0; i < posts.length; i++) {
		reportsDom.innerHTML = `
		<tr class="row">
                        <td>${posts[i].username}</td>
                        <td>Idea ${posts[i].idea_id}</td>
                        <td>${posts[i].report}</td>
                        <td>${formatDateToDDMMYYYY(
													new Date(posts[i].report_date_time),
												)}</td>
                        <td><button onClick="deletedReportedPost('${
													posts[i].idea_id
												}')" style="padding:0.5rem;color:white;background-color:red;">Delete This Idea Post</button></td>
                    </tr>
		`;
	}
};

const deletedReportedPost = async (idea_id) => {
	let post_body = { username, jwt_key, idea_id };

	await fetch("/api/ideas/deleteidea", {
		method: "DELETE",
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
			Swal.fire({
				title: "Error!",
				text: "Unknown error occurred when deleting idea",
				icon: "error",
				confirmButtonText: "Ok",
			});
			console.error(err);
		});
};

const populateDomWithCategories = (categories) => {
	let categoriesDom = document.getElementById("categories-tbody");
	categoriesDom.innerHTML = ``;
	for (let i = 0; i < categories.length; i++) {
		categoriesDom.innerHTML += `<tr>
										<td>${categories[i].name}</td>
										<td onClick="editCategory(${categories[i].category_id})">
											<i class="fas fa-marker"></i>
										</td>
										<td onClick="deleteCategory(${categories[i].category_id})">
											<i class="fas fa-trash"></i>
										</td>
                    				</tr>`;
	}
};

const populateDomWithUsers = (users) => {
	const usersTable = document.getElementById("users-tbody");

	usersTable.innerHTML = ``;

	for (let i = 0; i < users.length; i++) {
		usersTable.innerHTML += `<tr class="row">
                        <td>${users[i].username}</td>
                        <td>${users[i].email}</td>
						<td>${formatDateToDDMMYYYY(new Date(users[i].last_log_in))}</td>
                        <td>${
													users[i].role_id == 1
														? "staff"
														: users[i].role_id == 2
														? "qa_coordinator"
														: users[i].role_id == 3
														? "qa_manager"
														: "admin"
												}
						</td>
						<td>${users[i].account_active == "1" ? "True" : "False"}</td>
                        <td>
						
						

						${
							users[i].role_id == 1
								? users[i].account_active == "1"
									? `<button style="padding:0.5rem;background-color:red;color:white;" onClick="BanUser('${users[i]?.username}')" type="button" > 
										Ban User
									</button>`
									: `<button style="padding:0.5rem;background-color:green;color:white;" type="button" onClick="UnBanUser('${users[i]?.username}')"> 
										UnBan User
									</button>`
								: ``
						}
						</td>

						<td>
						
						

						${
							users[i].role_id == 1
								? users[i].hidden_posts_and_comments == 0
									? `<button style="padding:0.5rem;background-color:red;color:white;" onClick="hidePostsAndComments('${users[i]?.username}')" type="button" > 
										Hide Posts And Comments
									</button>`
									: `<button style="padding:0.5rem;background-color:green;color:white;" type="button" onClick="UnhidePostsAndComments('${users[i]?.username}')"> 
										UnHide Posts And Comments
									</button>`
								: ``
						}
						</td>
                    </tr>`;
	}
};

const populateDomWithUsersForQaCoord = (users) => {
	const usersTable = document.getElementById("users-tbody");

	usersTable.innerHTML = ``;

	for (let i = 0; i < users.length; i++) {
		usersTable.innerHTML += `<tr class="row">
                        <td>${users[i].username}</td>
                        <td>${users[i].email}</td>
						<td>${formatDateToDDMMYYYY(new Date(users[i].last_log_in))}</td>
                        <td>${
													users[i].role_id == 1
														? "staff"
														: users[i].role_id == 2
														? "qa_coordinator"
														: users[i].role_id == 3
														? "qa_manager"
														: "admin"
												}
						</td>
						<td>${users[i].account_active == "1" ? "True" : "False"}</td>
						<td>Ideas posted: ${users[i].ideas_posted}</td>
                        

                    </tr>`;
	}

	
};

const gettotalideasperdept = async (department_id) => {
	let post_body = { username, jwt_key, department_id };

	let total;
	await fetch("/api/ideas/gettotal", {
		method: "POST",
		body: JSON.stringify(post_body),
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	})
		.then(async (res) => {
			const response = await res.json();
			console.log(response)
			total = response.data[0].total_ideas_posted;
			
		})
		.catch((err) => {
			Swal.fire({
				title: "Error!",
				text: "Unknown error occurred when fetching idea",
				icon: "error",
				confirmButtonText: "Ok",
			});
			console.error(err);
		});
	
	return total;
}


const gettotalcommentsperdept = async (department_id) => {
	let post_body = { username, jwt_key, department_id };

	let total;
	await fetch("/api/comments/gettotal", {
		method: "POST",
		body: JSON.stringify(post_body),
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	})
		.then(async (res) => {
			const response = await res.json();
			console.log(response);
			total = response.data[0].total_comments_posted;
		})
		.catch((err) => {
			Swal.fire({
				title: "Error!",
				text: "Unknown error occurred when fetching idea",
				icon: "error",
				confirmButtonText: "Ok",
			});
			console.error(err);
		});

	return total;
};


const main = async () => {
	await confirmJwt();

	if (userData?.role_id > 2) {
		let categories = await fetchCategories();
		populateDomWithCategories(categories);
		await fetchAndPopulateClosureDates();
		let users = await fetchAllUsers();
		populateDomWithUsers(users);
		let posts = await fetchReportedPosts();
		populateDomWithReportedPosts(posts);
		document.getElementById("qa-coord-section").remove();
	} else {
		let users = await fetchAllUsersByDepartment(userData?.department_id);
		populateDomWithUsersForQaCoord(users);
		document.getElementById("user-list-heading").innerText = "Users in your department";
		document.getElementById("high-priv-part1").remove();
		document.getElementById("high-priv-part2").remove();
		document.getElementById("high-priv-part3").remove();
		let totalideas = await gettotalideasperdept(userData?.department_id)
		document.getElementById("ideas-count").innerText += " " + totalideas;
		let totalcomments = await gettotalcommentsperdept(userData?.department_id);
		document.getElementById("comments-count").innerText += " " + totalcomments;
	}
	
	
};

main();

const downloadDocumentsBtn = document.getElementById(
	"download-documents-zipped-btn",
);

downloadDocumentsBtn.style.backgroundColor = "red";
downloadDocumentsBtn.innerHTML = `
<a style="color: cyan; font-size: 2rem; text-decoration: underline" target=_blank href="/api/ideas/getalldocumentszipped?username=${username}&token=${jwt_key}">
	Download Idea Documents Zipped
</a>`;


const downloadCsvBtn = document.getElementById(
	"download-csv-btn",
);


let table_to_export = document.getElementById("export-table").value;

downloadCsvBtn.style.backgroundColor = "green";
downloadCsvBtn.innerHTML = `
	<a style="color: cyan; font-size: 2rem; text-decoration: underline;" target=_blank href="/api/users/exportcsv?username=${username}&token=${jwt_key}&table=${table_to_export}">
		Download Table export as csv.
	</a>`;

document.getElementById("export-table").addEventListener('change', () => {
	let table_to_export = document.getElementById("export-table").value;
	downloadCsvBtn.style.backgroundColor = "green";
	downloadCsvBtn.innerHTML = `
	<a style="color: cyan; font-size: 2rem; text-decoration: underline;" target=_blank href="/api/users/exportcsv?username=${username}&token=${jwt_key}&table=${table_to_export}">
		Download Table export as csv.
	</a>`;
})




