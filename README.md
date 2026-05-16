# DJS02 – Web Component: Podcast Preview

## Overview

In this project, you will build a reusable and encapsulated **custom HTML element** that displays a podcast preview. The component must follow the **Web Component standard**, using `customElements.define()` and should work independently from the main application logic. This component will enhance modularity, promote reuse, and reduce code duplication across the app.

The component should be designed to **accept podcast data via attributes or properties**, display relevant UI elements (such as title, cover image, and genres), and **communicate with the main application** through custom events.

---

## Core Objectives

### Web Component Functionality

- Create a **custom HTML element** using `customElements.define()`.
- Accept data (cover image, title, genres, number of seasons, and last updated date) **as attributes or properties**.
- Keep the component **stateless** and reliant on external data provided by the parent.
- Use **Shadow DOM** for style and logic encapsulation to avoid global conflicts.
- Trigger a **custom event** when a user interacts with the component (e.g., clicking), so that the parent application can open a modal or take other actions without tightly coupling to the component’s logic.

---

## UI/UX Requirements

- The component should render a clean and **visually consistent preview** of each podcast.
- Display:
  - Podcast **cover image**
  - Podcast **title**
  - **Genre names**
  - **Number of seasons**
  - **Last updated** in a human-readable format
- The component must be **responsive**, and match the overall app design on desktop and mobile.
- On click, the component must notify the parent app to **open a modal** or navigate to details.

---

## Code Quality & Maintainability

- Write clear, consistent, and modular code.
- Follow **functional and object-oriented programming** patterns.
- Document major functions using **JSDoc comments** (parameters, return types, etc.).
- Use consistent **code formatting** across HTML, CSS, and JavaScript.

---

## Technical Constraints

- Do **not** use any third-party frameworks for creating the web component.
- Use **native JavaScript (ES6+)**, HTML, and CSS.
- No page reloads or navigation.
- Ensure compatibility with modern browsers.

---

## Deliverables

- A working custom Web Component file (e.g., `PodcastPreview.js`).
- An HTML demo page showcasing the component usage.
- A `README.md` file with:
  - How to use and register the component
  - Instructions for passing data
  - How to listen for interaction events

---
## Usage

### Files added

- `PodcastPreview.js` — the reusable Web Component definition.
- `index.html` — demo page showing the component in action.
- `app.js` — lightweight page logic that creates preview cards and listens for custom events.

### Registering the component

The component registers itself automatically when `PodcastPreview.js` is imported:

```js
import "./PodcastPreview.js";
```

### Passing podcast data

You can pass data into the component with attributes:

```html
<podcast-preview
  podcast-id="10716"
  cover="https://example.com/podcast-cover.jpg"
  title="Something Was Wrong"
  genres="Investigative Journalism, True Crime"
  seasons="14"
  updated="2022-11-03T07:00:00.000Z"
></podcast-preview>
```

Or by setting properties in JavaScript:

```js
const preview = document.createElement("podcast-preview");
preview.cover = "https://example.com/podcast-cover.jpg";
preview.title = "Something Was Wrong";
preview.genres = ["Investigative Journalism", "True Crime"];
preview.seasons = 14;
preview.updated = "2022-11-03T07:00:00.000Z";
document.body.appendChild(preview);
```

### Listening for interaction events

When a user clicks a podcast card, the component emits a custom event named `podcast-preview-selected`.
The event bubbles and is composed, so parent logic can listen outside the component:

```js
document.addEventListener("podcast-preview-selected", (event) => {
  const { title, genres, seasons, updated } = event.detail;
  console.log("Selected podcast:", title, genres, seasons, updated);
});
```

### Notes

- The component uses Shadow DOM for encapsulated styles and layout.
- It is stateless and relies on parent-supplied data.
- The demo layout is responsive and supports desktop and mobile.

