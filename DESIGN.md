---
name: FreesApp
description: Hong Kong free-give marketplace. Items always $0.
colors:
  bg: "#efe7d8"
  card: "#fffcf6"
  ink: "#1c1712"
  muted: "#7a7166"
  primary: "#1a6b43"
  on-primary: "#ffffff"
  amber: "#9a5a12"
  danger: "#9f2d24"
typography:
  display: { fontFamily: Noto Sans TC, fontSize: 30px, fontWeight: 800, lineHeight: 1.16 }
  body: { fontFamily: Noto Sans TC, fontSize: 16px, fontWeight: 400, lineHeight: 1.55 }
rounded: { sm: 8px, md: 16px, lg: 22px }
spacing: { sm: 8px, md: 16px, tap: 44px }
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    minHeight: "{spacing.tap}"
  tabbar: { maxTabs: 5, position: bottom-sticky }
---

## Overview

Paper-and-forest visual. Carousell IA. Jony hard constraints: 44pt targets, copy caps, sticky CTA, safe areas, five tabs max.

## Colors

Forest green = give. Amber = locked. Grey = done. No price colour on listings.

## Typography

CJK body 16px. Card titles clip ~18 glyphs. Three type roles max per card.

## Layout

430px column. 8px rhythm. Sticky dock for primary CTA.

## Elevation & Depth

One card shadow, glass only on tab bar and search.

## Shapes

16–22px radii. FAB is a rounded square, not a circle.

## Components

Card: photo, FREE, title, giver + district, heart.
Status: 待認領 / 鎖定待交收 / 已完成交收.

## Do's and Don'ts

- Do keep tabs ≤ 5.
- Do cap title ≤ 20, body ≤ 60, CTA ≤ 15, toast ≤ 40.
- Don’t invent a listing price.
- Don’t animate tab switches.
