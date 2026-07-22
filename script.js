function setupIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function setupActiveNav() {
  const links = Array.from(document.querySelectorAll(".nav a"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!("IntersectionObserver" in window)) {
    if (links[0]) {
      links[0].setAttribute("aria-current", "true");
    }
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      links.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${visible.target.id}`;
        link.toggleAttribute("aria-current", isActive);
      });
    },
    { rootMargin: "-20% 0px -65% 0px", threshold: [0.08, 0.2, 0.4] },
  );

  sections.forEach((section) => observer.observe(section));
}

function setupPhotoLightbox() {
  const lightbox = document.querySelector("#photo-lightbox");
  if (!lightbox) return;

  const previewImage = lightbox.querySelector("#lightbox-image");
  const previewCaption = lightbox.querySelector("#lightbox-caption");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const backdrop = lightbox.querySelector(".lightbox-backdrop");
  const triggers = Array.from(document.querySelectorAll(".photo-trigger"));
  let lastFocusedElement = null;

  if (!previewImage || !previewCaption || !closeButton || !backdrop) return;

  function openLightbox(trigger) {
    const image = trigger.querySelector("img");
    const captionElement = trigger.querySelector("figcaption");
    const caption = trigger.dataset.caption || (captionElement ? captionElement.textContent : "");

    if (!image) return;

    lastFocusedElement = document.activeElement;
    previewImage.src = image.currentSrc || image.src;
    previewImage.alt = image.alt;
    previewCaption.textContent = caption;
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    previewImage.removeAttribute("src");
    previewImage.alt = "";
    document.body.classList.remove("lightbox-open");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openLightbox(trigger));
    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openLightbox(trigger);
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  backdrop.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden || event.key !== "Escape") return;
    closeLightbox();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupIcons();
  setupActiveNav();
  setupPhotoLightbox();
});
