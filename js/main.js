document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const siteNav = document.getElementById("site-nav");

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      siteNav.classList.toggle("active");
    });
  }

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxZoom = document.getElementById("lightbox-zoom");
  const lightboxPrev = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");
  const galleryLinks = Array.from(document.querySelectorAll(".gallery a"));

  let currentIndex = 0;

  const updateZoomButton = () => {
    if (!lightboxZoom) return;

    const isExpanded = lightboxImg.classList.contains("expanded");

    lightboxZoom.textContent = isExpanded ? "−" : "+";
    lightboxZoom.setAttribute("aria-label", isExpanded ? "Reduce image" : "Expand image");
    lightboxZoom.setAttribute("aria-pressed", isExpanded ? "true" : "false");
  };

  const toggleZoom = () => {
    lightboxImg.classList.toggle("expanded");
    updateZoomButton();
  };

  const showImage = (index) => {
    if (!galleryLinks.length) return;

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
    showImage(index);
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("active");
    lightboxImg.classList.remove("expanded");
    lightboxImg.src = "";
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
});