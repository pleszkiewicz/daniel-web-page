var galleryGroupData = [
  {
    slug: "rooms",
    title: { pl: "Pokoje", en: "Rooms", de: "Zimmer", uk: "Кімнати" },
    files: [
      { file: "photo002.jpg", width: 2048, height: 1536 },
      { file: "photo004.jpg", width: 2048, height: 1536 },
      { file: "photo005.jpg", width: 2048, height: 1536 },
      { file: "photo007.jpg", width: 2048, height: 1536 },
      { file: "photo012.jpg", width: 1536, height: 2048 },
      { file: "photo014.jpg", width: 1536, height: 2048 },
      { file: "photo035.jpg", width: 1536, height: 2048 },
      { file: "photo037.jpg", width: 1536, height: 2048 },
      { file: "photo038.jpg", width: 1536, height: 2048 },
      { file: "photo039.jpg", width: 1536, height: 2048 },
      { file: "photo040.jpg", width: 1536, height: 2048 },
      { file: "photo041.jpg", width: 1536, height: 2048 },
      { file: "photo044.jpg", width: 1536, height: 2048 },
      { file: "photo045.jpg", width: 1536, height: 2048 },
    ],
  },
  {
    slug: "bathrooms",
    title: { pl: "Łazienki", en: "Bathrooms", de: "Bäder", uk: "Ванні кімнати" },
    files: [
      { file: "photo013.jpg", width: 1536, height: 2048 },
      { file: "photo016.jpg", width: 1536, height: 2048 },
      { file: "photo019.jpg", width: 1536, height: 2048 },
      { file: "photo020.jpg", width: 1536, height: 2048 },
      { file: "photo021.jpg", width: 1536, height: 2048 },
      { file: "photo026.jpg", width: 1536, height: 2048 },
      { file: "photo027.jpg", width: 1536, height: 2048 },
      { file: "photo028.jpg", width: 1536, height: 2048 },
      { file: "photo029.jpg", width: 1536, height: 2048 },
      { file: "photo030.jpg", width: 1536, height: 2048 },
      { file: "photo031.jpg", width: 2048, height: 1536 },
      { file: "photo032.jpg", width: 1536, height: 2048 },
      { file: "photo033.jpg", width: 1536, height: 2048 },
      { file: "photo036.jpg", width: 2048, height: 1536 },
      { file: "photo042.jpg", width: 1536, height: 2048 },
      { file: "photo043.jpg", width: 1536, height: 2048 },
    ],
  },
  {
    slug: "attics",
    title: { pl: "Poddasza", en: "Attics", de: "Dachgeschosse", uk: "Мансарди" },
    files: [
      { file: "photo006.jpg", width: 2048, height: 1536 },
      { file: "photo008.jpg", width: 2048, height: 1536 },
      { file: "photo009.jpg", width: 2048, height: 1536 },
      { file: "photo010.jpg", width: 2048, height: 1536 },
    ],
  },
  {
    slug: "stairs",
    title: { pl: "Schody", en: "Stairs", de: "Treppen", uk: "Сходи" },
    files: [
      { file: "photo001.jpg", width: 963, height: 960 },
      { file: "photo015.jpg", width: 1536, height: 2048 },
      { file: "photo018.jpg", width: 1536, height: 2048 },
    ],
  },
  {
    slug: "walls",
    title: { pl: "Ściany dekoracyjne", en: "Decorative walls", de: "Dekorative Wände", uk: "Декоративні стіни" },
    files: [
      { file: "photo003.jpg", width: 1200, height: 1600 },
      { file: "photo017.jpg", width: 2048, height: 1536 },
      { file: "photo022.jpg", width: 1536, height: 2048 },
    ],
  },
  {
    slug: "shells",
    title: { pl: "Zabudowy i konstrukcje", en: "Structures and framing", de: "Trockenbau und Konstruktionen", uk: "Конструкції та обшивки" },
    files: [{ file: "photo011.jpg", width: 1536, height: 2048 }],
  },
  {
    slug: "misc",
    title: { pl: "Pozostałe realizacje", en: "Other projects", de: "Weitere Projekte", uk: "Інші проєкти" },
    files: [
      { file: "photo023.jpg", width: 1536, height: 2048 },
      { file: "photo024.jpg", width: 2048, height: 1536 },
      { file: "photo025.jpg", width: 1536, height: 2048 },
      { file: "photo034.jpg", width: 1520, height: 2048 },
    ],
  },
];

function resolveAsset(path) {
  var normalizedPath = path.replace(/^\/+/, "");

  if (typeof document === "undefined" || !document.currentScript) {
    return "/" + normalizedPath;
  }

  return new URL("../" + normalizedPath, document.currentScript.src).href;
}

function buildGalleryMain(locale) {
  var altText = {
    pl: "Wybrana realizacja wykończenia wnętrza",
    en: "Selected interior finishing project",
    de: "Ausgewähltes Projekt im Innenausbau",
    uk: "Вибраний проєкт оздоблення інтер'єру",
  };

  return {
    src: resolveAsset("gallery/main.jpg"),
    width: 2048,
    height: 1536,
    alt: altText[locale] || altText.pl,
  };
}

function buildImageAlt(locale, title, photoNumber) {
  if (locale === "en") return title + " - project photo " + photoNumber;
  if (locale === "de") return title + " - Projektfoto " + photoNumber;
  if (locale === "uk") return title + " - фото реалізації " + photoNumber;
  return title + " - zdjęcie realizacji " + photoNumber;
}

function buildGalleryGroups(locale) {
  return galleryGroupData
    .map(function (group) {
      var title = group.title[locale] || group.title.pl || group.slug;

      return {
        slug: group.slug,
        title: title,
        images: group.files.map(function (image, index) {
          var photoNumber = index + 1;

          return {
            src: resolveAsset("gallery/" + group.slug + "/" + image.file),
            width: image.width,
            height: image.height,
            alt: buildImageAlt(locale, title, photoNumber),
          };
        }),
      };
    })
    .filter(function (group) {
      return group.images.length > 0;
    });
}

window.siteConfig = {
  company: {
    brandName: "Kompleksowe Wykończenia Wnętrz",
    legalName: "Kompleksowe Wykończenia Wnętrz - Daniel Nagórka",
    contactPerson: "Daniel Nagórka",
    nip: "8481803336",
    phoneDisplay: "+48 603 788 778",
    phoneHref: "tel:+48603788778",
    email: "d.nagorka@vp.pl",
    emailHref: "mailto:d.nagorka@vp.pl",
    facebookUrl: "https://facebook.com/wykonczeniaelk",
    facebookPhotosUrl: "https://www.facebook.com/wykonczeniaelk/photos",
    domain: "https://www.wykonczeniawnetrz.elk.pl",
    serviceArea: {
      pl: "Ełk i okolice",
      en: "Ełk and surrounding area",
      de: "Ełk und Umgebung",
      uk: "Елк та околиці",
    },
  },
  galleryMain: {
    pl: buildGalleryMain("pl"),
    en: buildGalleryMain("en"),
    de: buildGalleryMain("de"),
    uk: buildGalleryMain("uk"),
  },
  galleryGroups: {
    pl: buildGalleryGroups("pl"),
    en: buildGalleryGroups("en"),
    de: buildGalleryGroups("de"),
    uk: buildGalleryGroups("uk"),
  },
};
