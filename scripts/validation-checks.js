const MAX_HEADING_LENGTH = 70;

function checkMissingAltText(VALIDATION_SEVERITY) {
  return [...document.querySelectorAll('main [data-image-index]')]
    .map((el) => ({ el, img: el.matches('img') ? el : el.querySelector('img') }))
    .filter(({ img }) => img && !img.alt)
    .map(({ el }) => ({
      severity: VALIDATION_SEVERITY.ERROR,
      message: 'Image is missing alt text.',
      item: { proseIndex: Number(el.getAttribute('data-image-index')) },
    }));
}

function checkLongHeadings(VALIDATION_SEVERITY) {
  return [...document.querySelectorAll('main [data-prose-index]')]
    .filter((el) => /^H[1-6]$/.test(el.tagName) && el.textContent.trim().length > MAX_HEADING_LENGTH)
    .map((el) => ({
      severity: VALIDATION_SEVERITY.WARN,
      message: `Heading is longer than ${MAX_HEADING_LENGTH} characters.`,
      item: { proseIndex: Number(el.getAttribute('data-prose-index')) },
    }));
}

function checkCardsHaveImages(VALIDATION_SEVERITY) {
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
  if (!window?.qe?.validation) return;
  const { onValidationRequest, VALIDATION_SEVERITY } = window.qe.validation;
  onValidationRequest(() => [
    ...checkMissingAltText(VALIDATION_SEVERITY),
    ...checkLongHeadings(VALIDATION_SEVERITY),
    ...checkCardsHaveImages(VALIDATION_SEVERITY),
  ]);
}
