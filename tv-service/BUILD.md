# Build Configuration for LG WebOS TV

## Overview
This service is built to run on LG WebOS TVs which use an older Node.js runtime:
- **Node.js version**: v0.12.2
- **OpenSSL version**: 1.0.2p
- **Target ES version**: ES5

## TypeScript Configuration
The `tsconfig.json` is configured to transpile TypeScript to ES5:

```json
{
  "compilerOptions": {
    "target": "es5",           // Critical for WebOS TV compatibility
    "module": "commonjs",      // CommonJS modules
    "lib": ["es5", "dom"],     // ES5 standard library
    "outDir": "dist",
    ...
  }
}
```

## Build Scripts

### `npm run build`
Compiles all TypeScript files from `src/` to ES5 JavaScript in `dist/`

### `npm run build:test`
Builds and runs the network test

### `npm test`
Runs the compiled network test (`dist/test_https.js`)

## ES5 Output Examples

### Input (TypeScript):
```typescript
const request = (options: RequestOptions) => {
  const result = `${options.hostname}${options.path}`;
  return result;
}
```

### Output (ES5 JavaScript):
```javascript
var request = function(options) {
  var result = "".concat(options.hostname).concat(options.path);
  return result;
}
```

## Key ES5 Transformations
- `const`/`let` → `var`
- Arrow functions → `function` expressions
- Template literals → `.concat()` or string concatenation
- Classes → Constructor functions with prototypes
- Destructuring → Explicit variable assignments

## Docker Multi-Stage Build

The Dockerfile uses a 3-stage build process:

1. **Stage 1 (base-runtime)**: Builds Node.js v0.12.2 with OpenSSL 1.0.2p
2. **Stage 2 (builder)**: Uses modern Node.js 24 to compile TypeScript to ES5
3. **Stage 3 (final)**: Copies ES5 JavaScript into the v0.12.2 runtime

This ensures compatibility while maintaining modern development tools.

## Verification

To verify ES5 output, check the transpiled files:
```bash
cd tv-service
npm run build
head -30 dist/test_https.js
```

Look for:
- `var` declarations (not `const`/`let`)
- `function` keyword (not arrow functions)
- `.concat()` for string concatenation (not template literals)
- CommonJS `require()` and `exports` (not ES6 `import`/`export`)

