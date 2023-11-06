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
    }).then(async (res) => {
        
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
                        alert('Your Session has expired and you will need to log in again')
                        window.location.href = "/login.html"
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

const getUserData = () => {
	let post_body = { jwt_key, username };

	if (!jwt_key || !refreshToken || !username) {
		window.location.href = "/login.html";
	} else {
		fetch("/api/users/getuserdata", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(post_body),
		})
			.then(async (res) => {
				const data = await res.json();
				if (data?.status == "FAILURE") {
					alert(data?.message);
				} else {
					localStorage.setItem("userData", JSON.stringify(data?.data));
				}
			})
			.catch((err) => {
				alert("Unknown error occured");
				console.error(err);
			});
	}
};

const setDetails = () => {
	const userData = JSON.parse(localStorage.getItem("userData"));
	const role_id = userData?.role_id;

	let role = "";
	let staff_type = "";
	if (role_id == 1) {
		role = "Staff";
		staff_type = userData?.staff_type_id == 1 ? "Academic" : "Support";
	}
	if (role_id == 2) {
		role = "QA Coordinator";
	}
	if (role_id == 3) {
		role = "QA Manager";
	}
	if (role_id == 4) {
		role = "Administrator";
	}

	document.getElementById("fullname").innerText =
		userData?.firstname + " " + userData?.lastname;
	document.getElementById("role").innerText = role;
	document.getElementById("last_log_in").innerText = userData?.last_log_in == null ? "" :
		"Last Login: " + new Date(userData?.last_log_in);
	document.getElementById("staff_type").innerText = staff_type;

};

const changePassword = () => {
	const newPassword = document.getElementById("newpass").value;
	const confirmnewPassword = document.getElementById("confirm-newpass").value;

	if (newPassword !== confirmnewPassword) {
		alert("Passwords dont match!");
	} else {
		fetch("/api/users/changepassword", {
			method: "PATCH",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ newPassword, jwt_key, username }),
		})
			.then(async (res) => {
				const response = await res.json();
				alert(response?.message);
			})
			.catch((err) => {
				console.error(err);
				alert("Unknown error occured");
			});
	}
};

const editProfile = async () => {
	const firstname = document.getElementById("fname-edit").value;
	const lastname = document.getElementById("lname-edit").value;
    const email = document.getElementById("email-edit").value;

	
    fetch("/api/users/updatedetails", {
			method: "PATCH",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, firstname, lastname, jwt_key, username }),
		})
			.then(async (res) => {
				const response = await res.json();
				alert(response?.message);
			})
			.catch((err) => {
				console.error(err);
				alert("Unknown error occured");
			});
	
};

document.getElementById("change-pass-btn").addEventListener("click", () => {
	changePassword();
});

document.getElementById("edit-save-btn").addEventListener('click', async () => {
	await editProfile();
});

confirmJwt();
getUserData();
setDetails();
