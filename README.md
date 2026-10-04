# The BCS Team website

Static site: plain HTML, CSS and JavaScript. No build step. Open `index.html` in a browser or upload the folder to any web host.

## Pages
- `index.html`: home
- `capabilities.html`: the four service pillars, engagement models, NAICS codes
- `federal.html`: entity data, past performance, CMMC readiness posture, partners, credentials
- `community.html`: Bright Community Solutions, Inc. and Good Health WINs San Antonio
- `about.html`: story, leadership, values, entity separation
- `contact.html`: contact details and inquiry form

## Assets
- `assets/css/styles.css`: all styles (colors and fonts are CSS variables at the top)
- `assets/js/main.js`: mobile menu, scroll reveal, number counters, contact form
- `assets/img/`: logos and photos reused from the old site and the capability statement
- `assets/docs/BCS-Capability-Statement.pdf`: the v9.3 capability statement, linked site-wide

## Notes
- The header and footer are copied into every page. When you change the menu or contact details, update all six files.
- The contact form is currently hidden (`hidden` attribute in `contact.html`) pending a decision on how submissions should be handled. When restored, it has no server: it validates the fields, then opens the visitor's email app addressed to ron@bcsteam.net. To receive submissions directly, point the form at a form service such as Formspree or Netlify Forms.
- Contact-page links can preselect the inquiry type, e.g. `contact.html?topic=Teaming%20partner`.
