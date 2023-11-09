emailjs.init("user_uBwPjYzKVYr2jLKE17pNV");

document.getElementById("send-email-btn").addEventListener("click", () => {
	let templateParams = {
		to_name: "UOG IDEA COLLECTION SYSTEM ADMIN",
		from_name: document.getElementById("contact-name").value,
		from_email: document.getElementById("contact-email").value,
		message: document.getElementById("contact-message").value,
	};

	emailjs
		.send(
			"service_7pn4oid",
			"template_ngrluml",
			templateParams,
			"user_uBwPjYzKVYr2jLKE17pNV",
		)
		.then(
			function (response) {
				console.log(response);
				Swal.fire({
					title: "Success!",
					text: "Your message was recieved !",
					icon: "success",
					confirmButtonText: "Ok",
				});
			},
			function (error) {
				console.error(error);
				Swal.fire({
					title: "Error!",
					text: "Unknown error occured",
					icon: "error",
					confirmButtonText: "Ok",
				});
			},
		);
});
