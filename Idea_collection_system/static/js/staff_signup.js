const staff_signup_btn = document.getElementById("staff_signup_btn");

staff_signup_btn.addEventListener('click', () => {
    let username = document.getElementById('username').value;
    let firstname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirm_password = document.getElementById("confirm_password").value;
    let department_id = document.getElementById("department_select").value;
    let staff_type_id = document.getElementById("staff_type_select").value;


    if (password != confirm_password) {
        alert("Passwords dont match");
    } else {
        let post_body = { username, firstname, lastname, email, password, department_id, staff_type_id };

        console.log(post_body)
        
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
                        alert(data?.message);

                        if (data?.status == "SUCCESS") {
                            window.location.href = "/login.html"
                        }
					})
					.catch((err) => {
						console.log(err);
						alert("unknown error occured!");
					})
					.finally(() => {
						// window.location.reload()
					});
    }
})