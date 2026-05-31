---
name: Elite Auction Modernism
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2f5'
  surface-container: '#f1edef'
  surface-container-high: '#ebe7e9'
  surface-container-highest: '#e5e1e3'
  on-surface: '#1c1b1d'
  on-surface-variant: '#47464d'
  inverse-surface: '#313032'
  inverse-on-surface: '#f3f0f2'
  outline: '#78767d'
  outline-variant: '#c8c5cd'
  surface-tint: '#5c5c74'
  primary: '#010111'
  on-primary: '#ffffff'
  primary-container: '#1a1b2f'
  on-primary-container: '#83839c'
  inverse-primary: '#c5c4df'
  secondary: '#a7391e'
  on-secondary: '#ffffff'
  secondary-container: '#fd7958'
  on-secondary-container: '#6e1500'
  tertiary: '#020304'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1d21'
  on-tertiary-container: '#838589'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0fc'
  primary-fixed-dim: '#c5c4df'
  on-primary-fixed: '#191a2e'
  on-primary-fixed-variant: '#44455b'
  secondary-fixed: '#ffdad2'
  secondary-fixed-dim: '#ffb4a2'
  on-secondary-fixed: '#3c0700'
  on-secondary-fixed-variant: '#862208'
  tertiary-fixed: '#e2e2e7'
  tertiary-fixed-dim: '#c6c6cb'
  on-tertiary-fixed: '#1a1c1f'
  on-tertiary-fixed-variant: '#45474b'
  background: '#fcf8fa'
  on-background: '#1c1b1d'
  surface-variant: '#e5e1e3'
typography:
  display-timer:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '200'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-currency:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  headline-xl:
    fontFamily: Outfit
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-xl-mobile:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
  headline-lg:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  stack-xl: 64px
---

## Brand & Style
The design system is crafted for a premium peer-to-peer marketplace that balances the adrenaline of high-stakes bidding with the refined aesthetic of a luxury auction house. The target audience is affluent, tech-savvy collectors who value transparency, speed, and exclusivity.

The visual direction combines **Minimalism** with **Glassmorphism**. The interface prioritizes spaciousness and high-contrast accents to guide the eye toward "Live Bidding" states and "Expiring" timers. The style utilizes translucent layers and soft background blurs to create a sense of physical depth, while subtle glowing borders on interactive elements provide a futuristic, tactile feedback loop. The overall emotional response should be one of sophisticated excitement and absolute reliability.

## Colors
The palette is anchored by **Deep Midnight Navy (#1A1B2F)**, used primarily for high-level structure and typography to establish authority. The canvas is a **Soft Ice-Blue (#F5F5FA)**, providing a clean, expansive backdrop that prevents the UI from feeling heavy.

**Electric Coral (#FF7A59)** is the primary action color, reserved strictly for high-value interactions: placing bids, starting a timer, or navigating the checkout funnel. To indicate urgency or critical system states, **Rose Crimson (#E11D48)** is utilized, specifically for auctions ending in under 60 seconds. All glass surfaces use a semi-transparent white base with high-saturation background blurs to maintain legibility against the off-white canvas.

## Typography
This design system utilizes a dual-font strategy to balance character with utility. **Outfit** provides a geometric, modern flair for headlines and "display" states. **Inter** is used for all body copy, forms, and metadata to ensure maximum legibility at smaller sizes.

A specialized `display-timer` role uses a thin weight (200) to create an elegant, ethereal look for countdowns, while `display-currency` uses a heavy weight (700) to emphasize the financial magnitude of the auction. All labels use high-tracking (letter-spacing) and uppercase styling to differentiate metadata from interactive content.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to preserve the premium, "editorial" feel of a luxury catalog. A 12-column grid is used with generous 32px gutters to provide significant breathing room between auction lots.

- **Desktop:** 1440px max width with 64px side margins.
- **Tablet:** 8-column fluid grid with 32px margins.
- **Mobile:** 4-column fluid grid with 20px margins.

Vertical rhythm is governed by a 4px baseline, with standard stack increments of 16px and 32px for most components. Large hero sections use 64px spacing to separate the primary item from the auction history sidebar.

## Elevation & Depth
Depth is established through **Glassmorphism** and multi-layered ambient shadows. Instead of traditional solid cards, the design system utilizes translucent surfaces with a 20px - 40px background blur (`backdrop-filter`).

- **Base Layer:** The Soft Ice-Blue canvas (#F5F5FA).
- **Surface Layer:** Glass cards with a 1px solid white border at 40% opacity. This "inner glow" border helps the element pop against the light background.
- **Shadows:** Shadows are extra-diffused (30px+ blur) with very low opacity (5-8%) and a subtle blue tint derived from the Primary Navy color to ensure they look natural on the cool-toned canvas.
- **Active State:** When an element is focused or "Live," a subtle outer glow using the Electric Coral accent is applied to the border.

## Shapes
The shape language is defined by large, inviting radii that reflect high-end industrial design. All primary containers (product cards, modal windows, and action areas) utilize a minimum of **24px (rounded-xl)** corner radius.

Buttons and input fields are more compact but remain distinctly rounded to maintain consistency. Status chips and small badges use "Pill" shapes (full radius) to contrast against the more architectural grid of the cards.

## Components
### Glassmorphic Cards
Cards are the primary vehicle for auction lots. They feature the translucent background and 1px "glow" border. Content is layered with the item image having a slightly smaller border radius than the parent card to create a nested, "frame-within-a-frame" look.

### Action Buttons
Primary buttons use a solid **Electric Coral** fill with white text. For a premium feel, they include a soft drop shadow of the same color (Coral) at 30% opacity. Secondary buttons are glass-based with navy text.

### Progress Bars & Timers
Auction progress bars (showing time remaining) use a linear gradient from **Deep Midnight Navy** to **Electric Coral**. As the timer enters the "Expiring" state (semantic warning), the gradient shifts toward **Rose Crimson**.

### Input Fields
Inputs are minimalist, featuring only a bottom border in the default state. Upon focus, they transform into a glassmorphic container with a soft glowing border and floating label.

### Minimalist Icons
Icons should be drawn with a 1.5pt stroke, utilizing "open" shapes and no fills. Icons are consistently colored in Deep Midnight Navy, except when used within an active Coral CTA.