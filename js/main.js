document.documentElement.classList.add("js-enabled");

/* Inline photographs only; the full-image viewer owns its own recovery UI. */
const initializeInlineImageRecovery = () => {
  const photographs = Array.from(document.querySelectorAll('main#main-content img[src^="images/"]'))
    .filter(image => !image.closest("#lightbox"));
  if (!photographs.length) return;

  const main = document.getElementById("main-content");
  const failed = new Set();
  const states = new Map(photographs.map(image => [image, {
    automaticAttempts: 0,
    automaticArmed: false,
    inFlight: false
  }]));
  const queued = new Map();
  const manualPending = new Set();
  const automaticDelays = [2000, 8000, 20000];
  let onlineHint = navigator.onLine !== false;
  let wakeTimer = null;
  let nextStartAt = 0;
  let announcedFailure = false;
  let announcementTimer = null;
  const fallbacks = new Map();

  // One quiet announcement channel; visual recovery belongs to each photograph.
  const status = document.createElement("p");
  status.className = "inline-image-recovery-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.setAttribute("aria-atomic", "true");
  main.append(status);

  const isEligible = image => failed.has(image) && image.isConnected &&
    !states.get(image).inFlight && image.complete && image.naturalWidth === 0 &&
    Boolean(image.getAttribute("src"));

  const positionFallback = image => {
    const view = fallbacks.get(image);
    if (!view || view.panel.hidden) return;
    const photo = image.getBoundingClientRect();
    const host = view.host.getBoundingClientRect();
    Object.assign(view.panel.style, {
      left: `${photo.left - host.left - view.host.clientLeft + view.host.scrollLeft}px`,
      top: `${photo.top - host.top - view.host.clientTop + view.host.scrollTop}px`,
      width: `${photo.width}px`,
      height: `${photo.height}px`
    });
    // Small insets may need a scrollable description, with a real keyboard stop.
    const scrollable = view.descriptionViewport.scrollHeight > view.descriptionViewport.clientHeight + 1;
    const descriptionFocused = document.activeElement === view.descriptionViewport;
    view.descriptionViewport.tabIndex = scrollable || descriptionFocused ? 0 : -1;
    if (scrollable || descriptionFocused) {
      view.descriptionViewport.setAttribute("role", "group");
      view.descriptionViewport.setAttribute("aria-label", "Photograph description");
    } else {
      view.descriptionViewport.removeAttribute("role");
      view.descriptionViewport.removeAttribute("aria-label");
    }
  };

  const positionFallbacks = () => fallbacks.forEach((view, image) => positionFallback(image));
  const resizeObserver = typeof ResizeObserver === "function"
    ? new ResizeObserver(positionFallbacks)
    : null;
  window.addEventListener("resize", positionFallbacks);

  const createFallback = image => {
    if (fallbacks.has(image)) return fallbacks.get(image);
    const link = image.closest("a");
    const sibling = link || image;
    const host = sibling.parentElement;
    const panel = document.createElement("div");
    panel.className = "inline-image-fallback";
    panel.hidden = true;
    const content = document.createElement("div");
    content.className = "inline-image-fallback-content";
    const label = document.createElement("p");
    label.className = "inline-image-fallback-label";
    label.textContent = "Image temporarily unavailable";
    const descriptionViewport = document.createElement("div");
    descriptionViewport.className = "inline-image-fallback-description";
    descriptionViewport.tabIndex = -1;
    const description = document.createElement("p");
    description.textContent = image.alt;
    // The original image remains accessible; only this visual duplicate is hidden.
    description.setAttribute("aria-hidden", "true");
    descriptionViewport.append(description);
    const retry = document.createElement("button");
    retry.type = "button";
    content.append(label, descriptionViewport, retry);
    panel.append(content);
    // A sibling overlay needs no wrapper and never nests a button inside a link.
    sibling.after(panel);
    const view = { host, panel, retry, descriptionViewport };
    fallbacks.set(image, view);
    resizeObserver?.observe(image);
    resizeObserver?.observe(host);

    retry.addEventListener("click", () => {
      if (retry.getAttribute("aria-disabled") === "true" || !isEligible(image)) return;
      manualPending.add(image);
      // Supersede this image's queued work only; its automatic budget is unchanged.
      queued.set(image, { kind: "manual", due: Date.now() });
      updateFallbacks();
      scheduleWake();
    });
    panel.addEventListener("focusout", () => queueMicrotask(updateFallbacks));
    return view;
  };

  const updateFallbacks = () => {
    failed.forEach(createFallback);
    fallbacks.forEach((view, image) => {
      const unavailable = failed.has(image);
      // Keep a recovered control only while focused, without covering the photograph.
      view.panel.hidden = !unavailable && !view.panel.contains(document.activeElement);
      view.panel.classList.toggle("is-recovered", !unavailable);
      view.panel.classList.toggle("has-description-focus", document.activeElement === view.descriptionViewport);
      view.retry.textContent = unavailable ? "Retry image" : "Image loaded";
      view.retry.setAttribute("aria-label", `${unavailable ? "Retry image" : "Image loaded"}: ${image.alt}`);
      view.retry.setAttribute("aria-disabled", String(!unavailable || manualPending.has(image) || !isEligible(image)));
      if (!view.panel.hidden && getComputedStyle(view.host).position === "static") {
        view.host.classList.add("inline-image-recovery-host");
      }
      positionFallback(image);
    });

    if (!failed.size) {
      fallbacks.forEach(view => {
        if (!Array.from(fallbacks.values()).some(other => other.host === view.host && !other.panel.hidden)) {
          view.host.classList.remove("inline-image-recovery-host");
        }
      });
    }

    if (!failed.size) {
      announcedFailure = false;
      window.clearTimeout(announcementTimer);
      if (status.textContent !== "Image loaded.") status.textContent = "";
      return;
    }

    if (!announcedFailure) {
      // Let the live region mount first; one announcement covers a failure episode.
      announcementTimer = window.setTimeout(() => {
        if (failed.size) status.textContent = "A photograph is temporarily unavailable. Retry is available beside its description.";
      }, 100);
      announcedFailure = true;
    }
  };

  const finishManualAttempt = image => {
    if (manualPending.delete(image)) {
      window.clearTimeout(announcementTimer);
      status.textContent = failed.has(image)
        ? "Image is still unavailable. You can retry again."
        : "Image loaded.";
    }
  };

  const scheduleWake = () => {
    window.clearTimeout(wakeTimer);
    wakeTimer = null;
    if (!queued.size) return;

    const due = Math.min(...Array.from(queued.values(), job => job.due));
    wakeTimer = window.setTimeout(runNext, Math.max(0, Math.max(due, nextStartAt) - Date.now()));
  };

  const queueAutomatic = image => {
    const state = states.get(image);
    if (!onlineHint || !state.automaticArmed ||
        state.automaticAttempts >= automaticDelays.length || queued.has(image) || !isEligible(image)) return;

    queued.set(image, {
      kind: "automatic",
      due: Date.now() + automaticDelays[state.automaticAttempts]
    });
    scheduleWake();
  };

  function runNext() {
    wakeTimer = null;
    const entry = Array.from(queued).sort((a, b) => a[1].due - b[1].due)[0];
    if (!entry) return;
    const [image, job] = entry;
    if (Date.now() < Math.max(job.due, nextStartAt)) {
      scheduleWake();
      return;
    }
    queued.delete(image);

    const state = states.get(image);
    if (!isEligible(image) || (job.kind === "automatic" &&
        (!onlineHint || state.automaticAttempts >= automaticDelays.length))) {
      // Native responsive/lazy loading may have started its own request meanwhile.
      finishManualAttempt(image);
      updateFallbacks();
      scheduleWake();
      return;
    }

    if (job.kind === "automatic") state.automaticAttempts += 1;
    state.inFlight = true;
    nextStartAt = Date.now() + 500;
    // Leave srcset/sizes intact so the browser still selects the right candidate.
    image.setAttribute("src", image.getAttribute("src"));
    updateFallbacks();
    scheduleWake();
  }

  const recordFailure = image => {
    // Ignore a late event if the current request is pending or already successful.
    if (!image.complete || image.naturalWidth > 0 || !image.getAttribute("src")) return;
    states.get(image).inFlight = false;
    failed.add(image);
    finishManualAttempt(image);
    updateFallbacks();
    queueAutomatic(image);
  };

  photographs.forEach(image => {
    image.addEventListener("error", () => recordFailure(image));
    image.addEventListener("load", () => {
      if (!image.complete || !image.naturalWidth) return;
      const state = states.get(image);
      state.inFlight = false;
      state.automaticArmed = false;
      failed.delete(image);
      queued.delete(image);
      finishManualAttempt(image);
      updateFallbacks();
      scheduleWake();
    });
  });

  // Earlier failures are terminal; untouched lazy images are not complete.
  photographs.forEach(image => {
    if (image.getAttribute("src") && image.currentSrc && image.complete && image.naturalWidth === 0) {
      recordFailure(image);
    }
  });

  window.addEventListener("online", () => {
    // This is permission to attempt recovery, not proof that the server is reachable.
    onlineHint = true;
    failed.forEach(image => {
      states.get(image).automaticArmed = true;
      queueAutomatic(image);
    });
  });

  window.addEventListener("offline", () => {
    onlineHint = false;
    window.clearTimeout(wakeTimer);
    wakeTimer = null;
    const cancelled = Array.from(queued.keys());
    queued.clear();
    cancelled.forEach(finishManualAttempt);
    updateFallbacks();
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initializeInlineImageRecovery();

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
      institutionalFields.disabled = !shouldShow;

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
  let lightboxMessage = null;
  let lightboxRetry = null;

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

    const feedback = document.createElement("div");
    feedback.className = "lightbox-feedback";
    lightboxMessage = document.createElement("p");
    lightboxMessage.setAttribute("role", "status");
    lightboxMessage.setAttribute("aria-live", "polite");
    lightboxMessage.setAttribute("aria-atomic", "true");
    lightboxRetry = document.createElement("button");
    lightboxRetry.type = "button";
    lightboxRetry.className = "lightbox-retry";
    lightboxRetry.textContent = "Retry";
    lightboxRetry.hidden = true;
    feedback.append(lightboxMessage, lightboxRetry);
    lightbox.append(feedback);
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

    // Hide the previous photograph until this request succeeds.
    lightboxImg.classList.add("is-unavailable");
    lightboxMessage.textContent = "";
    if (document.activeElement === lightboxRetry && lightboxClose) {
      lightboxClose.focus({ preventScroll: true });
    }
    lightboxRetry.hidden = true;
    // Clearing src also allows Retry to request the same URL again.
    lightboxImg.removeAttribute("src");
    lightboxImg.alt = imgAlt;
    lightboxImg.src = fullSizeUrl;
    lightboxImg.classList.remove("expanded");

    if (lightboxPrev) {
      lightboxPrev.disabled = currentIndex === 0;
    }

    if (lightboxNext) {
      lightboxNext.disabled = currentIndex === galleryLinks.length - 1;
    }

    if (lightboxPosition) {
      const numberWidth = Math.max(2, String(galleryLinks.length).length);
      const currentNumber = String(currentIndex + 1).padStart(numberWidth, "0");
      const totalNumber = String(galleryLinks.length).padStart(numberWidth, "0");
      lightboxPosition.textContent = `${currentNumber} / ${totalNumber}`;
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
    lightboxMessage.textContent = "";
    lightboxRetry.hidden = true;
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
    lightboxImg.addEventListener("load", () => {
      // Inspect the current request so late events cannot reveal a stale image.
      if (!lightbox.classList.contains("active") || !lightboxImg.complete || !lightboxImg.naturalWidth) return;

      lightboxImg.classList.remove("is-unavailable");
      lightboxMessage.textContent = "";
      lightboxRetry.hidden = true;
    });

    lightboxImg.addEventListener("error", () => {
      if (!lightbox.classList.contains("active") || !lightboxImg.hasAttribute("src") ||
          !lightboxImg.complete || lightboxImg.naturalWidth) return;

      lightboxImg.classList.add("is-unavailable");
      lightboxMessage.textContent = "Image could not be loaded.";
      lightboxRetry.hidden = false;
    });

    lightboxRetry.addEventListener("click", () => {
      showImage(currentIndex);
    });

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
