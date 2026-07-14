const checklistKey = "osaka-trip-checklist-v1";

function setupIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function setupChecklist() {
  const boxes = [...document.querySelectorAll(".checklist input[type='checkbox']")];
  if (!boxes.length) return;

  const saved = JSON.parse(localStorage.getItem(checklistKey) || "[]");
  boxes.forEach((box, index) => {
    box.checked = Boolean(saved[index]);
    box.addEventListener("change", () => {
      const values = boxes.map((item) => item.checked);
      localStorage.setItem(checklistKey, JSON.stringify(values));
    });
  });
}

function setupActiveNav() {
  const links = [...document.querySelectorAll(".nav a")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

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

document.addEventListener("DOMContentLoaded", () => {
  setupIcons();
  setupChecklist();
  setupActiveNav();
});
