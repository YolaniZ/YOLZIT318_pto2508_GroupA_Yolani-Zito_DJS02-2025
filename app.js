import "./PodcastPreview.js";
import { podcasts, genres, seasons } from "./data.js";

const podcastGrid = document.getElementById("podcastGrid");
const modalOverlay = document.getElementById("podcastModal");
const modalTitle = document.getElementById("modalTitle");
const modalCover = document.getElementById("modalCover");
const modalDescription = document.getElementById("modalDescription");
const modalGenreList = document.getElementById("modalGenreList");
const modalUpdated = document.getElementById("modalUpdated");
const modalSeasonsList = document.getElementById("modalSeasonsList");
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
    preview.setAttribute("description", podcast.description);

    podcastGrid.appendChild(preview);
  });
}

/**
 * Handle podcast preview selection by opening the modal with details.
 * @param {CustomEvent} event
 */
function createGenreChips(genres) {
  modalGenreList.innerHTML = "";
  if (!genres || !genres.length) {
    modalGenreList.textContent = "No genres available";
    return;
  }

  genres.forEach((genre) => {
    const chip = document.createElement("span");
    chip.className = "genre-chip";
    chip.textContent = genre;
    modalGenreList.appendChild(chip);
  });
}

function renderSeasonList(podcastId) {
  modalSeasonsList.innerHTML = "";
  const podcastSeasons = seasons.find((item) => item.id === podcastId);

  if (!podcastSeasons || !podcastSeasons.seasonDetails.length) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "season-empty";
    emptyMessage.textContent = "Season details are unavailable for this show.";
    modalSeasonsList.appendChild(emptyMessage);
    return;
  }

  podcastSeasons.seasonDetails.forEach((season) => {
    const seasonItem = document.createElement("div");
    seasonItem.className = "season-item";

    const seasonTitle = document.createElement("h4");
    seasonTitle.textContent = season.title;

    const seasonInfo = document.createElement("p");
    seasonInfo.textContent = `${season.episodes} episode${season.episodes === 1 ? "" : "s"}`;

    const rightLabel = document.createElement("span");
    rightLabel.className = "season-count";
    rightLabel.textContent = `${season.episodes} eps`;

    const leftGroup = document.createElement("div");
    leftGroup.appendChild(seasonTitle);
    leftGroup.appendChild(seasonInfo);

    seasonItem.appendChild(leftGroup);
    seasonItem.appendChild(rightLabel);
    modalSeasonsList.appendChild(seasonItem);
  });
}

function handlePodcastSelected(event) {
  const { id, title, cover, genres, updated, description } = event.detail;

  modalTitle.textContent = title;
  modalCover.src = cover;
  modalCover.alt = `Podcast cover for ${title}`;
  modalDescription.textContent = description || "No description available.";
  createGenreChips(genres);
  modalUpdated.textContent = updated
    ? `Last updated: ${new Date(updated).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`
    : "Last updated: Unknown date";
  renderSeasonList(id);

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
