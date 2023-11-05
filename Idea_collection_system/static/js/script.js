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
	const like = document.getElementById("like");

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
}

function dislike() {
	const dislike = document.getElementById("dislike");

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
}

function comments() {
	const icon = document.getElementById("commenticon");

	const comments = document.getElementById("comments");

	icon.addEventListener("click", () => {
		// Toggle the visibility of the div
		if (comments.style.display === "none") {
			comments.style.display = "block";
		} else {
			comments.style.display = "none";
		}
	});
}
