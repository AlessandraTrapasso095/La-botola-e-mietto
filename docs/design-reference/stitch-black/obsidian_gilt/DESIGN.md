---
name: Obsidian & Gilt
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#20201f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#c7c6c4'
  on-secondary: '#303130'
  secondary-container: '#464746'
  on-secondary-container: '#b5b5b3'
  tertiary: '#ffc390'
  on-tertiary: '#4c2700'
  tertiary-container: '#f5a050'
  on-tertiary-container: '#6a3900'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e3e2e0'
  secondary-fixed-dim: '#c7c6c4'
  on-secondary-fixed: '#1b1c1b'
  on-secondary-fixed-variant: '#464746'
  tertiary-fixed: '#ffdcc1'
  tertiary-fixed-dim: '#ffb779'
  on-tertiary-fixed: '#2e1500'
  on-tertiary-fixed-variant: '#6c3a00'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353535'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 4.5rem
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 3rem
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 2rem
    fontWeight: '500'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 1.5rem
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Manrope
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The design system is rooted in the concept of "Curation in the Shadows." It evokes the atmosphere of a high-end, private lounge—sophisticated, quiet, and profoundly exclusive. The aesthetic avoids the harshness of pure black, opting instead for a layered "Matte Luxury" style that uses soft gradients and subtle textures to create depth.

The UI targets a discerning audience that appreciates the slow pace of luxury. It prioritizes high-quality imagery, generous negative space, and cinematic transitions. The visual language is a blend of **Minimalism** and **Tonal Layering**, ensuring that every interaction feels deliberate and premium.

## Colors

This design system utilizes a palette of deep, desaturated tones punctuated by warm, metallic highlights. 

- **Primary (Champagne Gold):** Used sparingly for high-intent actions and critical highlights. It is a soft, muted gold rather than a bright yellow.
- **Secondary (Ivory):** The primary color for typography and icons to ensure legibility while maintaining a soft, antique feel.
- **Tertiary (Bronze/Amber):** Used for interactive states, subtle accents, and to evoke the warmth of aged spirits.
- **Surface Palette:**
    - **Base:** A deep matte charcoal (#121212).
    - **Surface:** Graphite layers (#1C1C1C) for cards and containers.
    - **Contrast:** Deep warm gray (#2D2D2D) for borders and subtle separation.

## Typography

Typography is the primary vehicle for the brand’s "literary" luxury. We use a high-contrast serif for headings to establish authority and a modern, geometric sans-serif for body copy to ensure effortless readability on digital screens.

- **Headlines:** Set in Playfair Display. Use tight letter spacing for large display sizes to create a cinematic impact.
- **Body:** Set in Manrope. Increased line-height is essential to maintain the "airy" feel of luxury despite the dark background.
- **Labels:** Always uppercase with tracking set to 5% to evoke a sense of premium architectural signage.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** on desktop to maintain a boutique, curated feel, preventing the content from feeling "stretched" or institutional. 

- **Desktop:** 12-column grid with generous 64px outer margins. Use offset layouts (e.g., content spanning columns 2-10) to create a more editorial, asymmetrical look.
- **Mobile:** 4-column grid with 20px margins. 
- **Rhythm:** We utilize a base-8 spacing system. However, vertical rhythm between sections should be expansive (80px, 120px, or 160px) to allow the "Matte Black" aesthetic to breathe.

## Elevation & Depth

Elevation in this design system is achieved through **Tonal Layering** and **Soft Amber Glows** rather than traditional drop shadows.

- **Surface Tiers:** Background is the darkest layer. Cards and modals use a slightly lighter graphite shade.
- **Interactive Depth:** When an element is hovered, use a subtle `0.5px` border in Bronze (#CD7F32) or a faint Amber outer glow (5% opacity) to simulate the way light catches glass.
- **Glassmorphism:** Use sparingly for navigation bars or overlays. A backdrop-blur of `20px` with a `10%` white tint creates a "frosted obsidian" effect.

## Shapes

The shape language is structured and architectural. We avoid large radii to maintain a sense of formal elegance.

- **Primary Radius:** 4px (Soft) for buttons and inputs. This provides just enough friendliness without losing the "sharp suit" aesthetic.
- **Secondary Radius:** 8px for larger cards and image containers.
- **Icons:** Use thin-stroke (1.5px) icons. Avoid filled icons unless in an active state.

## Components

### Buttons
- **Primary:** Champagne Gold background with Charcoal text. No border. High-gloss finish on hover.
- **Secondary:** Transparent background with an Ivory 1px border. Text in Ivory.
- **Ghost:** Text in Ivory with a Bronze underline that expands on hover.

### Input Fields
- **Style:** Underline-only or very subtle 1px graphite border. 
- **Active State:** The underline transitions from Gray to Bronze.
- **Labeling:** Floating labels in Manrope (Label-MD style).

### Cards
- **Construction:** Flat graphite surface (#1C1C1C). 
- **Images:** Always use a slight desaturation filter or a "warm-tint" overlay to ensure photography matches the UI color palette.

### Lists & Menus
- **Dividers:** 1px width, color set to #2D2D2D. 
- **Active State:** A small gold vertical line to the left of the active list item.

### Chips/Tags
- **Style:** Small, pill-shaped with a Bronze border and Bronze text. Background is transparent.