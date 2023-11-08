const userData = JSON.parse(localStorage.getItem("userData"));

if (userData?.role_id <= 1) {
	window.location.href = "/profile.html";
}
