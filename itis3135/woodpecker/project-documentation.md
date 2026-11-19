# Woodpecker Project Documentation

## Project concept

Woodpecker is a fictional pop-up booth that helps someone turn one repetitive computer task into a small script, shortcut, or mini-tool. The concept is intentionally narrow: visitors bring a task with repeatable steps and a clear outcome, then receive a simple, testable solution and handoff.

The site presents seven facets of the concept: Home, About, Services, Hours, Location, Why, and How. The proposed schedule and locations are clearly identified as fictional rather than actual business commitments.

## How the site meets the specifications

- The home page is `index.html`; six additional pages cover the business's other facets.
- Every page uses the shared header and footer loaded from `components/`, with a consistent navigation menu linking the seven pages.
- Every page includes at least two paragraphs and an illustrative image with descriptive alternative text.
- The home page uses semantic header, main, and footer components, along with a page-specific ID and class.
- The business site has a separate visual design, responsive layout, and consistent typography, colors, tagline, and mascot imagery.
- The footer identifies the designer and labels the business as a fictional course project. It does not include unrelated course-profile links.
- The project uses HTML, CSS, and JavaScript. The three interactive features are described below.

## Stakeholders and needs

- **People with repetitive digital tasks:** need a quick way to decide whether their task is suitable, understand what solution types are available, and estimate the time it might consume.
- **Visitors considering a pop-up:** need clear information about the proposed schedule, location, process, and service boundaries so they can decide what to expect. The pages distinguish concept details from real commitments.
- **People receiving a tool handoff:** need a solution that is understandable, testable, and limited to the agreed task. The How page describes testing with sample information and explaining operation and undo steps.
- **Course reviewers:** need to verify the required pages, shared components, responsive presentation, validation, and interactive behavior without mistaking the concept for a live business.

## Dynamic functionality

1. **Home - task idea suggestions:** the button cycles through examples of small, repetitive computer tasks.
2. **About - task-fit check:** visitors select whether a task has repeatable steps and a clear result; the page returns guidance based on those answers.
3. **Services - weekly time estimator:** visitors enter minutes per run and runs per week; the page calculates the estimated weekly time spent on the task.

## Peer review and revisions

Peer feedback has not been received yet. No critiques or resulting revisions are claimed here. Update this section with the actual feedback and the changes made after peer review.

## AI tools and process

GitHub Copilot in VS Code was used to help plan and implement the concept, page content, shared HTML components, responsive CSS, and the three JavaScript interactions. The implementation was then reviewed and tested in the browser, including exercising each interaction and running the course standards checker. The supplied mascot SVG illustrations were incorporated into the site. AI assistance was used as a drafting and iteration aid; the final project was checked against the assignment requirements and the running site.

## Class idea-list status

The course idea-list wiki was not accessible during this work. The concept has not been confirmed against classmates' ideas, and this document does not claim that it was added to the wiki.
