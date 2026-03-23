const navLinks = Array.from(
  document.querySelectorAll('nav ul li a[href^="#"]')
);
const navbar = document.querySelector("nav");
const navToggle = document.querySelector(".nav-toggle");
const mobileMenuBreakpoint = window.matchMedia("(max-width: 768px)");

// GitHub Pages repository sites are served from /<repo-name>/, so relative
// image paths can fail after deployment if the browser resolves them against
// the wrong base. This normalizes image URLs only on github.io hosts.
function normalizeImagePathsForGitHubPages() {
  if (!window.location.hostname.endsWith("github.io")) return;

  const pathParts = window.location.pathname.split("/").filter(Boolean);
  if (!pathParts.length) return;

  const repoBase = `/${pathParts[0]}/`;

  document.querySelectorAll('img[src^="images/"]').forEach((image) => {
    const relativeSrc = image.getAttribute("src");
    image.src = `${repoBase}${relativeSrc}`;
  });
}

normalizeImagePathsForGitHubPages();

const navItems = navLinks
  .map((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    return target ? { link, target } : null;
  })
  .filter(Boolean);

let isProgrammaticScroll = false;
let scrollStopTimer = null;

function getNavHeight() {
  return navbar ? Math.ceil(navbar.getBoundingClientRect().height) : 0;
}

function closeMenu() {
  if (!navbar || !navToggle) return;
  navbar.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
}

function openMenu() {
  if (!navbar || !navToggle) return;
  navbar.classList.add("menu-open");
  navToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("nav-open");
}

function toggleMenu() {
  if (!navbar || !navToggle) return;
  const isOpen = navbar.classList.contains("menu-open");
  if (isOpen) closeMenu();
  else openMenu();
}

function getTargetTop(target) {
  const extraOffset = 10;
  const absoluteTop = target.getBoundingClientRect().top + window.scrollY;
  return Math.max(absoluteTop - getNavHeight() - extraOffset, 0);
}

function setActiveLinkById(id) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active-link", isActive);
  });
}

function updateActiveOnScroll() {
  if (!navItems.length || isProgrammaticScroll) return;

  const probeY = window.scrollY + getNavHeight() + 12;
  let activeId = navItems[0].target.id;

  navItems.forEach(({ target }) => {
    const sectionTop = target.getBoundingClientRect().top + window.scrollY;
    if (probeY >= sectionTop) activeId = target.id;
  });

  setActiveLinkById(activeId);
}

function markProgrammaticScrollDoneSoon() {
  if (scrollStopTimer) clearTimeout(scrollStopTimer);
  scrollStopTimer = setTimeout(() => {
    isProgrammaticScroll = false;
    updateActiveOnScroll();
  }, 140);
}

window.addEventListener("scroll", () => {
  if (isProgrammaticScroll) markProgrammaticScrollDoneSoon();
  else updateActiveOnScroll();
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    closeMenu();
    isProgrammaticScroll = true;
    setActiveLinkById(target.id);

    window.scrollTo({
      top: getTargetTop(target),
      behavior: "smooth",
    });

    setTimeout(() => {
      isProgrammaticScroll = false;
      updateActiveOnScroll();
    }, 900);
  });
});

if (navToggle) {
  navToggle.addEventListener("click", toggleMenu);
}

window.addEventListener("resize", () => {
  updateActiveOnScroll();
  if (!mobileMenuBreakpoint.matches) closeMenu();
});

document.addEventListener("click", (event) => {
  if (!mobileMenuBreakpoint.matches || !navbar || !navbar.classList.contains("menu-open")) {
    return;
  }

  if (!navbar.contains(event.target)) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

updateActiveOnScroll();

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !subject || !message) {
      alert("Please fill in all fields first.");
      return;
    }

    const emailBody =
      `Name: ${name}\n` +
      `Email: ${email}\n\n` +
      `Message:\n${message}`;

    const mailtoLink =
      `mailto:maryroseannecruzwp@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

    window.location.href = mailtoLink;
  });
}
