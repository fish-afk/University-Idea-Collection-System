const login_btn = document.getElementById("login_btn")

login_btn.addEventListener('click', () => {
    let username = document.getElementById('username').value;
    let password = document.getElementById("password").value;
    const appkey = "Idea_Collection_System_APPKEY123";


    let post_body = {username, password, appkey}
    fetch('/api/users/login', {
        method: "POST", body: JSON.stringify(post_body)
        ,
        headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
        
    }).then(async (res) => {
        const data = await res.json()
        if (data?.status == "FAILURE") {
            alert(data?.message);
        } else {
            localStorage.setItem('jwtToken', data?.jwtToken)
            localStorage.setItem('refreshToken', data?.refreshToken)
            localStorage.setItem('username', username)
            alert('Logged in successfully!')
            window.location.href = "/profile.html"
        }
        
        console.log(data)
    }).catch(err => {
        alert('Unknown error occured')
        console.error(err)
    })
})