const staff_btn = document.getElementById('staff-btn');
const coordinator_btn = document.getElementById('coordinator-btn')
const manager_btn = document.getElementById("manager-btn");

staff_btn.addEventListener('click', () => {
    window.location.href = "/signup/staff.html"
})

coordinator_btn.addEventListener("click", () => {
	window.location.href = "/signup/qa_coordinator.html";
});

manager_btn.addEventListener("click", () => {
	window.location.href = "/signup/qa_manager.html";
});