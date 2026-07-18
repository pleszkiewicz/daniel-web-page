(function () {
  var config = window.siteConfig || {};
  var company = config.company || {};
  var locale = document.documentElement.lang || "pl";

  var labels = {
    pl: {
      menuOpen: "Otwórz menu",
      menuClose: "Zamknij menu",
      openGallery: "Otwórz galerię",
      closePreview: "Zamknij podgląd",
      previous: "Poprzednie zdjęcie",
      next: "Następne zdjęcie",
      photoPreview: "Otwórz zdjęcie",
    },
    en: {
      menuOpen: "Open menu",
      menuClose: "Close menu",
      openGallery: "Open gallery",
      closePreview: "Close preview",
      previous: "Previous image",
      next: "Next image",
      photoPreview: "Open photo",
    },
    de: {
      menuOpen: "Menü öffnen",
      menuClose: "Menü schließen",
      openGallery: "Galerie öffnen",
      closePreview: "Vorschau schließen",
      previous: "Vorheriges Bild",
      next: "Nächstes Bild",
      photoPreview: "Foto öffnen",
    },
    uk: {
      menuOpen: "Відкрити меню",
      menuClose: "Закрити меню",
      openGallery: "Відкрити галерею",
      closePreview: "Закрити перегляд",
      previous: "Попереднє фото",
      next: "Наступне фото",
      photoPreview: "Відкрити фото",
    },
  };

  var copy = labels[locale] || labels.pl;

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach(function (element) {
      element.textContent = value;
    });
  }

  function setHref(selector, value) {
    document.querySelectorAll(selector).forEach(function (element) {
      element.setAttribute("href", value);
    });
  }

  function hydrateCompanyData() {
    setText("[data-company='contactPerson']", company.contactPerson || "");
    setText("[data-company='phoneDisplay']", company.phoneDisplay || "");
    setText("[data-company='email']", company.email || "");
    setText(
      "[data-company='serviceArea']",
      company.serviceArea
        ? company.serviceArea[locale] || company.serviceArea.pl || ""
        : "",
    );
    setText("[data-company='legalName']", company.legalName || "");
    setHref("[data-company-href='phone']", company.phoneHref || "#");
    setHref("[data-company-href='email']", company.emailHref || "#");
    setHref("[data-company-href='facebook']", company.facebookUrl || "#");
    setHref(
      "[data-company-href='facebookPhotos']",
      company.facebookPhotosUrl || company.facebookUrl || "#",
    );
    document.querySelectorAll("[data-year]").forEach(function (element) {
      element.textContent = String(new Date().getFullYear());
    });
  }

  function setupHeader() {
    var header = document.querySelector("[data-header]");
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    function updateScrolledState() {
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }

    function closeMenu() {
      if (!menuButton || !mobileNav) return;
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", copy.menuOpen);
      mobileNav.hidden = true;
      document.body.classList.remove("menu-open");
    }

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        var isOpen = menuButton.getAttribute("aria-expanded") === "true";
        menuButton.setAttribute("aria-expanded", String(!isOpen));
        menuButton.setAttribute("aria-label", isOpen ? copy.menuOpen : copy.menuClose);
        mobileNav.hidden = isOpen;
        document.body.classList.toggle("menu-open", !isOpen);
      });

      mobileNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeMenu();
      });
    }

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
  }

  function setupGalleryMainImage() {
    var frame = document.querySelector("[data-gallery-main]");
    var image = document.querySelector("[data-gallery-main-image]");
    var mainImage = config.galleryMain && config.galleryMain[locale];

    if (!frame || !image) return;

    function hideFrame() {
      frame.hidden = true;
      image.removeAttribute("src");
    }

    image.addEventListener("error", hideFrame);

    if (!image.getAttribute("src") && mainImage && mainImage.src) {
      image.alt = mainImage.alt || "";
      image.width = mainImage.width || 1600;
      image.height = mainImage.height || 1200;
      image.src = mainImage.src;
    }

    if (!image.getAttribute("src") || (image.complete && image.naturalWidth === 0)) {
      hideFrame();
    }
  }

  function formatPhotoCount(count) {
    if (locale === "en") {
      return count + (count === 1 ? " photo" : " photos");
    }
    if (locale === "de") {
      return count + (count === 1 ? " Foto" : " Fotos");
    }
    if (locale === "uk") {
      return count + " фото";
    }

    return count === 1 ? "1 zdjęcie" : count + " zdjęć";
  }

  function createPreviewImage(image) {
    var previewImage = document.createElement("img");
    previewImage.loading = "lazy";
    previewImage.src = image.src;
    previewImage.alt = "";
    previewImage.width = image.width || 1200;
    previewImage.height = image.height || 900;
    return previewImage;
  }

  function setupGalleryGroups() {
    var groupsRoot = document.querySelector("[data-gallery-groups]");
    var lightbox = document.querySelector("[data-lightbox]");
    if (!groupsRoot || !lightbox) return;

    var groups = (config.galleryGroups && config.galleryGroups[locale]) || [];
    var activeImages = [];
    var activeIndex = 0;
    var detail = document.querySelector("[data-gallery-detail]");
    var detailTitle = document.querySelector("[data-gallery-detail-title]");
    var photosRoot = document.querySelector("[data-gallery-photos]");
    var backButton = document.querySelector("[data-gallery-back]");
    var lightboxImage = lightbox.querySelector("[data-lightbox-image]");
    var lightboxCaption = lightbox.querySelector("[data-lightbox-caption]");
    var closeButton = lightbox.querySelector("[data-lightbox-close]");
    var prevButton = lightbox.querySelector("[data-lightbox-prev]");
    var nextButton = lightbox.querySelector("[data-lightbox-next]");

    function openLightbox(images, index) {
      var image = images[index];
      if (!image || !lightboxImage || !lightboxCaption) return;
      activeImages = images;
      activeIndex = index;
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt || "";
      lightboxCaption.textContent = image.alt || "";
      if (prevButton) prevButton.hidden = images.length < 2;
      if (nextButton) nextButton.hidden = images.length < 2;
      lightbox.hidden = false;
      if (closeButton) closeButton.focus();
      document.body.classList.add("modal-open");
    }

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.classList.remove("modal-open");
    }

    function moveLightbox(delta) {
      if (!activeImages.length) return;
      openLightbox(
        activeImages,
        (activeIndex + delta + activeImages.length) % activeImages.length,
      );
    }

    function showCategories() {
      groupsRoot.hidden = false;
      if (detail) detail.hidden = true;
      if (photosRoot) photosRoot.innerHTML = "";
      groupsRoot.scrollIntoView({ block: "start", behavior: "smooth" });
    }

    function showGallery(group) {
      if (!detail || !detailTitle || !photosRoot) return;

      groupsRoot.hidden = true;
      detail.hidden = false;
      detailTitle.textContent = group.title;
      photosRoot.innerHTML = "";

      group.images.forEach(function (image, index) {
        var button = document.createElement("button");
        var thumbnail = document.createElement("img");

        button.className = "gallery-photo-tile";
        button.type = "button";
        button.setAttribute("aria-label", copy.photoPreview + ": " + image.alt);

        thumbnail.loading = "lazy";
        thumbnail.src = image.src;
        thumbnail.alt = image.alt || "";
        thumbnail.width = image.width || 1200;
        thumbnail.height = image.height || 900;

        button.appendChild(thumbnail);
        button.addEventListener("click", function () {
          openLightbox(group.images, index);
        });
        photosRoot.appendChild(button);
      });

      detail.scrollIntoView({ block: "start", behavior: "smooth" });
    }

    groupsRoot.innerHTML = "";

    groups.forEach(function (group) {
      if (!group.images || !group.images.length) return;

      var button = document.createElement("button");
      var preview = document.createElement("span");
      var meta = document.createElement("span");
      var title = document.createElement("span");
      var count = document.createElement("span");

      button.className = "gallery-group-card";
      button.type = "button";
      button.setAttribute("aria-label", copy.openGallery + ": " + group.title);

      preview.className = "gallery-card-preview";
      preview.setAttribute("aria-hidden", "true");

      group.images.slice(0, 4).forEach(function (image) {
        preview.appendChild(createPreviewImage(image));
      });

      meta.className = "gallery-card-meta";
      title.className = "gallery-card-title";
      title.textContent = group.title;
      count.className = "gallery-card-count";
      count.textContent = formatPhotoCount(group.images.length);

      meta.appendChild(title);
      meta.appendChild(count);
      button.appendChild(preview);
      button.appendChild(meta);
      button.addEventListener("click", function () {
        showGallery(group);
      });

      groupsRoot.appendChild(button);
    });

    if (backButton) backButton.addEventListener("click", showCategories);

    if (closeButton) closeButton.addEventListener("click", closeLightbox);
    if (prevButton) {
      prevButton.setAttribute("aria-label", copy.previous);
      prevButton.addEventListener("click", function () {
        moveLightbox(-1);
      });
    }
    if (nextButton) {
      nextButton.setAttribute("aria-label", copy.next);
      nextButton.addEventListener("click", function () {
        moveLightbox(1);
      });
    }
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (event) {
      if (lightbox.hidden) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") moveLightbox(-1);
      if (event.key === "ArrowRight") moveLightbox(1);
    });
  }

  function setupServiceWorker() {
    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      var appScriptUrl =
        document.currentScript && document.currentScript.src
          ? document.currentScript.src
          : "assets/app.js";
      var serviceWorkerUrl = new URL("../sw.js", appScriptUrl);
      navigator.serviceWorker.register(serviceWorkerUrl.href).catch(function () {});
    }
  }

  hydrateCompanyData();
  setupHeader();
  setupGalleryMainImage();
  setupGalleryGroups();
  setupServiceWorker();
})();
