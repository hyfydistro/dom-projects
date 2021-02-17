// =============
// Media Queries
// =============

const mainElement = document.querySelector("main");
const formTaskBtn = document.querySelector(".form-task__btn");
const h1Title = document.querySelector(".title");

// Re-Position h1 .title
const mq = window.matchMedia("(min-width: 600px)");

if (mq.matches) {
    // Move h1 .title element
    console.log("pass - is Large Screen");
    mainElement.insertAdjacentElement('afterbegin', h1Title);
}

function isLargeScreen() {
    if (window.innerWidth >= 600) {
        // Move h1 .title element
        console.log("pass - is Large Screen");
        mainElement.insertAdjacentElement('afterbegin', h1Title);

    } else {
        formTaskBtn.insertAdjacentElement('afterend', h1Title);
        console.log("pass - is Large Screen Flex");
    }
}

window.addEventListener("resize", isLargeScreen);
