function myFunction() {
	var x = document.getElementById("nav");
	if (x.className === "navbar") {
		x.className += " responsive";
	} else {
		x.className = "navbar";
	}
}

const setNavbarUsername = async () => {
	const userData = JSON.parse(localStorage?.getItem("userData"));
	let navusernamelist = document.getElementsByClassName("nav-username");

	for (let i = 0; i < navusernamelist.length; i++) {
		navusernamelist[i].innerHTML = `<p>${userData?.username}</p>`;
	}
};

const hideLinksBasedOnAccountType = async () => {
	const userData = JSON.parse(localStorage?.getItem("userData"));
	let manageLinks = document.getElementsByClassName("nav-manage-link");
	let statsLinks = document.getElementsByClassName("nav-stats-link");
	let submitLinks = document.getElementsByClassName('nav-submit-link')

	if (userData?.role_id <= 1) {
		for (let i = 0; i < manageLinks.length; i++) {
			manageLinks[i].parentElement.remove();
		}

		for (let i = 0; i < statsLinks.length; i++) {
			statsLinks[i].parentElement.remove();
		}
	}

	if (userData?.role_id > 1) {
		for (let i = 0; i < submitLinks.length; i++) {
			submitLinks[i].parentElement.remove();
		}

	}

	if (userData?.role_id == 2) {
		for (let i = 0; i < manageLinks.length; i++) {
			manageLinks[i].parentElement.remove();
		}
	}

};

const LogOut = () => {
	const logoutBtn = document.getElementById("logout-btn");
	logoutBtn.addEventListener('click', () => {
		localStorage.clear()
	})
}

setNavbarUsername();
hideLinksBasedOnAccountType()
LogOut()
