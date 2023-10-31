// edit details popup in profile section 
document.addEventListener("DOMContentLoaded", function() {
    const showPopupButton = document.getElementById("edit-btn");
    const popupScreen = document.getElementById("popup-screen");
    const closeBtn = document.getElementById("close-btn");
    const saveBtn = document.getElementById("save-btn");

    showPopupButton.addEventListener("click", () => {
        popupScreen.classList.add("active");
    });

    closeBtn.addEventListener("click", () => {
        popupScreen.classList.remove("active");
    });

    saveBtn.addEventListener("click", () => {
        popupScreen.classList.remove("active");
    });
});



// Dropdown menus
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    const drop = dropdown.querySelector('.drop');
    const arrow = dropdown.querySelector('.arrow');
    const options = dropdown.querySelector('.options');
    const optionList = dropdown.querySelectorAll('.options li');
    const selected = dropdown.querySelector('.selected');

    dropdown.addEventListener('click', () => {
        drop.classList.toggle('drop-clicked');
        arrow.classList.toggle('arrow-rotate');
        options.classList.toggle('options-open');

        // Set opacity to 1 when options are open
        if (options.classList.contains('options-open')) {
            options.style.opacity = 1;
        } else {
            options.style.opacity = 0;
        }
    });

    optionList.forEach(option => {
        option.addEventListener('click', () => {
            selected.innerText = option.innerText;
            drop.classList.remove('drop-clicked');
            arrow.classList.remove('arrow-rotate');
            options.classList.remove('options-open');
            options.style.opacity = 0; // Set opacity back to 0
            optionList.forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
        });
    });
});
