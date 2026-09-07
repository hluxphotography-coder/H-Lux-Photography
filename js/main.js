document.documentElement.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     Mobile Navigation
  ========================= */

  const menuToggle = document.getElementById("menu-toggle");
  const siteNav = document.getElementById("site-nav");

  if (menuToggle && siteNav) {
    const closeMenu = (returnFocus = false) => {
      siteNav.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");

      if (returnFocus) {
        menuToggle.focus();
      }
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", isOpen);
    });

    siteNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && siteNav.classList.contains("active")) {
        closeMenu(true);
      }
    });
  }


  /* =========================
     Institutional Inquiry Fields
  ========================= */

  const inquiryType = document.getElementById("inquiry-type");
  const institutionalFields = document.getElementById("institutional-fields");
  const institutionalFieldsStatus = document.getElementById("institutional-fields-status");
  let updateInstitutionalFields = () => {};

  if (inquiryType && institutionalFields) {
    updateInstitutionalFields = (announce = false) => {
      const shouldShow = inquiryType.value === "institutional";

      institutionalFields.hidden = !shouldShow;

      if (institutionalFieldsStatus) {
        if (!announce) {
          institutionalFieldsStatus.textContent = "";
        } else {
          institutionalFieldsStatus.textContent = shouldShow
            ? "Optional institutional inquiry fields are now available."
            : "Optional institutional inquiry fields are now hidden.";
        }
      }
    };

    updateInstitutionalFields();

    inquiryType.addEventListener("change", () => {
      updateInstitutionalFields(true);
    });
  }


  /* =========================
     Form Submission
  ========================= */

  const contactForm = document.getElementById("contact-form");
  const inquirySubmit = document.getElementById("inquiry-submit");
  const formSuccess = document.getElementById("form-success");
  const formError = document.getElementById("form-error");

  if (
    contactForm &&
    inquirySubmit &&
    formSuccess &&
    formError &&
    typeof fetch === "function" &&
    typeof FormData === "function"
  ) {
    const submitButtonText = inquirySubmit.textContent;
    let submissionInProgress = false;

    const setSubmissionState = (isSubmitting) => {
      submissionInProgress = isSubmitting;
      inquirySubmit.disabled = isSubmitting;
      inquirySubmit.textContent = isSubmitting ? "Sending…" : submitButtonText;
      contactForm.setAttribute("aria-busy", String(isSubmitting));
    };

    const hideFormMessages = () => {
      [formSuccess, formError].forEach(message => {
        message.hidden = true;
      });
    };

    const showFormMessage = (message) => {
      const otherMessage = message === formSuccess ? formError : formSuccess;

      otherMessage.hidden = true;
      message.hidden = false;
      message.focus({ preventScroll: true });

      const prefersReducedMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      message.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "center"
      });
    };

    const showSubmissionError = () => {
      setSubmissionState(false);
      showFormMessage(formError);
    };

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (submissionInProgress) return;

      const formData = new FormData(contactForm);

      hideFormMessages();
      setSubmissionState(true);

      try {
        const response = await fetch(contactForm.action, {
          method: contactForm.method || "post",
          body: formData,
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`Formspree returned ${response.status}`);
        }

        contactForm.reset();
        updateInstitutionalFields();
        setSubmissionState(false);
        showFormMessage(formSuccess);
      } catch {
        showSubmissionError();
      }
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
  const galleryLinks = Array.from(document.querySelectorAll(".project-intro-image a[href], .gallery a[href]"));
  const backgroundElements = lightbox
    ? Array.from(document.querySelectorAll("body > .skip-link, body > header, body > main, body > footer"))
    : [];

  let lightboxPosition = lightbox ? lightbox.querySelector("#lightbox-position") : null;
  let currentIndex = 0;
  let activeGalleryLink = null;
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightbox) {
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Expanded photograph");
    lightbox.setAttribute("aria-hidden", "true");

    if (!lightboxPosition) {
      lightboxPosition = document.createElement("p");
      lightboxPosition.id = "lightbox-position";
      lightboxPosition.className = "lightbox-position";
      lightboxPosition.setAttribute("aria-live", "polite");
      lightboxPosition.setAttribute("aria-atomic", "true");
      lightbox.append(lightboxPosition);
    }
  }

  const setBackgroundInert = isInert => {
    backgroundElements.forEach(element => {
      if ("inert" in element) {
        element.inert = isInert;
      } else if (isInert) {
        element.setAttribute("aria-hidden", "true");
      } else {
        element.removeAttribute("aria-hidden");
      }
    });
  };

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

    currentIndex = Math.max(0, Math.min(index, galleryLinks.length - 1));

    const currentLink = galleryLinks[currentIndex];
    const fullSizeUrl = currentLink.getAttribute("href");
    const thumbnail = currentLink.querySelector("img");
    const imgAlt = thumbnail ? thumbnail.getAttribute("alt") : "Expanded portfolio image";

    lightboxImg.src = fullSizeUrl;
    lightboxImg.alt = imgAlt;
    lightboxImg.classList.remove("expanded");

    if (lightboxPrev) {
      lightboxPrev.disabled = currentIndex === 0;
    }

    if (lightboxNext) {
      lightboxNext.disabled = currentIndex === galleryLinks.length - 1;
    }

    if (lightboxPosition) {
      const numberWidth = String(galleryLinks.length).length;
      const currentNumber = String(currentIndex + 1).padStart(numberWidth, "0");
      lightboxPosition.textContent = `${currentNumber} / ${galleryLinks.length}`;
    }

    updateZoomButton();
  };

  const openLightbox = (index) => {
    if (!lightbox) return;

    activeGalleryLink = galleryLinks[index];
    showImage(index);
    lightbox.setAttribute("aria-hidden", "false");
    lightbox.classList.add("active");
    setBackgroundInert(true);
    document.body.style.overflow = "hidden";

    if (lightboxClose) {
      lightboxClose.focus();
    }
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;

    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.classList.remove("expanded");
    lightboxImg.removeAttribute("src");
    lightboxImg.alt = "";
    document.body.style.overflow = "";
    setBackgroundInert(false);

    updateZoomButton();

    if (activeGalleryLink) {
      activeGalleryLink.focus({ preventScroll: true });
      activeGalleryLink = null;
    }
  };

  const showPreviousImage = () => {
    if (currentIndex > 0) {
      showImage(currentIndex - 1);
    }
  };

  const showNextImage = () => {
    if (currentIndex < galleryLinks.length - 1) {
      showImage(currentIndex + 1);
    }
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

  const trapLightboxFocus = event => {
    if (!lightbox) return;

    const focusableElements = Array.from(
      lightbox.querySelectorAll("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])")
    ).filter(element => !element.hasAttribute("hidden"));

    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    } else if (!lightbox.contains(document.activeElement)) {
      event.preventDefault();
      firstElement.focus();
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
        event.preventDefault();
        closeLightbox();
        return;
      }

      if (event.key === "Tab") {
        trapLightboxFocus(event);
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
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
