const EXPECTED_HEADING = 'Welcome to AEM Boilerplate';

// da-nx no longer ships a severity enum (window.qe.customValidation only exposes
// onCustomValidationRequest) -- any non-empty string is valid on the wire, but the
// preflight host we're targeting only renders success/info/warn/error.
const SEVERITY = {
  SUCCESS: 'success', INFO: 'info', WARN: 'warn', ERROR: 'error',
};

function checkHeadingMatches() {
  return [...document.querySelectorAll('main [data-prose-index]')]
    .map((el) => ({ el, heading: el.matches('h1') ? el : el.querySelector('h1') }))
    .filter(({ heading }) => heading)
    .map(({ el, heading }) => {
      const matches = heading.textContent.trim() === EXPECTED_HEADING;
      return {
        severity: matches ? SEVERITY.SUCCESS : SEVERITY.WARN,
        title: 'Heading',
        message: matches
          ? 'Heading matches expected value.'
          : `Heading does not match expected value: "${EXPECTED_HEADING}".`,
        // kind isn't validated by isValidCustomValidationItem, but da-live forwards it
        // through to the doc editor's scroll-to-element, where it upgrades a plain
        // text-selection fallback into a full node highlight for this heading.
        item: { proseIndex: Number(el.getAttribute('data-prose-index')), kind: 'heading' },
      };
    });
}

function findCardsBlocks() {
  return [...document.querySelectorAll('main .cards[data-block-index]')];
}

function checkCardsCountIsEven(cardsBlocks) {
  return cardsBlocks
    .map((block) => {
      const isEven = block.querySelectorAll(':scope > ul > li').length % 2 === 0;
      return {
        severity: isEven ? SEVERITY.SUCCESS : SEVERITY.INFO,
        title: 'Cards',
        message: isEven ? 'Cards block has an even number of cards.' : 'Cards block has an odd number of cards.',
        item: { blockIndex: Number(block.getAttribute('data-block-index')) },
      };
    });
}

export default function registerValidationChecks() {
  if (!window?.qe?.customValidation) return;
  const { onCustomValidationRequest } = window.qe.customValidation;
  onCustomValidationRequest(() => {
    const cardsBlocks = findCardsBlocks();
    // isValidCustomValidationItem requires a blockIndex or proseIndex on every item, so
    // this demo item still needs one even with no cards block on the page -- 0 is a
    // guess in that case, but points at the real cards block whenever one exists.
    const demoBlockIndex = cardsBlocks.length
      ? Number(cardsBlocks[0].getAttribute('data-block-index'))
      : 0;

    return [
      {
        severity: SEVERITY.ERROR,
        title: 'Custom Error',
        message: 'This is a custom validation error.',
        item: { blockIndex: demoBlockIndex },
      },
      ...checkHeadingMatches(),
      ...checkCardsCountIsEven(cardsBlocks),
    ];
  });
}
