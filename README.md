# validation-demo
Demo/verification project for da-nx's content-validation request/response API
(`window.qe.validation`, see `scripts/validation-checks.js`). Exercises
`onValidationRequest`/`VALIDATION_SEVERITY` end-to-end as a real customer project would.

## Testing against an unmerged da-nx branch

`quick-edit.js` is injected onto this page by an external snippet (appended to
`scripts.js` at build/deploy time) that always imports it from
`https://da.live/nx/public/plugins/quick-edit/quick-edit.js` — hardcoded, no
branch-selecting query param. To exercise changes on a da-nx branch that hasn't
merged yet (e.g. `valapi`), use Chrome DevTools Local Overrides:

1. DevTools → **Sources** tab → **Overrides** → "Select folder for overrides" → pick
   any local folder → Allow.
2. Load this page with quick-edit active once, so
   `https://da.live/nx/public/plugins/quick-edit/quick-edit.js` shows up in
   Sources/Network.
3. Right-click that request → **Override content** (or "Save for overrides").
4. Replace the saved local copy's entire content with a one-line re-export shim
   pointing at the branch:
   ```js
   export { default } from 'https://<branch>--da-nx--adobe.aem.live/nx/public/plugins/quick-edit/quick-edit.js';
   ```
   Since the real `quick-edit.js` on that branch resolves its own relative imports
   (`./validation.js`, `../../../utils/allowed-da-live-origins.js`, etc.) against its
   own URL, the whole dependency graph loads from the branch automatically — no other
   files need overriding.
5. Reload.

Separately, da-live's own canvas app resolves which da-nx branch *it* imports from via
the `?nx=<branch>` query param (e.g. `...canvas?nx=valapi#/...`) — unrelated to the
override above, but needed too if testing host-side changes on the same branch.

## Environments
- Preview: https://main--{repo}--{owner}.aem.page/
- Live: https://main--{repo}--{owner}.aem.live/

## Documentation

Before using the aem-boilerplate, we recommand you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)
