# DJS02 – Web Component: Podcast Preview

## Overview

This project implements a reusable **Web Component** named `<podcast-preview>` that renders a podcast preview card using native browser APIs.

The component is stateless and accepts podcast data from the parent application either through attributes or by setting properties. It uses **Shadow DOM** for style encapsulation and dispatches a custom interaction event when the card is selected.

---

## Project Structure

- `PodcastPreview.js` — Web Component definition and rendering logic.
- `index.html` — demo page that loads the component and the app logic.
- `app.js` — app logic that creates preview cards from `data.js`, handles filtering/sorting, and opens a modal on selection.
- `data.js` — sample podcast data, genre lookup, and season details.
- `styles.css` — shared styles for the demo page and modal UI.

---

## Component Features

- Accepts podcast data by attribute or property
- Renders cover image, title, genres, season count, and last update date
- Supports keyboard activation for accessibility (Enter / Space)
- Uses Shadow DOM for encapsulated styling
- Dispatches a custom event when selected

---

## Usage

### Register the component

Import the component module in your page or app entry point:

```js
import "./PodcastPreview.js";
```

### Pass data via attributes

```html
<podcast-preview
  podcast-id="10716"
  cover="https://example.com/podcast-cover.jpg"
  title="Something Was Wrong"
  genres="Investigative Journalism, True Crime"
  seasons="14"
  updated="2022-11-03T07:00:00.000Z"
  description="A powerful true-crime docuseries about discovery and recovery."
></podcast-preview>
```

### Pass data via properties

```js
const preview = document.createElement("podcast-preview");
preview.podcastId = "10716";
preview.cover = "https://podcast-cover.jpg";
preview.title = "Something Was Wrong";
preview.genres = ["Investigative Journalism", "True Crime"];
preview.seasons = 14;
preview.updated = "2022-11-03T07:00:00.000Z";
preview.description = "A powerful true-crime docuseries about discovery and recovery.";
document.body.appendChild(preview);
```

### Supported attributes / properties

- `podcast-id` / `podcastId`
- `cover`
- `title`
- `genres` (comma-separated string or array)
- `seasons`
- `updated`
- `description`

---

## Interaction Event

The component emits a custom event named `podcast-preview-selected` when the card is clicked or activated via keyboard.

The event bubbles and is composed, so it can be handled outside the component:

```js
document.addEventListener("podcast-preview-selected", (event) => {
  const { id, title, cover, genres, seasons, updated, description } = event.detail;
  console.log("Selected podcast:", id, title, genres, seasons, updated, description);
});
```

---

## Demo App Behavior

In this project, `app.js`:

- imports `PodcastPreview.js`
- builds a list of `<podcast-preview>` cards from `data.js`
- filters and sorts podcasts by genre or update order
- listens for `podcast-preview-selected`
- opens a modal with details when a preview card is selected

---

## Notes

- The component is intentionally stateless: all display data comes from the parent.
- `genres` may be provided as a comma-separated string via attributes or as a JavaScript array via properties.
- The demo uses plain ES modules and modern browser APIs; no frameworks are required.

Done by: Yolani Zito