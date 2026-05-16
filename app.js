import "./PodcastPreview.js";
import { podcasts, genres } from "./data.js";

const podcastGrid = document.getElementById("podcastGrid");
const modalOverlay = document.getElementById("podcastModal");
const modalTitle = document.getElementById("modalTitle");
const modalGenres = document.getElementById("modalGenres");
const modalSeasons = document.getElementById("modalSeasons");
const modalUpdated = document.getElementById("modalUpdated");
const modalClose = document.getElementById("modalClose");

const genreLookup = new Map(genres.map((genre) => [genre.id, genre.title]));

/**
 * Render the demo list of podcast previews.
 */
function renderPodcastList() {
  podcasts.forEach((podcast) => {
    const preview = document.createElement("podcast-preview");
    preview.setAttribute("podcast-id", podcast.id);
    preview.setAttribute("cover", podcast.image);
    preview.setAttribute("title", podcast.title);

    const genreNames = podcast.genres
      .map((genreId) => genreLookup.get(genreId))
      .filter(Boolean);

    preview.setAttribute("genres", genreNames.join(", "));
    preview.setAttribute("seasons", podcast.seasons);
    preview.setAttribute("updated", podcast.updated);

    podcastGrid.appendChild(preview);
  });
}

/**
 * Handle podcast preview selection by opening the modal with details.
 * @param {CustomEvent} event
 */
function handlePodcastSelected(event) {
  const { title, genres, seasons, updated } = event.detail;

  modalTitle.textContent = title;
  modalGenres.textContent = genres.length ? genres.join(" • ") : "No genres available";
  modalSeasons.textContent = `${seasons} season${seasons === 1 ? "" : "s"}`;
  modalUpdated.textContent = updated ? new Date(updated).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "Unknown date";

  modalOverlay.classList.add("open");
  modalOverlay.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modalOverlay.classList.remove("open");
  modalOverlay.setAttribute("aria-hidden", "true");
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

document.addEventListener("podcast-preview-selected", handlePodcastSelected);
renderPodcastList();
