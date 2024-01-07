# pngme-ts

Typescript implementation of https://jrdngr.github.io/pngme_book/introduction.html

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

To run test:

```bash
bun test
```

TO RUN FROM BUN ENV

```bash
bun run index.ts print ./test-icon.png
```

```bash
bun run index.ts encode ./test-icon.png-copy.png ruSt "My secret message!"
```

```bash
bun run index.ts decode ./test-icon.png-copy.png ruSt
```

```bash
bun run index.ts remove ./test-icon.png-copy.png ruSt
```
