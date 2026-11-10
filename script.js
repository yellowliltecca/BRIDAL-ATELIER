const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuToggle?.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  nav?.classList.toggle("open", !expanded);
});
nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

// Gallery category filters
const filters = [...document.querySelectorAll(".filter")];
const galleryItems = [...document.querySelectorAll(".gallery-item")];
filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const category = filter.dataset.filter;
    filters.forEach((item) => {
      const active = item === filter;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    galleryItems.forEach((item) => {
      item.hidden = category !== "all" && item.dataset.category !== category;
    });
  });
});

// Accessible image lightbox with keyboard navigation.
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector("img");
const count = lightbox?.querySelector(".lightbox-count");
const closeButton = lightbox?.querySelector(".lightbox-close");
const prevButton = lightbox?.querySelector(".lightbox-prev");
const nextButton = lightbox?.querySelector(".lightbox-next");
let activeImages = [];
let activeIndex = 0;
let lastFocused = null;

function showImage(index) {
  if (!activeImages.length || !lightboxImage) return;
  activeIndex = (index + activeImages.length) % activeImages.length;
  const item = activeImages[activeIndex];
  const img = item.querySelector("img");
  lightboxImage.src = item.dataset.full;
  lightboxImage.alt = img?.alt || "Фотография платья";
  if (count) count.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(activeImages.length).padStart(2, "0")}`;
}
function openLightbox(item) {
  activeImages = galleryItems.filter((entry) => !entry.hidden);
  activeIndex = activeImages.indexOf(item);
  lastFocused = document.activeElement;
  showImage(activeIndex);
  lightbox?.classList.add("open");
  lightbox?.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeButton?.focus();
}
function closeLightbox() {
  lightbox?.classList.remove("open");
  lightbox?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lightboxImage) lightboxImage.src = "";
  lastFocused?.focus?.();
}
galleryItems.forEach((item) => item.addEventListener("click", () => openLightbox(item)));
closeButton?.addEventListener("click", closeLightbox);
prevButton?.addEventListener("click", () => showImage(activeIndex - 1));
nextButton?.addEventListener("click", () => showImage(activeIndex + 1));
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showImage(activeIndex - 1);
  if (event.key === "ArrowRight") showImage(activeIndex + 1);
});

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
