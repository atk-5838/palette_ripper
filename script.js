console.log("Script loaded successfully");

const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const palette = document.getElementById("palette");
const dropZone = document.getElementById("dropZone");
const previewContainer = document.getElementById("previewContainer");
const imagePreview = document.getElementById("imagePreview");
const paletteHeader = document.getElementById("paletteHeader");
const colorCountBadge = document.getElementById("colorCount");
const toast = document.getElementById("toast");

// Expanded Color Dictionary for Accurate Naming
const COLOR_NAMES = [
  { name: "Black", rgb: [0, 0, 0] },
  { name: "White", rgb: [255, 255, 255] },
  { name: "Charcoal", rgb: [54, 69, 79] },
  { name: "Gray", rgb: [128, 128, 128] },
  { name: "Light Gray", rgb: [211, 211, 211] },
  { name: "Slate", rgb: [112, 128, 144] },
  { name: "Crimson", rgb: [220, 20, 60] },
  { name: "Red", rgb: [255, 0, 0] },
  { name: "Dark Red", rgb: [139, 0, 0] },
  { name: "Coral", rgb: [255, 127, 80] },
  { name: "Salmon", rgb: [250, 128, 114] },
  { name: "Orange", rgb: [255, 165, 0] },
  { name: "Dark Orange", rgb: [255, 140, 0] },
  { name: "Gold", rgb: [255, 215, 0] },
  { name: "Yellow", rgb: [255, 255, 0] },
  { name: "Khaki", rgb: [240, 230, 140] },
  { name: "Peach", rgb: [255, 218, 185] },
  { name: "Olive", rgb: [128, 128, 0] },
  { name: "Lime", rgb: [0, 255, 0] },
  { name: "Green", rgb: [0, 128, 0] },
  { name: "Emerald", rgb: [80, 200, 120] },
  { name: "Forest Green", rgb: [34, 139, 34] },
  { name: "Mint", rgb: [189, 252, 201] },
  { name: "Teal", rgb: [0, 128, 128] },
  { name: "Cyan", rgb: [0, 255, 255] },
  { name: "Sky Blue", rgb: [135, 206, 235] },
  { name: "Royal Blue", rgb: [65, 105, 225] },
  { name: "Blue", rgb: [0, 0, 255] },
  { name: "Navy", rgb: [0, 0, 128] },
  { name: "Indigo", rgb: [75, 0, 130] },
  { name: "Violet", rgb: [238, 130, 238] },
  { name: "Purple", rgb: [128, 0, 128] },
  { name: "Magenta", rgb: [255, 0, 255] },
  { name: "Pink", rgb: [255, 192, 203] },
  { name: "Hot Pink", rgb: [255, 105, 180] },
  { name: "Brown", rgb: [165, 42, 42] },
  { name: "Saddle Brown", rgb: [139, 69, 19] },
  { name: "Beige", rgb: [245, 245, 220] },
  { name: "Maroon", rgb: [128, 0, 0] },
  { name: "Sand", rgb: [194, 178, 128] },
  { name: "Turquoise", rgb: [64, 224, 208] }
];

// Drag and drop feedback
["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, () => dropZone.classList.add("dragover"), false);
});
["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, () => dropZone.classList.remove("dragover"), false);
});

imageInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const img = new Image();

  img.onload = function () {
    // Show image preview
    imagePreview.src = img.src;
    previewContainer.style.display = "block";

    // Downscale canvas slightly for faster extraction performance on large images
    const maxDim = 600;
    let width = img.width;
    let height = img.height;

    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = getPixels(imageData);
    
    // Extract ALL prominent colors via smart color quantization (no hardcoded 6 limit)
    const colors = getDominantColors(pixels);
    showPalette(colors);
  };

  img.src = URL.createObjectURL(file);
});

function getPixels(imageData) {
  const pixels = [];
  const data = imageData.data;

  // Sample every 4th pixel for speed & accurate variance
  for (let i = 0; i < data.length; i += 16) {
    // Exclude full transparency
    if (data[i + 3] > 128) {
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }
  }

  return pixels;
}

// Quantizes and groups pixels so we get ALL distinct dominant shades instead of just 6
function getDominantColors(pixels) {
  const colorBucket = {};
  const quantizationFactor = 24; // Bucket size for grouping similar shades

  for (const pixel of pixels) {
    // Quantize channels
    const qR = Math.round(pixel[0] / quantizationFactor) * quantizationFactor;
    const qG = Math.round(pixel[1] / quantizationFactor) * quantizationFactor;
    const qB = Math.round(pixel[2] / quantizationFactor) * quantizationFactor;

    const key = `${qR},${qG},${qB}`;

    if (colorBucket[key]) {
      colorBucket[key].count++;
      // Accumulate exact RGB values to get exact average representation
      colorBucket[key].r += pixel[0];
      colorBucket[key].g += pixel[1];
      colorBucket[key].b += pixel[2];
    } else {
      colorBucket[key] = {
        count: 1,
        r: pixel[0],
        g: pixel[1],
        b: pixel[2]
      };
    }
  }

  // Filter out rare noise (< 0.5% of sampled pixels) and sort by dominance
  const minThreshold = pixels.length * 0.005;

  return Object.values(colorBucket)
    .filter((item) => item.count >= minThreshold)
    .sort((a, b) => b.count - a.count)
    .map((item) => [
      Math.round(item.r / item.count),
      Math.round(item.g / item.count),
      Math.round(item.b / item.count)
    ]);
}

// Find closest human color name using Euclidean distance formula
function getColorName(r, g, b) {
  let minDistance = Infinity;
  let closestName = "Unknown";

  for (const color of COLOR_NAMES) {
    const [cr, cg, cb] = color.rgb;
    const distance = Math.sqrt(
      Math.pow(r - cr, 2) + Math.pow(g - cg, 2) + Math.pow(b - cb, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestName = color.name;
    }
  }

  return closestName;
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((value) => Math.min(255, Math.max(0, value)).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function showPalette(colors) {
  palette.innerHTML = "";
  paletteHeader.style.display = "flex";
  colorCountBadge.textContent = `${colors.length} Colors Extracted`;

  for (const color of colors) {
    const [r, g, b] = color;
    const hex = rgbToHex(r, g, b);
    const colorName = getColorName(r, g, b);

    const swatch = document.createElement("div");
    swatch.className = "swatch";

    swatch.innerHTML = `
      <div class="swatch-color" style="background-color: ${hex};"></div>
      <div class="swatch-info">
        <span class="swatch-name">${colorName}</span>
        <span class="swatch-hex">${hex}</span>
      </div>
    `;

    swatch.onclick = function () {
      navigator.clipboard.writeText(hex);
      showToast(`${colorName} (${hex}) copied to clipboard!`);
    };

    palette.appendChild(swatch);
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}