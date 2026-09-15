// TEMP: da-nx's validation.js is only on the `valapi` branch so far — switch to
// https://da.live/nx/public/plugins/quick-edit/validation.js once that merges to main.
// eslint-disable-next-line import/no-unresolved
import { onValidationRequest, VALIDATION_SEVERITY } from 'https://valapi--da-nx--adobe.aem.live/nx/public/plugins/quick-edit/validation.js';

const MAX_HEADING_LENGTH = 70;

function checkMissingAltText() {
  return [...document.querySelectorAll('main [data-image-index]')]
    .map((el) => ({ el, img: el.matches('img') ? el : el.querySelector('img') }))
    .filter(({ img }) => img && !img.alt)
    .map(({ el }) => ({
      severity: VALIDATION_SEVERITY.ERROR,
      message: 'Image is missing alt text.',
      item: { proseIndex: Number(el.getAttribute('data-image-index')) },
    }));
}

function checkLongHeadings() {
  return [...document.querySelectorAll('main [data-prose-index]')]
    .filter((el) => /^H[1-6]$/.test(el.tagName) && el.textContent.trim().length > MAX_HEADING_LENGTH)
    .map((el) => ({
      severity: VALIDATION_SEVERITY.WARN,
      message: `Heading is longer than ${MAX_HEADING_LENGTH} characters.`,
      item: { proseIndex: Number(el.getAttribute('data-prose-index')) },
    }));
}

function checkCardsHaveImages() {
  return [...document.querySelectorAll('main .cards[data-block-index]')]
    .filter((block) => [...block.querySelectorAll(':scope > ul > li')]
      .some((card) => !card.querySelector('.cards-card-image img')))
    .map((block) => ({
      severity: VALIDATION_SEVERITY.ERROR,
      message: 'Cards block has a card with no image.',
      item: { blockIndex: Number(block.getAttribute('data-block-index')) },
    }));
}

export default function registerValidationChecks() {
  onValidationRequest('validation-demo', () => [
    ...checkMissingAltText(),
    ...checkLongHeadings(),
    ...checkCardsHaveImages(),
  ]);
}
