const getUserData = () => {
    let jwt_key = localStorage.getItem('jwtToken')
    let refreshToken = localStorage.getItem("refreshToken");
    let username = localStorage.getItem("username");

    let post_body = { jwt_key, username }
    
    if (!jwt_key || !refreshToken || !username) {
        window.location.href = '/login.html'
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
}

getUserData()