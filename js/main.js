document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     Mobile Navigation
  ========================= */

  const menuToggle = document.getElementById("menu-toggle");
  const siteNav = document.getElementById("site-nav");

  if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  siteNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}


  /* =========================
     Lightbox Gallery
  ========================= */

  const lightbox = document.getElementById("lightbox");

const lightboxImg = lightbox ? lightbox.querySelector("#lightbox-img") : null;
const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;
const lightboxZoom = lightbox ? lightbox.querySelector("#lightbox-zoom") : null;
const lightboxPrev = lightbox ? lightbox.querySelector(".lightbox-prev") : null;
const lightboxNext = lightbox ? lightbox.querySelector(".lightbox-next") : null;

const galleryLinks = Array.from(document.querySelectorAll(".gallery a"));

  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  const updateZoomButton = () => {
    if (!lightboxZoom || !lightboxImg) return;

    const isExpanded = lightboxImg.classList.contains("expanded");

    lightboxZoom.textContent = isExpanded ? "−" : "+";
    lightboxZoom.setAttribute("aria-label", isExpanded ? "Reduce image" : "Expand image");
    lightboxZoom.setAttribute("aria-pressed", isExpanded ? "true" : "false");
  };

  const toggleZoom = () => {
    if (!lightboxImg) return;

    lightboxImg.classList.toggle("expanded");
    updateZoomButton();
  };

  const showImage = (index) => {
    if (!galleryLinks.length || !lightboxImg) return;

    currentIndex = index;

    const currentLink = galleryLinks[currentIndex];
    const fullSizeUrl = currentLink.getAttribute("href");
    const thumbnail = currentLink.querySelector("img");
    const imgAlt = thumbnail ? thumbnail.getAttribute("alt") : "Expanded portfolio image";

    lightboxImg.src = fullSizeUrl;
    lightboxImg.alt = imgAlt;
    lightboxImg.classList.remove("expanded");

    updateZoomButton();
  };

    const openLightbox = (index) => {
    if (!lightbox) return;

    showImage(index);
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";

    if (lightboxClose) {
      lightboxClose.focus();
    }
  };

    const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;

    lightbox.classList.remove("active");
    lightboxImg.classList.remove("expanded");
    lightboxImg.removeAttribute("src");
    lightboxImg.alt = "";
    document.body.style.overflow = "";

    updateZoomButton();
  };

  const showPreviousImage = () => {
    const previousIndex = currentIndex === 0 ? galleryLinks.length - 1 : currentIndex - 1;
    showImage(previousIndex);
  };

  const showNextImage = () => {
    const nextIndex = currentIndex === galleryLinks.length - 1 ? 0 : currentIndex + 1;
    showImage(nextIndex);
  };

  const handleSwipe = () => {
    if (lightboxImg && lightboxImg.classList.contains("expanded")) return;

    const swipeDistance = touchEndX - touchStartX;
    const minimumSwipeDistance = 50;

    if (Math.abs(swipeDistance) < minimumSwipeDistance) return;

    if (swipeDistance > 0) {
      showPreviousImage();
    } else {
      showNextImage();
    }
  };

  if (lightbox && lightboxImg && galleryLinks.length > 0) {
    galleryLinks.forEach((link, index) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        openLightbox(index);
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    if (lightboxZoom) {
      lightboxZoom.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleZoom();
      });
    }

    if (lightboxPrev) {
      lightboxPrev.addEventListener("click", (event) => {
        event.stopPropagation();
        showPreviousImage();
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener("click", (event) => {
        event.stopPropagation();
        showNextImage();
      });
    }

    lightboxImg.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleZoom();
    });

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    lightbox.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].screenX;
    });

    lightbox.addEventListener("touchend", (event) => {
      touchEndX = event.changedTouches[0].screenX;
      handleSwipe();
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("active")) return;

      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }

      if (event.key === "+" || event.key === "=") {
        lightboxImg.classList.add("expanded");
        updateZoomButton();
      }

      if (event.key === "-") {
        lightboxImg.classList.remove("expanded");
        updateZoomButton();
      }
    });
  }


  /* =========================
     Scroll Reveal Animation
  ========================= */

  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  }
});