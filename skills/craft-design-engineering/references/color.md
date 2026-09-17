# Color

## Noise

> Grain hides banding and adds texture.

- Section: Color
- URL: https://craft.gustavofior.com/noise
- Published: 2026-07-15
- Source: https://github.com/gustavo-fior/craft/blob/main/content/color/noise.mdx

When the UI feels too flat, sometimes I like to add noise to some components to give them some texture.

**Noise** is a layer of random light and dark pixels laid over the surface. It breaks the steps up and gives the color some texture.

> **Interactive demo: Noise.** Open https://craft.gustavofior.com/noise to try it.

### Grain size

The `baseFrequency` attribute controls how fine the noise is. Low values give big soft blobs, whle high values give the tight speckle of film grain.

> **Interactive demo: Noise Frequency.** Open https://craft.gustavofior.com/noise to try it.

### Usage

Put the filter in one SVG anywhere on the page, then reference it from an overlay. The overlay is an empty element, so it costs nothing in markup and can be dropped onto any positioned container.

**Tailwind**

```html
<svg class="absolute size-0" aria-hidden="true">
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
    <feColorMatrix type="saturate" values="0" />
  </filter>
</svg>

<div class="relative isolate overflow-hidden rounded-2xl bg-violet-600">
  <div class="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay filter-[url(#grain)]" aria-hidden="true"></div>
  <!-- content -->
</div>
```

**CSS**

```css
.surface {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.surface::after {
content: "";
position: absolute;
inset: 0;
filter: url(#grain);
opacity: 0.08;
mix-blend-mode: overlay;
pointer-events: none;
}
```

The `isolate` on the container matters. Without it, `mix-blend-mode` blends the grain with everything behind the card, including the page background, and the effect changes depending on where the card sits. With it, the grain only ever blends with the surface it belongs to.

### Resources

- [feTurbulence](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence): The SVG filter primitive that generates the noise. Everything here is built on it.
- [Grainy Gradients](https://css-tricks.com/grainy-gradients/): A thorough walkthrough of noise on gradients, with the color matrix tricks explained.
- [mix-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode): How the grain layer combines with the color underneath it.


## Image Outlines

> A faint inner edge that frames images.

- Section: Color
- URL: https://craft.gustavofior.com/image-outlines
- Published: 2026-07-15
- Source: https://github.com/gustavo-fior/craft/blob/main/content/color/image-outlines.mdx

Images do not know what is behind them. A pale sky on a white card has no
edge at all, and a photo with a bright corner blends into the page.

An **inset outline** fixes that with one line, drawn just inside the image at
around 10% opacity.

The outline's visibility can vary based on light or dark mode and the image content.

> **Interactive demo: Image Outline.** Open https://craft.gustavofior.com/image-outlines to try it.

The line is too faint to read as a border. What you notice instead is that
every image suddenly has a shape.

I basically learned this trick from
[Jakub](https://jakub.kr/writing/details-that-make-interfaces-feel-better).
It is one of those details you cannot unsee once someone points it out.

### Why not a border

A `border` sits between the padding and the margin, so it takes up space.
Adding one pushes content around and changes the size of the box.

**Paint the line over the image, not around it.** An `outline` with a
negative `outline-offset`, or an inset `box-shadow`, sits on top of the
outermost pixels.

### How strong

Ten percent is a good default, but I like to tune it differently for light and dark mode sometimes.

> **Interactive demo: Image Outline Strength.** Open https://craft.gustavofior.com/image-outlines to try it.

Below about 5% the line disappears against the pale sky. Above about 20%
it starts to look like a frame, and the eye reads it as a design element
instead of a fix. Stay in between.

### Avatars

Avatars are where this matters most. They are small, round, and often mostly
white: an initial on a light background, a pale logo, a photo of someone
against a wall. Without an edge they float on the surface.

> **Interactive demo: Image Outline Avatar.** Open https://craft.gustavofior.com/image-outlines to try it.

### Usage

Set the outline color per theme. Black at 10% on light, white at 10% on dark.

**Tailwind**

```html
<img
  class="rounded-lg outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
  src="/cover.jpg"
  alt="Album cover"
/>
```

**CSS**

```css
img {
  border-radius: 8px;
  outline: 1px solid rgb(0 0 0 / 0.1);
  outline-offset: -1px;
}

.dark img {
outline-color: rgb(255 255 255 / 0.1);
}
```

### Resources

- [Details that make interfaces feel better](https://jakub.kr/writing/details-that-make-interfaces-feel-better): Jakub Krehel's list of small touches, including the inset image outline this page is about.
- [outline-offset](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-offset): The property that pulls an outline inside the box instead of around it.
- [box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow): The inset form is the other way to draw the same line, with full support for rounded corners.
- [color-mix()](https://developer.mozilla.org/en-US/docs/Web/CSS/color-mix): Handy for mixing the outline color into the current text color so it adapts to any theme.
