const surveyForm = document.querySelector("main form");

if (surveyForm) {
    const responseMessage = surveyForm.querySelector("output");

    surveyForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const visitorName = new FormData(surveyForm).get("visitor-name");
        responseMessage.textContent = `Thanks, ${visitorName}. This preview response was not sent or saved.`;
    });
}
