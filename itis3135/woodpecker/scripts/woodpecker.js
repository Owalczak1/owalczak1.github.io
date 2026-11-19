function setupTaskPrompt() {
    const section = document.querySelector("main section");
    if (!section) {
        return;
    }

    const prompt = section.querySelector("output");
    const button = section.querySelector('button[type="button"]');
    const examples = [
        "Rename a batch of lecture files the same way every week.",
        "Turn a repeated folder of downloads into a tidy list.",
        "Make a one-step shortcut for a task you do every class day.",
        "Convert a small set of notes into a consistent checklist."
    ];

    if (!prompt || !button) {
        return;
    }

    button.addEventListener("click", () => {
        const current = examples.indexOf(prompt.textContent);
        prompt.textContent = examples[(current + 1) % examples.length];
    });
}

function setupTaskFitCheck() {
    const form = document.querySelector('form[name="task-fit"]');
    if (!form) {
        return;
    }

    const result = form.querySelector("output");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const sameSteps = form.elements.namedItem("same-steps").value;
        const clearResult = form.elements.namedItem("clear-result").value;

        if (sameSteps === "yes" && clearResult === "yes") {
            result.textContent = "Good fit: we can explore one small, testable automation.";
        } else {
            result.textContent = "It may need a narrower starting point. Choose one repeatable step with a clear result.";
        }
    });
}

function setupSavingsEstimator() {
    const form = document.querySelector('form[name="savings-estimator"]');
    if (!form) {
        return;
    }

    const result = form.querySelector("output");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.reportValidity()) {
            return;
        }

        const minutes = Number(form.elements.namedItem("task-minutes").value);
        const repeats = Number(form.elements.namedItem("weekly-repeats").value);
        const weeklyMinutes = minutes * repeats;
        result.textContent = `If an automation removed this task, it could save about ${weeklyMinutes} minutes (${(weeklyMinutes / 60).toFixed(1)} hours) each week.`;
    });
}

setupTaskPrompt();
setupTaskFitCheck();
setupSavingsEstimator();
