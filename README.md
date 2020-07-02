# 🍬🦕 DenoOf 🍬🦕

Syntactic sugar for asynchronous functions, promises, generators and synchronous functions.

Full documentation here - [https://of.js.org/](https://of.js.org/).

If you use this project don't forget to give a ⭐ [star](https://github.com/r37r0m0d3l/denof) ⭐ to it.

•• [DenoOf Documentation](https://of.js.org/) •• [JavaScript Repository](https://github.com/r37r0m0d3l/of) •• [Deno Repository](https://github.com/r37r0m0d3l/denof) ••

[![Buy Me A Coffee][buymeacoffee-img]][buymeacoffee-url]
![Tests](https://github.com/r37r0m0d3l/denof/workflows/Tests/badge.svg)

## 💬 Usage

```typescript
import { ofAnyCase } from "https://deno.land/x/denof/mod.ts";
const promise = () => new Promise((resolve, _reject) => {
  resolve({ data: true });
});
const config = {
  defaults: "🤷 Default value in case of error",
  error: new Error("💀 Custom error, replaces thrown error"),
  retries: 3, // 🔁 Third time's a charm
  timeout: 1000, // ⏱️ Delay before timeout error
};
// no error thrown
const [result, error] = await ofAnyCase(promise(), config);
console.log(result); // { data: true }
console.warn(error); // no error thrown, so it's undefined
```

## Import

### Import from URL

```typescript
import {
  Of, of,
  ofAny, ofAnyCase, ofCase, ofError,
  ofIt, ofOutcome, ofResult, ofSync
} from "https://deno.land/x/denof/mod.ts";
```

### Bundled from URL

```typescript
import {
  Of, of,
  ofAny, ofAnyCase, ofCase, ofError,
  ofIt, ofOutcome, ofResult, ofSync
} from "https://deno.land/x/denof/denof.bundle.js";
```

### Inline

#### Raw

```javascript
import { of } from "https://deno.land/x/denof/mod.ts";
```

#### Bundle

```javascript
import { of } from "https://deno.land/x/denof/denof.bundle.js";
```

### "importmap.json"

#### GitHub

```json
{
  "imports": {
    "of": "https://raw.githubusercontent.com/r37r0m0d3l/denof/master/mod.ts"
  }
}
```

#### DenoLand

```json
{
  "imports": {
    "of": "https://deno.land/x/denof/mod.ts"
  }
}
```

### Import

Shortcut:

```typescript
import {
  Of, of,
  ofAny, ofAnyCase, ofCase, ofError,
  ofIt, ofOutcome, ofResult, ofSync
} from "of";
```

Run:

```bash
deno run --importmap=importmap.json --unstable your-script.js
```

## 🗺️ Discover more

[My other projects](https://r37r0m0d3l.icu/open_source_map)

<img src="https://raw.githubusercontent.com/r37r0m0d3l/r37r0m0d3l/master/osmap.svg?sanitize=true" width="960" height="520" style="display:block;height:auto;margin-left:auto;margin-right:auto;min-height:520px;min-width:960px;width:100%;">

<!-- Badges -->

[buymeacoffee-url]: https://buymeacoffee.com/r37r0m0d3l
[buymeacoffee-img]: https://img.shields.io/badge/support-buymeacoffee-1E90FF.svg?&logo=buy-me-a-coffee&label=support
