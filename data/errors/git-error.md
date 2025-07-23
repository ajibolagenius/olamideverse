> git -c user.useConfigOnly=true commit --quiet --allow-empty-message --file -
🔍 Running ESLint...

> olamideverse@0.1.0 lint
> next lint


./src/app/albums/[id]/page.tsx
43:50  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities

./src/components/story/__tests__/MDXContent.test.tsx
97:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

./src/hooks/useAlbumFilters.ts
5:6  Warning: 'FilterOption' is defined but never used. Allowed unused vars must match /^_/u.  @typescript-eslint/no-unused-vars

info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
🔍 Running TypeScript check...
src/components/story/__tests__/MDXContent.a11y.test.tsx(3,41): error TS2307: Cannot find module 'jest-axe' or its corresponding type declarations.
src/components/story/__tests__/MDXContent.a11y.test.tsx(7,1): error TS2304: Cannot find name 'expect'.
src/components/story/__tests__/MDXContent.a11y.test.tsx(10,1): error TS2304: Cannot find name 'jest'.
src/components/story/__tests__/MDXContent.a11y.test.tsx(18,1): error TS2304: Cannot find name 'jest'.
src/components/story/__tests__/MDXContent.a11y.test.tsx(25,1): error TS2582: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.
src/components/story/__tests__/MDXContent.a11y.test.tsx(26,5): error TS2582: Cannot find name 'it'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.
src/components/story/__tests__/MDXContent.a11y.test.tsx(37,9): error TS2304: Cannot find name 'expect'.
src/components/story/__tests__/MDXContent.a11y.test.tsx(40,5): error TS2582: Cannot find name 'it'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.
src/components/story/__tests__/MDXContent.a11y.test.tsx(45,21): error TS2339: Property 'components' does not exist on type '{}'.
src/components/story/__tests__/MDXContent.a11y.test.tsx(52,21): error TS2339: Property 'components' does not exist on type '{}'.
src/components/story/__tests__/MDXContent.a11y.test.tsx(72,9): error TS2304: Cannot find name 'expect'.
src/components/story/__tests__/MDXContent.a11y.test.tsx(75,5): error TS2582: Cannot find name 'it'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.
src/components/story/__tests__/MDXContent.a11y.test.tsx(79,21): error TS2339: Property 'components' does not exist on type '{}'.
src/components/story/__tests__/MDXContent.a11y.test.tsx(86,21): error TS2339: Property 'components' does not exist on type '{}'.
src/components/story/__tests__/MDXContent.a11y.test.tsx(102,9): error TS2304: Cannot find name 'expect'.
src/components/story/__tests__/MDXContent.test.tsx(4,10): error TS2305: Module '"@mdx-js/react"' has no exported member 'MDXContext'.
src/components/story/__tests__/MDXContent.test.tsx(7,1): error TS2304: Cannot find name 'jest'.
src/components/story/__tests__/MDXContent.test.tsx(15,1): error TS2304: Cannot find name 'jest'.
src/components/story/__tests__/MDXContent.test.tsx(23,1): error TS2304: Cannot find name 'jest'.
src/components/story/__tests__/MDXContent.test.tsx(24,28): error TS2304: Cannot find name 'jest'.
src/components/story/__tests__/MDXContent.test.tsx(35,29): error TS2322: Type 'unknown' is not assignable to type 'ReactNode'.
src/components/story/__tests__/MDXContent.test.tsx(37,28): error TS2322: Type 'unknown' is not assignable to type 'ReactNode'.
src/components/story/__tests__/MDXContent.test.tsx(38,28): error TS2322: Type 'unknown' is not assignable to type 'ReactNode'.
src/components/story/__tests__/MDXContent.test.tsx(47,25): error TS2322: Type 'unknown' is not assignable to type 'ReactNode'.
src/components/story/__tests__/MDXContent.test.tsx(57,29): error TS2322: Type 'unknown' is not assignable to type 'ReactNode'.
src/components/story/__tests__/MDXContent.test.tsx(59,28): error TS2322: Type 'unknown' is not assignable to type 'ReactNode'.
src/components/story/__tests__/MDXContent.test.tsx(67,1): error TS2582: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.
src/components/story/__tests__/MDXContent.test.tsx(68,5): error TS2582: Cannot find name 'it'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.
src/components/story/__tests__/MDXContent.test.tsx(77,9): error TS2304: Cannot find name 'expect'.
src/components/story/__tests__/MDXContent.test.tsx(80,5): error TS2582: Cannot find name 'it'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.
src/components/story/__tests__/MDXContent.test.tsx(89,9): error TS2304: Cannot find name 'expect'.
src/components/story/__tests__/MDXContent.test.tsx(90,9): error TS2304: Cannot find name 'expect'.
src/components/story/__tests__/MDXContent.test.tsx(91,9): error TS2304: Cannot find name 'expect'.
src/components/story/__tests__/MDXContent.test.tsx(94,5): error TS2582: Cannot find name 'it'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.
src/components/story/__tests__/MDXContent.test.tsx(103,9): error TS2304: Cannot find name 'expect'.
src/components/story/__tests__/MDXContent.test.tsx(106,5): error TS2582: Cannot find name 'it'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.
src/components/story/__tests__/MDXContent.test.tsx(109,21): error TS2339: Property 'components' does not exist on type 'ServerContextJSONValue'.
src/components/story/__tests__/MDXContent.test.tsx(122,9): error TS2304: Cannot find name 'expect'.
src/components/story/__tests__/MDXContent.test.tsx(123,9): error TS2304: Cannot find name 'expect'.
src/components/story/__tests__/MDXContent.test.tsx(126,5): error TS2582: Cannot find name 'it'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.
src/components/story/__tests__/MDXContent.test.tsx(128,21): error TS2339: Property 'components' does not exist on type 'ServerContextJSONValue'.
src/components/story/__tests__/MDXContent.test.tsx(133,21): error TS2339: Property 'components' does not exist on type 'ServerContextJSONValue'.
src/components/story/__tests__/MDXContent.test.tsx(147,9): error TS2304: Cannot find name 'expect'.
src/components/story/__tests__/MDXContent.test.tsx(150,9): error TS2304: Cannot find name 'expect'.
src/components/story/MDXContent.tsx(1,23): error TS2724: '"@mdx-js/react"' has no exported member named 'MDXComponents'. Did you mean 'useMDXComponents'?
src/components/story/MDXContent.tsx(20,14): error TS7006: Parameter 'props' implicitly has an 'any' type.
src/components/story/MDXContent.tsx(21,14): error TS7006: Parameter 'props' implicitly has an 'any' type.
src/components/story/MDXContent.tsx(22,14): error TS7006: Parameter 'props' implicitly has an 'any' type.
src/components/story/MDXContent.tsx(23,14): error TS7006: Parameter 'props' implicitly has an 'any' type.
src/components/story/MDXContent.tsx(24,13): error TS7006: Parameter 'props' implicitly has an 'any' type.
src/components/story/MDXContent.tsx(25,13): error TS7006: Parameter 'props' implicitly has an 'any' type.
src/components/story/MDXContent.tsx(53,14): error TS7006: Parameter 'props' implicitly has an 'any' type.
src/components/story/MDXContent.tsx(54,14): error TS7006: Parameter 'props' implicitly has an 'any' type.
src/components/story/MDXContent.tsx(55,14): error TS7006: Parameter 'props' implicitly has an 'any' type.
src/components/story/MDXContent.tsx(56,22): error TS7006: Parameter 'props' implicitly has an 'any' type.
src/components/story/MDXContent.tsx(59,15): error TS7006: Parameter 'props' implicitly has an 'any' type.
src/components/story/MDXContent.tsx(85,21): error TS7006: Parameter 'props' implicitly has an 'any' type.
src/components/story/MDXContent.tsx(108,26): error TS7006: Parameter 'props' implicitly has an 'any' type.
src/components/story/MDXContent.tsx(120,17): error TS7006: Parameter 'props' implicitly has an 'any' type.
src/components/story/MDXContent.tsx(131,20): error TS7006: Parameter 'props' implicitly has an 'any' type.
src/components/story/MDXContent.tsx(140,25): error TS7006: Parameter 'props' implicitly has an 'any' type.
src/components/ui/__tests__/AlbumGrid.test.tsx(9,1): error TS2304: Cannot find name 'jest'.
src/components/ui/__tests__/AlbumGrid.test.tsx(10,18): error TS2304: Cannot find name 'jest'.
src/components/ui/__tests__/AlbumGrid.test.tsx(13,1): error TS2304: Cannot find name 'jest'.
src/components/ui/__tests__/AlbumGrid.test.tsx(14,22): error TS2304: Cannot find name 'jest'.
src/components/ui/__tests__/AlbumGrid.test.tsx(17,1): error TS2582: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.
src/components/ui/__tests__/AlbumGrid.test.tsx(18,5): error TS2304: Cannot find name 'beforeEach'.
src/components/ui/__tests__/AlbumGrid.test.tsx(20,25): error TS2503: Cannot find namespace 'jest'.
src/components/ui/__tests__/AlbumGrid.test.tsx(28,29): error TS2503: Cannot find namespace 'jest'.
src/components/ui/__tests__/AlbumGrid.test.tsx(37,30): error TS2304: Cannot find name 'jest'.
src/components/ui/__tests__/AlbumGrid.test.tsx(38,31): error TS2304: Cannot find name 'jest'.
src/components/ui/__tests__/AlbumGrid.test.tsx(39,29): error TS2304: Cannot find name 'jest'.
src/components/ui/__tests__/AlbumGrid.test.tsx(40,30): error TS2304: Cannot find name 'jest'.
src/components/ui/__tests__/AlbumGrid.test.tsx(45,5): error TS2582: Cannot find name 'it'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.
src/components/ui/__tests__/AlbumGrid.test.tsx(47,25): error TS2503: Cannot find namespace 'jest'.
src/components/ui/__tests__/AlbumGrid.test.tsx(58,9): error TS2304: Cannot find name 'expect'.
src/components/ui/__tests__/AlbumGrid.test.tsx(61,5): error TS2582: Cannot find name 'it'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.
src/components/ui/__tests__/AlbumGrid.test.tsx(63,25): error TS2503: Cannot find namespace 'jest'.
src/components/ui/__tests__/AlbumGrid.test.tsx(74,9): error TS2304: Cannot find name 'expect'.
src/components/ui/__tests__/AlbumGrid.test.tsx(77,5): error TS2582: Cannot find name 'it'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.
src/components/ui/__tests__/AlbumGrid.test.tsx(81,9): error TS2304: Cannot find name 'expect'.
src/components/ui/__tests__/AlbumGrid.test.tsx(82,9): error TS2304: Cannot find name 'expect'.
src/components/ui/__tests__/AlbumGrid.test.tsx(83,9): error TS2304: Cannot find name 'expect'.
src/components/ui/__tests__/AlbumGrid.test.tsx(84,9): error TS2304: Cannot find name 'expect'.
src/components/ui/__tests__/AlbumGrid.test.tsx(87,5): error TS2582: Cannot find name 'it'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.
src/components/ui/__tests__/AlbumGrid.test.tsx(89,29): error TS2503: Cannot find namespace 'jest'.
src/components/ui/__tests__/AlbumGrid.test.tsx(98,30): error TS2304: Cannot find name 'jest'.
src/components/ui/__tests__/AlbumGrid.test.tsx(99,31): error TS2304: Cannot find name 'jest'.
src/components/ui/__tests__/AlbumGrid.test.tsx(100,29): error TS2304: Cannot find name 'jest'.
src/components/ui/__tests__/AlbumGrid.test.tsx(101,30): error TS2304: Cannot find name 'jest'.
src/components/ui/__tests__/AlbumGrid.test.tsx(108,9): error TS2304: Cannot find name 'expect'.
src/components/ui/__tests__/AlbumGrid.test.tsx(109,9): error TS2304: Cannot find name 'expect'.
❌ TypeScript check failed. Please fix the issues and try again.
husky - pre-commit script failed (code 1)
