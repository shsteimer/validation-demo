const EXPECTED_HEADING = 'Welcome to AEM Boilerplate';

function checkHeadingMatches(VALIDATION_SEVERITY) {
  return [...document.querySelectorAll('main [data-prose-index]')]
    .filter((el) => el.tagName === 'H1' && el.textContent.trim() !== EXPECTED_HEADING)
    .map((el) => ({
      severity: VALIDATION_SEVERITY.WARN,
      message: `Heading does not match expected value: "${EXPECTED_HEADING}".`,
      item: { proseIndex: Number(el.getAttribute('data-prose-index')) },
    }));
}

function checkCardsCountIsEven(VALIDATION_SEVERITY) {
  return [...document.querySelectorAll('main .cards[data-block-index]')]
    .filter((block) => block.querySelectorAll(':scope > ul > li').length % 2 !== 0)
    .map((block) => ({
      severity: VALIDATION_SEVERITY.WARN,
      message: 'Cards block has an odd number of cards.',
      item: { blockIndex: Number(block.getAttribute('data-block-index')) },
    }));
}

export default function registerValidationChecks() {
  if (!window?.qe?.validation) return;
  const { onValidationRequest, VALIDATION_SEVERITY } = window.qe.validation;
  onValidationRequest(() => [
    {
      severity: VALIDATION_SEVERITY.ERROR,
      message: 'This is a custom validation error.',
      item: { blockIndex: 0 },
    },
    ...checkHeadingMatches(VALIDATION_SEVERITY),
    ...checkCardsCountIsEven(VALIDATION_SEVERITY),
  ]);
}
