//Hamburger menu on mobile devices

function myFunction() {
	var x = document.getElementById("nav");
	if (x.className === "navbar") {
		x.className += " responsive";
	} else {
		x.className = "navbar";
	}
}

//enable submit idea button when user agrees to terms and conditions
function enable() {
	var check = document.getElementById("check");
	var submit = document.getElementById("submit");

	if (check.checked) {
		submit.removeAttribute("disabled");
	} else {
		submit.setAttribute("disabled", "true");
	}
}

//like animations
function like() {
	const like = document.querySelectorAll(".like");

	like.forEach((like) => {
		like.addEventListener("click", () => {
			if (like.classList.contains("far")) {
				// If not solid, switch it to solid
				like.classList.remove("far");
				like.classList.add("fas");
			} else {
				// If solid, switch it to not solid
				like.classList.remove("fas");
				like.classList.add("far");
			}
		});
	});
}

function dislike() {
	const dislike = document.querySelectorAll(".dislike");

	dislike.forEach((dislike) => {
		dislike.addEventListener("click", () => {
			if (dislike.classList.contains("far")) {
				// If not solid, switch it to solid
				dislike.classList.remove("far");
				dislike.classList.add("fas");
			} else {
				// If solid, switch it to not solid
				dislike.classList.remove("fas");
				dislike.classList.add("far");
			}
		});
	});
}

function comments() {
	const icons = document.querySelectorAll(".comment-icon");
	const commentSections = document.querySelectorAll(".comments");

	icons.forEach((icon, index) => {
		icon.addEventListener("click", () => {
			// Toggle the visibility of the corresponding comment section
			if (
				commentSections[index].style.display === "none" ||
				commentSections[index].style.display === ""
			) {
				commentSections[index].style.display = "block";
			} else {
				commentSections[index].style.display = "none";
			}
		});
	});
}
