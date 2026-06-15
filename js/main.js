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
  const galleryLinks = document.querySelectorAll(".gallery a");

  if (lightbox && lightboxImg && galleryLinks.length > 0) {
    galleryLinks.forEach(link => {
      link.addEventListener("click", (event) => {
        event.preventDefault();

        const fullSizeUrl = link.getAttribute("href");
        const thumbnail = link.querySelector("img");
        const imgAlt = thumbnail ? thumbnail.getAttribute("alt") : "Expanded portfolio image";

        lightboxImg.src = fullSizeUrl;
        lightboxImg.alt = imgAlt;

        lightbox.classList.add("active");
        lightboxImg.classList.remove("expanded");

        document.body.style.overflow = "hidden";
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove("active");
      lightboxImg.classList.remove("expanded");
      lightboxImg.src = "";
      document.body.style.overflow = "";
    };

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    lightboxImg.addEventListener("click", (event) => {
      event.stopPropagation();
      lightboxImg.classList.toggle("expanded");
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("active")) {
        closeLightbox();
      }
    });
  }
});