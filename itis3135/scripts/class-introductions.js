const roster = document.getElementById("intro-roster");
const statusMessage = document.getElementById("intro-status");
const countMessage = document.getElementById("intro-count");
const searchInput = document.getElementById("intro-search");

function getText(value) {
    return typeof value === "string" ? value.trim() : "";
}

function getIntroductionName(username, data) {
    const firstName = getText(data.firstName);
    const middleName = getText(data.middleName);
    const lastName = getText(data.lastName);
    const nickname = getText(data.nickname);
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ");

    if (fullName && nickname) {
        return `${fullName} (${nickname})`;
    }
    return fullName || nickname || username;
}

function getSearchText(username, record) {
    const data = record.introductionData;
    return [
        getIntroductionName(username, data),
        getText(data.adjectives) || getText(data.adjective),
        getText(data.animal)
    ].join(" ").toLocaleLowerCase();
}

function createIntroductionCard(username, record) {
    const data = record.introductionData;
    const personalInfo = data.personalInfo && typeof data.personalInfo === "object"
        ? data.personalInfo
        : {};
    const name = getIntroductionName(username, data);
    const adjective = getText(data.adjectives) || getText(data.adjective);
    const animal = getText(data.animal);
    const quote = getText(data.quote);
    const quoteAuthor = getText(data.quoteAuthor);
    const statement = getText(personalInfo.statement) || getText(data.personalStatement);
    const card = document.createElement("article");
    const heading = document.createElement("h3");
    const mascot = document.createElement("p");
    const imageSource = getText(data.img);

    card.className = "intro-card";
    heading.textContent = name;
    card.append(heading);

    if (imageSource.startsWith("data:image/")) {
        const image = document.createElement("img");
        image.className = "intro-card-image";
        image.src = imageSource;
        image.alt = getText(data.pictureAlt) || getText(data.caption) || `${name}'s introduction photo`;
        image.loading = "lazy";
        card.append(image);
    }

    if (adjective || animal) {
        mascot.className = "intro-mascot";
        mascot.textContent = [adjective, animal].filter(Boolean).join(" ");
        card.append(mascot);
    }
    if (statement) {
        const statementParagraph = document.createElement("p");
        statementParagraph.textContent = statement;
        card.append(statementParagraph);
    }
    if (quote) {
        const quoteElement = document.createElement("blockquote");
        const quoteText = document.createElement("p");
        quoteText.textContent = quote;
        quoteElement.append(quoteText);
        if (quoteAuthor) {
            const citation = document.createElement("cite");
            citation.textContent = quoteAuthor;
            quoteElement.append(citation);
        }
        card.append(quoteElement);
    }

    const courses = Array.isArray(data.courses) ? data.courses : [];
    if (courses.length > 0) {
        const courseList = document.createElement("ul");
        courseList.className = "intro-courses";
        courses.forEach((course) => {
            if (!course || typeof course !== "object") {
                return;
            }
            const courseName = [
                getText(course.department),
                getText(course.courseNumber) || getText(course.number),
                getText(course.courseTitle) || getText(course.name)
            ].filter(Boolean).join(" ");
            if (courseName) {
                const item = document.createElement("li");
                item.textContent = courseName;
                courseList.append(item);
            }
        });
        if (courseList.childElementCount > 0) {
            const coursesHeading = document.createElement("h4");
            coursesHeading.textContent = "Taking";
            card.append(coursesHeading, courseList);
        }
    }

    const timestamp = getText(record.lastUpdated);
    if (timestamp) {
        const date = new Date(timestamp);
        if (!Number.isNaN(date.getTime())) {
            const updated = document.createElement("time");
            updated.className = "intro-updated";
            updated.dateTime = timestamp;
            updated.textContent = `Updated ${new Intl.DateTimeFormat("en", {
                dateStyle: "medium"
            }).format(date)}`;
            card.append(updated);
        }
    }

    return card;
}

function renderIntroductions(entries) {
    roster.replaceChildren();
    entries.forEach(([username, record]) => {
        roster.append(createIntroductionCard(username, record));
    });
    countMessage.textContent = `${entries.length} ${entries.length === 1 ? "introduction" : "introductions"}`;
    countMessage.hidden = false;
    statusMessage.textContent = entries.length
        ? ""
        : "No introductions match your search.";
}

async function loadIntroductions() {
    try {
        const response = await fetch("https://intro-form.tommyhost.ing/");
        if (!response.ok) {
            throw new Error(`The introductions service returned ${response.status}.`);
        }

        const all = await response.json();
        if (!all || typeof all !== "object" || Array.isArray(all)) {
            throw new Error("The introductions service returned an unexpected response.");
        }

        const entries = Object.entries(all)
            .filter(([, record]) => record && record.introductionData
                && typeof record.introductionData === "object")
            .sort(([, first], [, second]) => getText(second.lastUpdated).localeCompare(getText(first.lastUpdated)));

        if (entries.length === 0) {
            statusMessage.textContent = "No class introductions are available yet.";
            return;
        }

        searchInput.addEventListener("input", () => {
            const query = searchInput.value.trim().toLocaleLowerCase();
            renderIntroductions(entries.filter(([username, record]) =>
                getSearchText(username, record).includes(query)
            ));
        });
        renderIntroductions(entries);
    } catch (error) {
        statusMessage.textContent = `Class introductions could not be loaded: ${error.message}`;
        countMessage.hidden = true;
    }
}

loadIntroductions();
