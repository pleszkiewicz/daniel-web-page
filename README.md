# Kompleksowe Wykończenia Wnętrz - strona statyczna

To jest statyczna wersja strony dla Daniela Nagórki. Nie wymaga Node.js, Next.js ani procesu budowania.

## Uruchomienie

Najprościej otworzyć plik `index.html` w przeglądarce.

Do sprawdzenia PWA, service workera i ścieżek zaczynających się od `/` użyj lokalnego serwera:

```bash
python3 -m http.server 8080
```

Następnie otwórz:

```text
http://localhost:8080
```

Wersje językowe są pod:

```text
http://localhost:8080/en/
http://localhost:8080/de/
http://localhost:8080/uk/
```

Galerie są pod:

```text
http://localhost:8080/galleries/index.html
http://localhost:8080/en/galleries/index.html
http://localhost:8080/de/galleries/index.html
http://localhost:8080/uk/galleries/index.html
```

## Struktura

- `index.html` - polska strona główna
- `en/index.html` - wersja angielska
- `de/index.html` - wersja niemiecka
- `uk/index.html` - wersja ukraińska
- `galleries/index.html` - polska podstrona galerii
- `en/galleries/index.html` - angielska podstrona galerii
- `de/galleries/index.html` - niemiecka podstrona galerii
- `uk/galleries/index.html` - ukraińska podstrona galerii
- `assets/styles.css` - cały styl strony i tokeny projektu
- `assets/app.js` - menu mobilne, sticky header, galeria, lightbox, PWA
- `assets/config.js` - podstawowe dane firmy, galerie i lokalizowane nazwy galerii
- `assets/brand/logo.jpg` - logo
- `assets/icons/` - ikony PWA
- `gallery/` - katalog na prawdziwe zdjęcia realizacji
- `manifest.webmanifest`, `sw.js`, `offline.html` - PWA
- `robots.txt`, `sitemap.xml` - SEO
- `archive-nextjs/` - poprzednia wersja projektu w Next.js

## Edycja danych firmy

Dane kontaktowe są w `assets/config.js`.

Najważniejsze pola:

```js
contactPerson: "Daniel Nagórka",
phoneDisplay: "603 788 778",
phoneHref: "tel:603788778",
email: "d.nagorka@vp.pl",
facebookUrl: "https://facebook.com/wykonczeniaelk",
facebookPhotosUrl: "https://www.facebook.com/wykonczeniaelk/photos",
serviceArea: {
  pl: "Ełk i okolice",
  en: "Ełk and surrounding area",
  de: "Ełk und Umgebung",
  uk: "Елк та околиці",
}
```

Po zmianie domeny zaktualizuj też canonical i Open Graph w plikach językowych HTML, `robots.txt` i `sitemap.xml`.

## Dodawanie zdjęć do galerii

Facebook nie udostępnia pełnej listy zdjęć realizacji publicznie bez logowania. Żeby użyć zdjęć z profilu firmy, pobierz je z:

```text
https://www.facebook.com/wykonczeniaelk/photos
```

Następnie:

1. Dodaj pobrane zdjęcia do katalogu tematycznego w `gallery/`, np. `gallery/rooms/`.
2. Uzupełnij tablicę `galleryGroupData` w `assets/config.js`.
3. W polu `slug` podaj nazwę katalogu, a w `title.pl`, `title.en`, `title.de` i `title.uk` widoczne nazwy galerii.

Przykład:

```js
{
  slug: "bathrooms",
  title: { pl: "Łazienki", en: "Bathrooms", de: "Bäder", uk: "Ванні кімнати" },
  files: [
    { file: "photo001.jpg", width: 1200, height: 900 },
    { file: "photo002.jpg", width: 1200, height: 900 },
  ],
}
```

Strona główna może pokazać jedno zdjęcie wyróżniające z `gallery/main.jpg`. Jeżeli plik nie istnieje, zdjęcie nie jest wyświetlane.

Jeżeli grupa nie ma zdjęć w konfiguracji, nie pojawi się na podstronie galerii.

## Kontakt

Na stronie nie ma formularza kontaktowego. Dzięki temu nie jest potrzebny żaden zewnętrzny serwis formularzy ani backend. Kontakt działa przez linki telefonu, e-maila i Facebooka.

## Wdrożenie

Na standardowym hostingu wgraj zawartość tego katalogu głównego:

```text
index.html
en/
de/
uk/
galleries/
assets/
gallery/
favicon.ico
manifest.webmanifest
sw.js
offline.html
robots.txt
sitemap.xml
```

Nie trzeba instalować zależności ani uruchamiać builda.
