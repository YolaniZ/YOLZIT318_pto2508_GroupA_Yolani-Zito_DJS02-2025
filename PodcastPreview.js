/**
 * PodcastPreview is a reusable Web Component that renders a podcast card preview.
 * It accepts data via attributes or properties, uses Shadow DOM for encapsulation,
 * and dispatches a custom event when the card is selected.
 */
export class PodcastPreview extends HTMLElement {
  static get observedAttributes() {
    return ["cover", "title", "genres", "seasons", "updated", "podcast-id"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._cover = "";
    this._title = "Untitled Podcast";
    this._genres = [];
    this._seasons = 0;
    this._updated = "";
    this._podcastId = "";
    this._handleClick = this._handleClick.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.addEventListener("click", this._handleClick);
    this.shadowRoot.addEventListener("keydown", this._handleKeyDown);
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener("click", this._handleClick);
    this.shadowRoot.removeEventListener("keydown", this._handleKeyDown);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    switch (name) {
      case "cover":
        this.cover = newValue;
        break;
      case "title":
        this.title = newValue;
        break;
      case "genres":
        this.genres = newValue;
        break;
      case "seasons":
        this.seasons = Number(newValue) || 0;
        break;
      case "updated":
        this.updated = newValue;
        break;
      case "podcast-id":
        this.podcastId = newValue;
        break;
    }
  }

  get cover() {
    return this._cover;
  }

  set cover(value) {
    this._cover = value || "";
    this.render();
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value || "Untitled Podcast";
    this.render();
  }

  get genres() {
    return this._genres;
  }

  set genres(value) {
    if (Array.isArray(value)) {
      this._genres = value.map((item) => String(item).trim()).filter(Boolean);
    } else if (typeof value === "string") {
      this._genres = value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    } else {
      this._genres = [];
    }
    this.render();
  }

  get seasons() {
    return this._seasons;
  }

  set seasons(value) {
    const parsed = Number(value);
    this._seasons = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    this.render();
  }

  get updated() {
    return this._updated;
  }

  set updated(value) {
    this._updated = value || "";
    this.render();
  }

  get podcastId() {
    return this._podcastId;
  }

  set podcastId(value) {
    this._podcastId = value || "";
  }

  /**
   * Handle keyboard activation for accessibility.
   * @param {KeyboardEvent} event
   */
  _handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this._handleClick(event);
    }
  }

  /**
   * Dispatch a custom event for parent application interaction.
   * @param {Event} event
   */
  _handleClick(event) {
    const detail = {
      id: this.podcastId,
      title: this.title,
      cover: this.cover,
      genres: this.genres,
      seasons: this.seasons,
      updated: this.updated,
    };

    this.dispatchEvent(
      new CustomEvent("podcast-preview-selected", {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Convert the updated field to a readable date label.
   * @param {string | Date} dateValue
   * @returns {string}
   */
  formatUpdatedDate(dateValue) {
    const date = dateValue ? new Date(dateValue) : null;
    if (!date || Number.isNaN(date.getTime())) {
      return "Updated date unavailable";
    }

    const formattedDate = date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return `Updated ${formattedDate}`;
  }

  /**
   * Prevent HTML injection from string values.
   * @param {string} value
   * @returns {string}
   */
  static escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  render() {
    const genreChips = this.genres
      .map(
        (genre) => `
          <span class="genre-chip">${PodcastPreview.escapeHtml(genre)}</span>
        `
      )
      .join("");

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 360px;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #111827;
          cursor: pointer;
          outline: none;
        }

        .card {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 16px;
          padding: 18px;
          border-radius: 18px;
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
          transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
          align-items: stretch;
        }

        .card:hover,
        .card:focus-within {
          transform: translateY(-2px);
          border-color: rgba(59, 130, 246, 0.28);
          box-shadow: 0 24px 60px rgba(59, 130, 246, 0.12);
        }

        .cover {
          width: 100%;
          min-height: 152px;
          border-radius: 16px;
          object-fit: cover;
          aspect-ratio: 4 / 5;
          background: linear-gradient(135deg, #e2e8f0 0%, #f8fafc 100%);
        }

        .content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .title {
          margin: 0 0 12px;
          font-size: 1rem;
          line-height: 1.35;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .meta {
          display: grid;
          gap: 10px;
          margin-bottom: 16px;
        }

        .genres {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .genre-chip {
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(59, 130, 246, 0.12);
          color: #1e3a8a;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.01em;
        }

        .details {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 0.9rem;
          color: #475569;
        }

        .detail-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .detail-label {
          font-weight: 600;
          color: #0f172a;
        }

        .card:focus-within {
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.18);
        }

        .card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 18px;
          pointer-events: none;
        }

        .card-wrapper {
          position: relative;
        }

        @media (max-width: 640px) {
          .card {
            grid-template-columns: 1fr;
          }

          .cover {
            width: 100%;
            min-height: 220px;
          }
        }
      </style>

      <div class="card-wrapper">
        <article class="card" role="button" tabindex="0" aria-label="Open podcast preview for ${PodcastPreview.escapeHtml(this.title)}">
          <img class="cover" src="${PodcastPreview.escapeHtml(this.cover)}" alt="Podcast cover for ${PodcastPreview.escapeHtml(this.title)}" />
          <div class="content">
            <div>
              <h2 class="title">${PodcastPreview.escapeHtml(this.title)}</h2>
              <div class="meta">
                <div class="genres">${genreChips}</div>
              </div>
            </div>

            <div class="details">
              <span class="detail-item"><span class="detail-label">Seasons:</span> ${PodcastPreview.escapeHtml(String(this.seasons))}</span>
              <span class="detail-item"><span class="detail-label">${PodcastPreview.escapeHtml(this.formatUpdatedDate(this.updated))}</span></span>
            </div>
          </div>
        </article>
      </div>
    `;
  }
}

customElements.define("podcast-preview", PodcastPreview);
