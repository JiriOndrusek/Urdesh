# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a standalone web-based timer application called "Urdesh" - a styled countdown timer with toggleable status buttons. The application runs entirely in the browser with no build process or dependencies.

## Architecture

**Single-page application** with three files:
- [index.html](index.html) - DOM structure with timer display and control buttons
- [script.js](script.js) - Timer logic, cookie-based state persistence, and event handlers
- [style.css](style.css) - Absolute positioning layout with image-based styling

**State Management**: Uses browser cookies to persist timer state across page reloads via `setCookie()`/`getCookie()` utilities in [script.js](script.js:1-12).

**Timer Controls**:
- Single click on timer display: starts countdown
- Double click on timer display: resets to 20:00
- "+5 MINS" button: adds 5 minutes to current time
- "AUSPEX" and "MAIN COMS" buttons: toggle between red/blue background images

**Image Assets**: The app expects these images in the `images/` directory:
- `background.jpg` - Full page background
- `frame.png` - Timer frame overlay
- `button-green.png` - "+5 MINS" button
- `button-red.png` and `button-blue.png` - Toggle button states

## Development

This is a static HTML application. To run locally:
```bash
# Serve with any static file server, for example:
python3 -m http.server 8000
# Then open http://localhost:8000
```

No build, compile, or package installation steps required.

## Key Implementation Details

- Timer state persists in cookies for 1 day
- Timer interval runs at 1-second resolution ([script.js:28-38](script.js#L28-L38))
- Cookie is deleted when timer reaches zero
- Multiple interval prevention via interval guard ([script.js:27](script.js#L27))
- Background images are toggled by swapping CSS `backgroundImage` URLs ([script.js:57-60](script.js#L57-L60))
