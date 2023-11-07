let jwt_key = localStorage.getItem("jwtToken");
let refreshToken = localStorage.getItem("refreshToken");
let username = localStorage.getItem("username");

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
                        <p>${ideas[i]?.username}</p>
                    </div>
                    <div class="tag">
                        <p>Category:</p>
                        <p class="category">${ideas[i]?.category_name}</p>
                    </div>
                </div>
                <div class="content">
					<h2>${ideas[i]?.idea_title}</h2>
					<br>
                    <p>${ideas[i]?.idea_body}</p>
                    <div class="docs">
                        <div class="name">
                            <i class="fas fa-file"></i>
                            <p>Document name-1</p>
                        </div>
                        <a href=""><i class="fas fa-cloud-download-alt"></i></a>
                    </div>
                </div>


                <div class="reactions">
                    <div class="react">
                        <div class="feedback likes">
                            <i class="like like far fa-thumbs-up" id="like" onclick="like()"></i>
                            <p>0</p>
                        </div>
                        <div class="feedback dislikes">
                            <i class="dislike far fa-thumbs-down" id="dislike" onclick="dislike()"></i>
                            <p>0</p>
                        </div>
                        <div class="feedback comment-icon">
                            <a href='/comments.html?idea_id=${ideas[i]?.idea_id}' target='_blank'>
								<i class="comment far fa-comment" id="commenticon"></i>
							</a>
                            <p>2</p>
                        </div>
                    </div>
                    <div class="report">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                `;
		}
	}
};

const main = async () => {
	let ideas = await fetchAllIdeas();
	populateDomWithIdeas(ideas);
};

main();
