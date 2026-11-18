const form = document.getElementById("introduction-form");

if (form) {
    const formSection = document.getElementById("introduction-form-section");
    const resultSection = document.getElementById("introduction-result");
    const introductionBody = document.getElementById("introduction-body");
    const acknowledgmentDate = document.getElementById("acknowledgment-date");
    const generatedOutputSection = document.getElementById("generated-output-section");
    const generatedOutput = document.getElementById("generated-output");
    const courseList = document.getElementById("course-list");
    const courseMessage = document.getElementById("course-message");
    const formError = document.getElementById("form-error");
    const defaultCourseRows = Array.from(courseList.querySelectorAll(".course-entry"))
        .map((course) => course.cloneNode(true));
    let nextCourseNumber = defaultCourseRows.length + 1;
    let uploadedImageUrl = "";
    let uploadedImageFile = null;

    function addLabeledControl(parent, labelText, name, courseNumber, type) {
        const label = document.createElement("label");
        const id = `course-${courseNumber}-${name}`;
        const control = type === "textarea"
            ? document.createElement("textarea")
            : document.createElement("input");

        control.id = id;
        control.name = `course-${name}`;
        control.placeholder = labelText;
        control.required = true;
        if (type !== "textarea") {
            control.type = "text";
        }

        label.htmlFor = id;
        label.append(document.createTextNode(labelText), control);
        parent.append(label);
    }

    function createCourseRow(courseNumber) {
        const course = document.createElement("fieldset");
        const legend = document.createElement("legend");
        const removeButton = document.createElement("button");

        course.className = "course-entry";
        legend.textContent = `Course ${courseNumber}`;
        course.append(legend);
        addLabeledControl(course, "Department", "department", courseNumber, "text");
        addLabeledControl(course, "Number", "number", courseNumber, "text");
        addLabeledControl(course, "Name", "name", courseNumber, "text");
        addLabeledControl(course, "Reason", "reason", courseNumber, "textarea");
        removeButton.className = "remove-course";
        removeButton.type = "button";
        removeButton.textContent = "Remove course";
        course.append(removeButton);
        return course;
    }

    function restoreDefaultCourses() {
        courseList.replaceChildren(...defaultCourseRows.map((course) => course.cloneNode(true)));
        nextCourseNumber = defaultCourseRows.length + 1;
        courseMessage.textContent = "";
    }

    function clearGeneratedOutput() {
        generatedOutput.value = "";
        generatedOutputSection.hidden = true;
    }

    function resetProgress() {
        form.reset();
        restoreDefaultCourses();
        formError.textContent = "";
        form.querySelectorAll('input[type="url"]').forEach((input) => input.setCustomValidity(""));
        introductionBody.replaceChildren();
        acknowledgmentDate.setCustomValidity("");
        clearGeneratedOutput();
        resultSection.hidden = true;
        formSection.hidden = false;
        if (uploadedImageUrl) {
            URL.revokeObjectURL(uploadedImageUrl);
            uploadedImageUrl = "";
            uploadedImageFile = null;
        }
    }

    function getValue(name) {
        return form.elements.namedItem(name).value.trim();
    }

    function addLabeledParagraph(parent, labelText, value) {
        const paragraph = document.createElement("p");
        const label = document.createElement("strong");
        label.textContent = `${labelText}:`;
        paragraph.append(label, document.createTextNode(` ${value}`));
        parent.append(paragraph);
    }

    function getFullName() {
        const firstName = getValue("first-name");
        const middleName = getValue("middle-name");
        const preferredName = getValue("preferred-name");
        const lastName = getValue("last-name");
        const name = [firstName, middleName].filter(Boolean).join(" ");
        return `${name}${preferredName ? ` '${preferredName}'` : ""} ${lastName}`.trim();
    }

    function formatDate(value) {
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }

    function getCourses() {
        return Array.from(courseList.querySelectorAll(".course-entry")).map((course) => ({
            department: course.querySelector('[name="course-department"]').value.trim(),
            number: course.querySelector('[name="course-number"]').value.trim(),
            name: course.querySelector('[name="course-name"]').value.trim(),
            reason: course.querySelector('[name="course-reason"]').value.trim()
        }));
    }

    function getUploadedImageUrl(uploadedPicture) {
        if (!uploadedPicture) {
            if (uploadedImageUrl) {
                URL.revokeObjectURL(uploadedImageUrl);
                uploadedImageUrl = "";
                uploadedImageFile = null;
            }
            return "";
        }
        if (uploadedPicture !== uploadedImageFile) {
            if (uploadedImageUrl) {
                URL.revokeObjectURL(uploadedImageUrl);
            }
            uploadedImageFile = uploadedPicture;
            uploadedImageUrl = URL.createObjectURL(uploadedPicture);
        }
        return uploadedImageUrl;
    }

    function buildIntroduction() {
        const name = getFullName();
        const uploadedPicture = form.elements.namedItem("picture-upload").files[0];
        const uploadedPictureUrl = getUploadedImageUrl(uploadedPicture);
        const pictureSource = getValue("picture-source") || "images/srcimg.png";
        const pictureCaption = getValue("picture-caption");
        const courses = getCourses();
        const introduction = document.createDocumentFragment();
        const heading = document.createElement("h5");
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const caption = document.createElement("figcaption");
        const nameParagraph = document.createElement("p");
        const courseHeadingLabel = document.createElement("strong");
        const courseListElement = document.createElement("ol");
        const quote = document.createElement("blockquote");
        const quoteText = document.createElement("p");
        const quoteAuthor = document.createElement("cite");
        const bulletList = document.createElement("ul");
        const links = document.createElement("nav");
        const linksData = [
            ["CLT Web", "link-clt"],
            ["GitHub.io", "link-githubio"],
            ["GitHub", "link-github"],
            ["freeCodeCamp", "link-freecodecamp"],
            ["Codecademy", "link-codecademy"],
            ["LinkedIn", "link-linkedin"]
        ];

        heading.textContent = `${name} ${getValue("divider")} ${getValue("mascot-adjective")} ${getValue("mascot-animal")}`;
        figure.append(image, caption);
        figure.className = "intro-figure";
        image.className = "intro-image";
        image.src = pictureSource;
        if (uploadedPictureUrl) {
            image.src = uploadedPictureUrl;
        }
        image.alt = pictureCaption;
        caption.textContent = pictureCaption;

        nameParagraph.textContent = `My name is ${name}. ${getValue("personal-statement")}`;
        courseHeadingLabel.textContent = "Courses I'm Taking, & Why:";

        courses.forEach((course) => {
            const item = document.createElement("li");
            const courseName = document.createElement("strong");
            const currentCourse = course.department.toUpperCase() === "ITIS" && course.number === "3135";
            courseName.append(document.createTextNode(`${course.department} ${course.number} `));
            if (currentCourse) {
                const courseLink = document.createElement("a");
                courseLink.href = "contract.html";
                courseLink.textContent = course.name;
                courseName.append(courseLink);
            } else {
                courseName.append(document.createTextNode(course.name));
            }
            courseName.append(document.createTextNode(":"));
            item.append(courseName, document.createTextNode(` ${course.reason}`));
            courseListElement.append(item);
        });

        quoteText.textContent = getValue("quote");
        quoteAuthor.textContent = `- ${getValue("quote-author")}`;
        quote.append(quoteText, quoteAuthor);

        links.className = "introduction-links";
        links.setAttribute("aria-label", "Personal links");
        linksData.forEach(([label, fieldName], index) => {
            const link = document.createElement("a");
            link.href = getValue(fieldName);
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = label;
            links.append(link);
            if (index < linksData.length - 1) {
                links.append(document.createTextNode(" | "));
            }
        });

        introduction.append(
            heading,
            figure,
            nameParagraph
        );
        [
            ["Personal Background", "personal-background"],
            ["Professional Background", "professional-background"],
            ["Academic Background", "academic-background"],
            ["Primary Work Computer (type, OS, and version)", "work-computer"],
            ["Primary Work Location", "work-location"],
            ["Alternate Computer & Location", "alternate-computer"]
        ].forEach(([label, fieldName]) => {
            const item = document.createElement("li");
            const labelElement = document.createElement("strong");
            labelElement.textContent = `${label}:`;
            item.append(labelElement, document.createTextNode(` ${getValue(fieldName)}`));
            bulletList.append(item);
        });
        const coursesItem = document.createElement("li");
        coursesItem.append(courseHeadingLabel, courseListElement);
        bulletList.append(coursesItem);
        introduction.append(bulletList, quote);
        addLabeledParagraph(introduction, "Acknowledgment Statement", getValue("acknowledgment"));
        addLabeledParagraph(introduction, "Acknowledgment Date", formatDate(getValue("acknowledgment-date")));

        const funnyThing = getValue("funny-thing");
        const somethingToShare = getValue("share");
        if (funnyThing) {
            addLabeledParagraph(introduction, "Funny thing", funnyThing);
        }
        if (somethingToShare) {
            addLabeledParagraph(introduction, "Something I would like to share", somethingToShare);
        }
        introduction.append(links);

        return introduction;
    }

    function getIntroductionData() {
        const data = {};
        Array.from(form.elements).forEach((control) => {
            if (control.name && control.type !== "file" && !control.name.startsWith("course-")) {
                data[control.name] = control.value.trim();
            }
        });
        const uploadedPicture = form.elements.namedItem("picture-upload").files[0];
        data.picture = uploadedPicture
            ? uploadedPicture.name
            : getValue("picture-source") || "images/srcimg.png";
        data.courses = getCourses();
        data.links = [
            ["CLT Web", "link-clt"],
            ["GitHub.io", "link-githubio"],
            ["GitHub", "link-github"],
            ["freeCodeCamp", "link-freecodecamp"],
            ["Codecademy", "link-codecademy"],
            ["LinkedIn", "link-linkedin"]
        ].map(([label, fieldName]) => ({ label, url: getValue(fieldName) }));
        return data;
    }

    function escapeXml(value) {
        return String(value).replace(/[<>&'"]/g, (character) => ({
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
            "'": "&apos;",
            '"': "&quot;"
        })[character]);
    }

    function generateXml(data) {
        const fields = Object.entries(data).map(([name, value]) => {
            if (name === "courses") {
                const courses = value.map((course) => {
                    const courseFields = Object.entries(course)
                        .map(([field, content]) => `      <${field}>${escapeXml(content)}</${field}>`)
                        .join("\n");
                    return `    <course>\n${courseFields}\n    </course>`;
                }).join("\n");
                return `  <courses>\n${courses}\n  </courses>`;
            }
            if (name === "links") {
                const links = value.map((link) => `    <link label="${escapeXml(link.label)}">${escapeXml(link.url)}</link>`)
                    .join("\n");
                return `  <links>\n${links}\n  </links>`;
            }
            return `  <${name}>${escapeXml(value)}</${name}>`;
        }).join("\n");
        return `<introduction>\n${fields}\n</introduction>`;
    }

    function showGeneratedOutput(content) {
        generatedOutput.value = content;
        generatedOutputSection.hidden = false;
    }

    function validateAcknowledgmentDate() {
        const value = acknowledgmentDate.value;
        const date = new Date(`${value}T00:00:00Z`);
        const isValidDate = value
            && !Number.isNaN(date.getTime())
            && date.toISOString().slice(0, 10) === value;

        acknowledgmentDate.setCustomValidity(
            value && !isValidDate ? "Enter a valid date in YYYY-MM-DD format." : ""
        );
    }

    function generateHtml() {
        const wrapper = document.createElement("div");
        wrapper.append(buildIntroduction());
        return Array.from(wrapper.children)
            .map((element) => element.outerHTML)
            .join("\n");
    }

    document.getElementById("generate-html").addEventListener("click", () => {
        showGeneratedOutput(generateHtml());
    });

    document.getElementById("generate-json").addEventListener("click", () => {
        showGeneratedOutput(JSON.stringify(getIntroductionData(), null, 2));
    });

    document.getElementById("generate-xml").addEventListener("click", () => {
        showGeneratedOutput(generateXml(getIntroductionData()));
    });

    document.getElementById("reset-introduction").addEventListener("click", (event) => {
        event.preventDefault();
        resetProgress();
    });

    document.getElementById("add-course").addEventListener("click", () => {
        const course = createCourseRow(nextCourseNumber);
        courseList.append(course);
        nextCourseNumber += 1;
        course.querySelector("input").focus();
        courseMessage.textContent = "";
    });

    courseList.addEventListener("click", (event) => {
        const removeButton = event.target.closest(".remove-course");
        if (!removeButton) {
            return;
        }
        removeButton.closest(".course-entry").remove();
        courseMessage.textContent = courseList.querySelector(".course-entry")
            ? ""
            : "Add at least one course before submitting.";
    });

    document.getElementById("clear-form").addEventListener("click", () => {
        form.querySelectorAll("input, textarea").forEach((input) => {
            input.value = "";
            input.setCustomValidity("");
        });
        formError.textContent = "";
        courseMessage.textContent = "";
        clearGeneratedOutput();
    });

    form.querySelector('button[type="reset"]').addEventListener("click", () => {
        window.setTimeout(() => {
            restoreDefaultCourses();
            formError.textContent = "";
            acknowledgmentDate.setCustomValidity("");
            form.querySelectorAll('input[type="url"]').forEach((input) => input.setCustomValidity(""));
            clearGeneratedOutput();
        }, 0);
    });

    acknowledgmentDate.addEventListener("input", () => acknowledgmentDate.setCustomValidity(""));
    form.addEventListener("input", clearGeneratedOutput);
    form.addEventListener("change", clearGeneratedOutput);

    form.querySelectorAll('input[type="url"]').forEach((input) => {
        input.addEventListener("input", () => input.setCustomValidity(""));
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        formError.textContent = "";
        courseMessage.textContent = "";

        form.querySelectorAll('input[type="url"]').forEach((input) => {
            const url = input.value.trim().toLowerCase();
            input.setCustomValidity(
                url.startsWith("http://") || url.startsWith("https://")
                    ? ""
                    : "Enter a link that starts with http:// or https://."
            );
        });

        validateAcknowledgmentDate();
        if (!form.reportValidity()) {
            return;
        }
        if (courseList.querySelectorAll(".course-entry").length === 0) {
            courseMessage.textContent = "Add at least one course before submitting.";
            document.getElementById("add-course").focus();
            return;
        }

        const uploadedPicture = form.elements.namedItem("picture-upload").files[0];
        if (uploadedPicture && !uploadedPicture.type.startsWith("image/")) {
            formError.textContent = "Choose an image file for the introduction picture.";
            form.elements.namedItem("picture-upload").focus();
            return;
        }

        introductionBody.replaceChildren(buildIntroduction());
        formSection.hidden = true;
        resultSection.hidden = false;
    });
}
