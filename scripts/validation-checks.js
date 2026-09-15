const EXPECTED_HEADING = 'Welcome to AEM Boilerplate';

function checkHeadingMatches(VALIDATION_SEVERITY) {
  return [...document.querySelectorAll('main [data-prose-index]')]
    .map((el) => ({ el, heading: el.matches('h1') ? el : el.querySelector('h1') }))
    .filter(({ heading }) => heading && heading.textContent.trim() !== EXPECTED_HEADING)
    .map(({ el }) => ({
      severity: VALIDATION_SEVERITY.WARN,
      title: 'Heading',
      message: `Heading does not match expected value: "${EXPECTED_HEADING}".`,
      item: { proseIndex: Number(el.getAttribute('data-prose-index')) },
    }));
}

function checkCardsCountIsEven(VALIDATION_SEVERITY) {
  return [...document.querySelectorAll('main .cards[data-block-index]')]
    .map((block) => {
      const isEven = block.querySelectorAll(':scope > ul > li').length % 2 === 0;
      return {
        severity: isEven ? VALIDATION_SEVERITY.INFO : VALIDATION_SEVERITY.WARN,
        title: 'Cards',
        message: isEven ? 'Cards block has an even number of cards.' : 'Cards block has an odd number of cards.',
        item: { blockIndex: Number(block.getAttribute('data-block-index')) },
      };
    });
}

export default function registerValidationChecks() {
  if (!window?.qe?.validation) return;
  const { onValidationRequest, VALIDATION_SEVERITY } = window.qe.validation;
  onValidationRequest(() => [
    {
      severity: VALIDATION_SEVERITY.ERROR,
      title: 'Custom Error',
      message: 'This is a custom validation error.',
      item: { blockIndex: 0 },
    },
    ...checkHeadingMatches(VALIDATION_SEVERITY),
    ...checkCardsCountIsEven(VALIDATION_SEVERITY),
  ]);
}
