# palette_ripper
Palette Ripper is a client-side web application that extracts full color palettes from uploaded images. Powered by JavaScript and HTML5 Canvas, it processes pixel data to output dominant shades, HEX codes, and human-readable color names. Features a sleek dark UI with one-click clipboard copying.
# 🎨 Palette Ripper

> Extract full color palettes, color names, and HEX codes directly from images in your browser.

Palette Ripper is a fast, 100% client-side web application built with Vanilla JavaScript and the HTML5 Canvas API. It analyzes uploaded images, quantizes pixel data to identify dominant colors, and automatically maps shades to human-readable color names using a Euclidean color-distance algorithm.

---

## ✨ Features

* **🎨 Full Spectrum Extraction:** Automatically clusters pixel data to extract all dominant, distinct shades in an image rather than relying on a hardcoded color limit.
* **🏷️ Smart Color Naming:** Compares RGB values against a built-in color dictionary to display accurate, friendly color names alongside HEX codes[cite: 2].
* **📋 One-Click Copy:** Click any swatch to instantly copy its HEX code to your clipboard with toast feedback[cite: 2].
* **📂 Drag & Drop Uploads:** Custom, responsive drop zone supporting PNG, JPG, WEBP, and GIF files.
* **🔒 100% Private & Browser-Based:** Powered by HTML5 Canvas—your images stay on your device and are never uploaded to a server[cite: 1, 2].
* **💎 Modern Glassmorphic UI:** Smooth hover animations, responsive previewing, and dark-theme aesthetic[cite: 1, 3].

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (CSS Variables, Flexbox, CSS Grid)[cite: 1, 3]
* **Logic:** Vanilla JavaScript (ES6+)[cite: 2]
* **Graphics Engine:** HTML5 Canvas API[cite: 1, 2]
* **Typography & Icons:** Inter Font & SVG Icons[cite: 1]

---

## 🚀 Getting Started

Since Palette Ripper runs completely in the browser, no build steps or package managers are required!

### Quick Run
1. Clone or download this repository:
   ```bash
   git clone [https://github.com/atk-5838/palette_ripper.git](https://github.com/atk-5838/palette_ripper.git)
