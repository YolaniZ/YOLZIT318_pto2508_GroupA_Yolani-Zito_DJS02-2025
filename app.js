import "./PodcastPreview.js";
import { podcasts, genres } from "./data.js";

const podcastGrid = document.getElementById("podcastGrid");
const modalOverlay = document.getElementById("podcastModal");
const modalTitle = document.getElementById("modalTitle");
const modalGenres = document.getElementById("modalGenres");
const modalSeasons = document.getElementById("modalSeasons");
const modalUpdated = document.getElementById("modalUpdated");
const modalClose = document.getElementById("modalClose");
const genreFilter = document.getElementById("genreFilter");
const sortFilter = document.getElementById("sortFilter");

const genreLookup = new Map(genres.map((genre) => [genre.id, genre.title]));
let filteredPodcasts = [...podcasts];

/**
 * Populate the genre filter dropdown.
 */
function populateGenreFilter() {
  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.id;
    option.textContent = genre.title;
    genreFilter.appendChild(option);
  });
}

/**
 * Filter podcasts by genre and sort them.
 */
function applyFiltersAndSort() {
  let result = [...podcasts];

  const selectedGenre = genreFilter.value;
  if (selectedGenre) {
    result = result.filter((podcast) =>
      podcast.genres.includes(Number(selectedGenre))
    );
  }

  const sortBy = sortFilter.value;
  switch (sortBy) {
    case "oldest":
      result.sort((a, b) => new Date(a.updated) - new Date(b.updated));
      break;
    case "most-seasons":
      result.sort((a, b) => b.seasons - a.seasons);
      break;
    case "title-az":
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "recently-updated":
    default:
      result.sort((a, b) => new Date(b.updated) - new Date(a.updated));
      break;
  }

  filteredPodcasts = result;
  renderPodcastList();
}

/**
 * Render the demo list of podcast previews.
 */
function renderPodcastList() {
  podcastGrid.innerHTML = "";
  filteredPodcasts.forEach((podcast) => {
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

genreFilter.addEventListener("change", applyFiltersAndSort);
sortFilter.addEventListener("change", applyFiltersAndSort);
document.addEventListener("podcast-preview-selected", handlePodcastSelected);

populateGenreFilter();
renderPodcastList();
