const hobbySections = Array.from(document.querySelectorAll("main > section"));
const hobbyNavigation = document.querySelector('header nav[aria-label="Hobby sections"]');

function showHobbySection(sectionId) {
    const section = hobbySections.find((candidate) => candidate.id === sectionId)
        || hobbySections.find((candidate) => candidate.id === "what");

    hobbySections.forEach((candidate) => {
        candidate.hidden = candidate !== section;
    });
    hobbyNavigation.querySelectorAll("a").forEach((link) => {
        if (link.getAttribute("href") === `#${section.id}`) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
    document.title = `Night Trail Wildlife | ${section.querySelector("h2").textContent}`;
}

hobbyNavigation.addEventListener("click", (event) => {
    const link = event.target instanceof Element
        ? event.target.closest('a[href^="#"]')
        : null;

    if (!link) {
        return;
    }

    event.preventDefault();
    const sectionId = link.getAttribute("href").slice(1);
    showHobbySection(sectionId);

    if (window.location.hash !== `#${sectionId}`) {
        window.location.hash = sectionId;
    }
});

window.addEventListener("hashchange", () => {
    showHobbySection(window.location.hash.slice(1));
});

showHobbySection(window.location.hash.slice(1) || "what");
