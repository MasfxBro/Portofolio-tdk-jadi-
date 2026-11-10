const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");
const navigationLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];
const heroActions = document.querySelector(".hero-actions");
const aboutLink = heroActions?.querySelector(".about-link");
const siteHeader = document.querySelector(".site-header");
const aboutSection = document.querySelector("#about");

function closeNavigation() {
  if (!menuToggle || !navigation) return;

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navigation.classList.remove("is-open");
}

menuToggle?.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute(
    "aria-label",
    isExpanded ? "Open navigation menu" : "Close navigation menu",
  );
  navigation?.classList.toggle("is-open", !isExpanded);
});

navigation?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeNavigation();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

aboutLink?.addEventListener("pointerenter", () => {
  heroActions.classList.add("is-about-active");
});

aboutLink?.addEventListener("pointerleave", () => {
  if (!aboutLink.matches(":focus-visible")) {
    heroActions.classList.remove("is-about-active");
  }
});

aboutLink?.addEventListener("focus", () => {
  if (aboutLink.matches(":focus-visible")) {
    heroActions.classList.add("is-about-active");
  }
});

aboutLink?.addEventListener("blur", () => {
  if (!aboutLink.matches(":hover")) {
    heroActions.classList.remove("is-about-active");
  }
});

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        navigationLinks.forEach((link) => {
          const isCurrent = link.hash === `#${entry.target.id}`;
          link.classList.toggle("is-active", isCurrent);

          if (isCurrent) {
            link.setAttribute("aria-current", "page");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      }
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0,
    },
  );

  sections.forEach((section) => sectionObserver.observe(section));

  if (siteHeader && aboutSection) {
    aboutSection.classList.add("has-reveal");

    const aboutSectionObserver = new IntersectionObserver(
      ([entry]) => {
        const isAboutVisible = entry.isIntersecting && entry.intersectionRatio >= 0.16;
        siteHeader.classList.toggle("is-about-visible", isAboutVisible);
      },
      { threshold: 0.16 },
    );

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.05,
      },
    );

    aboutSectionObserver.observe(aboutSection);
    aboutSection.querySelectorAll("[data-reveal]").forEach((element) => {
      revealObserver.observe(element);
    });
  }
} else {
  aboutSection?.querySelectorAll("[data-reveal]").forEach((element) => {
    element.classList.add("is-revealed");
  });
}
