const express = require('express');
const { createCanvas } = require('canvas');
const path = require('path');
const fs = require('fs');
const hljs = require('highlight.js');
const app = express();
const PORT = process.env.PORT || 443;

const width = 800;
const height = 800;
const goldenRatio = 1.618;
const phi = (1 + Math.sqrt(5)) / 2;
const silverRatio = 2.414;
const plasticNumber = 1.325;

const colors = [
    '#B5CEA8', '#98D5F6', '#FFB386', '#FF6961', '#303031',
    '#8A2BE2', '#5F9EA0', '#7FFF00', '#6495ED', '#D2691E',
    '#FF7F50', '#DC143C', '#00CED1', '#9400D3', '#FFD700',
    '#808080', '#00FF00', '#800080', '#4682B4', '#EE82EE'
];

app.use(express.static(path.join(__dirname)));

function generateRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function generateRandomPosition(max) {
    return Math.floor(Math.random() * max);
}

function generateProportionalAngle(step) {
    return (step * goldenRatio * 360) % 360;
}

function generateProportionalZIndex(step) {
    return (step * goldenRatio) % 10;
}

function generateFibonacci(n) {
    const fib = [0, 1];
    for (let i = 2; i <= n; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];
    }
    return fib[n];
}

function generateSilverSequence(n) {
    const seq = [0, 1];
    for (let i = 2; i <= n; i++) {
        seq[i] = seq[i - 1] + 2 * seq[i - 2];
    }
    return seq[n];
}

function generatePlasticSequence(n) {
    const seq = [1, 1, 1];
    for (let i = 3; i <= n; i++) {
        seq[i] = seq[i - 1] + seq[i - 2] + seq[i - 3];
    }
    return seq[n];
}

function drawBlock(ctx, x, y, size, color, angle, opacity, glow) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(x + size / 2, y + size / 2);
    ctx.rotate(angle * Math.PI / 180);
    ctx.fillStyle = color;
    ctx.shadowBlur = glow;
    ctx.shadowColor = color;
    ctx.fillRect(-size / 2, -size / 2, size, size);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 4;
    ctx.strokeRect(-size / 2, -size / 2, size, size);

    if (Math.random() > 0.5) {
        const gradient = ctx.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(-size / 2, -size / 2, size, size);
    }

    ctx.restore();
}

function generateFractalImage() {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const specs = [];

    ctx.clearRect(0, 0, width, height);

    let currentSize = width;
    let step = 0;

    while (currentSize > 10) {
        const color = generateRandomColor();
        const size = currentSize / goldenRatio;
        const x = generateRandomPosition(width - size);
        const y = generateRandomPosition(height - size);
        const angle = generateProportionalAngle(step);
        const opacity = 1 / goldenRatio;
        const glow = (step % 2 === 0) ? 20 : 10;

        const fibonacciNumber = generateFibonacci(step);
        const phiOffsetX = (fibonacciNumber % 2 === 0) ? size / phi : -size / phi;
        const phiOffsetY = (fibonacciNumber % 2 !== 0) ? size / phi : -size / phi;

        const adjustedX = (x + phiOffsetX + width) % width;
        const adjustedY = (y + phiOffsetY + height) % height;

        drawBlock(ctx, adjustedX, adjustedY, size, color, angle, opacity, glow);

        specs.push({
            description: `Square at (${adjustedX}, ${adjustedY}) with size ${size}, angle ${angle} degrees, opacity ${opacity}, glow ${glow}, and z-index ${generateProportionalZIndex(step)}, in proportion to the golden ratio and phi.`,
            position: `(${adjustedX}, ${adjustedY})`,
            size: size,
            color: color,
            angle: angle,
            opacity: opacity,
            glow: glow,
            zIndex: generateProportionalZIndex(step),
            relationToGoldenRatio: {
                size: `Size is proportional to the golden ratio: ${size} / ${currentSize} ≈ ${goldenRatio}.`,
                angle: `Angle is proportional to the golden ratio: ${angle}.`,
                opacity: `Opacity is inversely proportional to the golden ratio: ${opacity}.`,
                position: `Position adjusted with phi offset: (${x} + ${phiOffsetX} ≈ ${adjustedX}, ${y} + ${phiOffsetY} ≈ ${adjustedY}).`,
                zIndex: `Z-index adjusted in proportion to the golden ratio: ${generateProportionalZIndex(step)}.`,
                fibonacci: `Position influenced by Fibonacci sequence number: ${fibonacciNumber}.`,
                glow: `Glow intensity alternates in proportion to the golden ratio: ${glow}.`
            }
        });

        currentSize /= goldenRatio;
        step++;
    }

    return {
        image: canvas.toBuffer(),
        specs
    };
}

function drawAlphaBlock(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.fillRect(x, y, size, size);
}

function generateAlphaFractalImage() {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const specs = [];

    ctx.clearRect(0, 0, width, height);

    let currentWidth = width;
    let currentHeight = height;
    let step = 0;

    while (currentWidth > 10 && currentHeight > 10) {
        const color = generateRandomColor();
        const size = Math.min(currentWidth, currentHeight) / goldenRatio;
        const x = generateRandomPosition(width - size);
        const y = generateRandomPosition(height - size);

        drawAlphaBlock(ctx, x, y, size, color);

        specs.push({
            description: `Block at (${x}, ${y}) with size ${size} in proportion to the golden ratio.`,
            position: `(${x}, ${y})`,
            size: size,
            color: color,
            relationToGoldenRatio: `Size is proportional to the golden ratio: ${size} / ${Math.min(currentWidth, currentHeight)} ≈ ${goldenRatio}.`
        });

        if (step % 2 === 0) {
            currentHeight /= goldenRatio;
        } else {
            currentWidth /= goldenRatio;
        }
        step++;
    }

    return {
        image: canvas.toBuffer(),
        specs
    };
}

function generateEnhancedFractalImage() {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const specs = [];

    ctx.clearRect(0, 0, width, height);

    let currentSize = width;
    let step = 0;
    const startingCorner = Math.floor(Math.random() * 4);

    let startX, startY;
    switch (startingCorner) {
        case 0:
            startX = 0;
            startY = 0;
            break;
        case 1:
            startX = width - 1;
            startY = 0;
            break;
        case 2:
            startX = 0;
            startY = height - 1;
            break;
        case 3:
            startX = width - 1;
            startY = height - 1;
            break;
    }

    while (currentSize > 10) {
        const color = generateRandomColor();
        const size = currentSize / goldenRatio;
        const x = generateRandomPosition(width - size);
        const y = generateRandomPosition(height - size);
        const angle = generateProportionalAngle(step);
        const opacity = 1 / goldenRatio;
        const glow = (step % 2 === 0) ? 20 : 10;

        const fibonacciNumber = generateFibonacci(step);
        const silverNumber = generateSilverSequence(step);
        const plasticNumber = generatePlasticSequence(step);
        const phiOffsetX = (fibonacciNumber % 2 === 0) ? size / phi : -size / phi;
        const phiOffsetY = (fibonacciNumber % 2 !== 0) ? size / phi : -size / phi;

        let adjustedX, adjustedY;

        switch (startingCorner) {
            case 0:
                adjustedX = (startX + x + phiOffsetX) % width;
                adjustedY = (startY + y + phiOffsetY) % height;
                break;
            case 1:
                adjustedX = (startX - x + phiOffsetX) % width;
                adjustedY = (startY + y + phiOffsetY) % height;
                break;
            case 2:
                adjustedX = (startX + x + phiOffsetX) % width;
                adjustedY = (startY - y + phiOffsetY) % height;
                break;
            case 3:
                adjustedX = (startX - x + phiOffsetX) % width;
                adjustedY = (startY - y + phiOffsetY) % height;
                break;
        }

        const extraGlow = (silverNumber % 2 === 0) ? 30 : 15;
        const plasticRotation = (plasticNumber % 3 === 0) ? angle / plasticNumber : angle * plasticNumber;

        drawBlock(ctx, adjustedX, adjustedY, size, color, plasticRotation, opacity, glow + extraGlow);

        specs.push({
            description: `Square at (${adjustedX}, ${adjustedY}) with size ${size}, angle ${plasticRotation} degrees, opacity ${opacity}, glow ${glow + extraGlow}, and z-index ${generateProportionalZIndex(step)}, in proportion to the golden ratio, phi, silver ratio, and plastic number.`,
            position: `(${adjustedX}, ${adjustedY})`,
            size: size,
            color: color,
            angle: plasticRotation,
            opacity: opacity,
            glow: glow + extraGlow,
            zIndex: generateProportionalZIndex(step),
            relationToGoldenRatio: {
                size: `Size is proportional to the golden ratio: ${size} / ${currentSize} ≈ ${goldenRatio}.`,
                angle: `Angle is proportional to the golden ratio and plastic number: ${plasticRotation}.`,
                opacity: `Opacity is inversely proportional to the golden ratio: ${opacity}.`,
                position: `Position adjusted with phi offset: (${x} + ${phiOffsetX} ≈ ${adjustedX}, ${y} + ${phiOffsetY} ≈ ${adjustedY}).`,
                zIndex: `Z-index adjusted in proportion to the golden ratio: ${generateProportionalZIndex(step)}.`,
                fibonacci: `Position influenced by Fibonacci sequence number: ${fibonacciNumber}.`,
                glow: `Glow intensity alternates in proportion to the golden ratio and silver ratio: ${glow + extraGlow}.`,
                silver: `Extra glow influenced by the silver ratio: ${extraGlow}.`,
                plastic: `Rotation influenced by the plastic number: ${plasticRotation}.`
            }
        });

        currentSize /= goldenRatio;
        step++;
    }

    return {
        image: canvas.toBuffer(),
        specs
    };
}

app.get('/', async (req, res) => {
    const { image, specs } = generateEnhancedFractalImage();
    const css = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
    const highlightedSpecs = hljs.highlight(JSON.stringify(specs, null, 2), { language: 'json' }).value;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Generate Squares</title>
      <meta name="description" content="Explore the aesthetically pleasing placement and orientation of squares using the Golden Ratio, Phi, and the Fibonacci Sequence.">
      <meta property="og:image" content="phiSquares.png">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="icon" href="/favicon.ico" type="image/x-icon">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/vs2015.min.css">
      <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap" rel="stylesheet">
      <style>${css}</style>
      <style>
        .quote-box {
          position: fixed;
          bottom: 20px;
          left: 50%;
          width: 80%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          padding: 10px 20px;
          border-radius: 10px;
          font-family: 'Source Code Pro', monospace;
          font-size: 16px;
          opacity: 0;
          transition: opacity 1s ease-in-out;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="button-container">
          <button id="phiSquaresAlpha-button" onclick="loadImage('phiSquaresAlpha')">
            <svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4 7.58 4 4 7.58 4 12s3.58 8 8 8c3.93 0 7.19-2.86 7.88-6.65h-2.08c-.64 2.33-2.74 4-5.32 4-3.04 0-5.5-2.46-5.5-5.5s2.46-5.5 5.5-5.5c1.53 0 2.9.63 3.88 1.62l-2.88 2.88H20V4l-2.35 2.35z"/></svg>
            Generate 1.0
          </button>
          <button id="phiSquares-button" onclick="loadImage('phiSquares')">
            <svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4 7.58 4 4 7.58 4 12s3.58 8 8 8c3.93 0 7.19-2.86 7.88-6.65h-2.08c-.64 2.33-2.74 4-5.32 4-3.04 0-5.5-2.46-5.5-5.5s2.46-5.5 5.5-5.5c1.53 0 2.9.63 3.88 1.62l-2.88 2.88H20V4l-2.35 2.35z"/></svg>
            Generate 2.0
          </button>
          <button id="phiSquaresEnhanced-button" onclick="loadImage('phiSquaresEnhanced')">
            <svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4 7.58 4 4 7.58 4 12s3.58 8 8 8c3.93 0 7.19-2.86 7.88-6.65h-2.08c-.64 2.33-2.74 4-5.32 4-3.04 0-5.5-2.46-5.5-5.5s2.46-5.5 5.5-5.5c1.53 0 2.9.63 3.88 1.62l-2.88 2.88H20V4l-2.35 2.35z"/></svg>
            Generate 3.0 Enhanced
          </button>
        </div>
        <a href="https://opensea.io/collection/phisquares" target="_blank">
          <img id="generated-image" src="data:image/png;base64,${image.toString('base64')}" alt="Generated Image">
        </a>
      </div>
      <div class="description-box" id="description-box"></div>
      <pre id="json-specs"><code class="json">${highlightedSpecs}</code><button class="copy-button" onclick="copyToClipboard()">Copy JSON</button></pre>
      <div class="quote-box" id="quote-box-1">"Sometimes these remind me of actual star formations or constellations."</div>
      <div class="quote-box" id="quote-box-2">"It's crazy, something like 80% of the phiSquares I generate look stunning, I can't stop admiring them."</div>
      <div class="quote-box" id="quote-box-3">"These images have a sense of movement and life, I even see faces or critters in some of them."</div>
      <div class="quote-box" id="quote-box-4">"For being generative art, these really capture an organic, life-like feel."</div>
      <div class="quote-box" id="quote-box-5">"I like the glowy squares."</div>
      <div class="quote-box" id="quote-box-6">"The use of the golden ratio and Fibonacci sequence creates a perfect balance of harmony and chaos."</div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/highlight.min.js"></script>
      <script>
        const text1 = "The process begins with a transparent canvas where the algorithm layers squares, each progressively smaller, guided by the Golden Ratio. Using randomization and Fibonacci Sequence calculations, the position, color, angle, opacity, and glow of each square are determined. Phi offsets influence placement and rotation, while the silver ratio affects glow intensity and the plastic number guides rotation adjustments. Starting from a random corner, alternating glow intensities, z-index adjustments, and proportional relationships enhance visual depth and harmony.";
        const text2 = "These ratios craft images imbued with motion, life, and elegance, blending art and science to showcase intricate and delightful variations achieved only through these mathematical principles.";
        let index = 0;
        let currentText = text1;

        function typeWriter() {
          if (index < currentText.length) {
            document.getElementById("description-box").innerHTML += currentText.charAt(index);
            index++;
            setTimeout(typeWriter, 22);
          } else if (currentText === text1) {
            document.getElementById("description-box").innerHTML += '<br><br>';
            currentText = text2;
            index = 0;
            setTimeout(typeWriter, 22);
          }
        }

        window.onload = typeWriter;

        function copyToClipboard() {
          const jsonSpecs = document.getElementById('json-specs').innerText;
          const jsonText = jsonSpecs.replace(/Copy JSON$/, '').trim();
          navigator.clipboard.writeText(jsonText).then(() => {
            alert('JSON copied to clipboard');
          });
        }

        async function loadImage(type) {
          try {
            const response = await fetch('/api/generate?type=' + type);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            document.getElementById('generated-image').src = 'data:image/png;base64,' + data.image;
            const highlightedSpecs = hljs.highlight(JSON.stringify(data.specs, null, 2), { language: 'json' }).value;
            document.getElementById('json-specs').innerHTML = '<code class="json">' + highlightedSpecs + '</code><button class="copy-button" onclick="copyToClipboard()">Copy JSON</button>';
          } catch (error) {
            console.error('Error fetching image:', error);
            alert('Failed to load image. Please try again later.');
          }
        }

        function showQuotes() {
          const quotes = document.querySelectorAll('.quote-box');
          let delay = 25000;
          quotes.forEach((quote, index) => {
            setTimeout(() => {
              quote.style.opacity = '1';
              setTimeout(() => {
                quote.style.opacity = '0';
              }, 5000);
              delay += Math.random() * 10000 + 10000;
            }, delay);
          });
        }

        setInterval(showQuotes, 40000 * 6);
        setTimeout(showQuotes, 25000);
      </script>
    </body>
    </html>
  `;

    res.send(html);
});

app.get('/api/generate', (req, res) => {
    const { type } = req.query;
    let image, specs;
    if (type === 'phiSquaresAlpha') {
        ({ image, specs } = generateAlphaFractalImage());
    } else if (type === 'phiSquaresEnhanced') {
        ({ image, specs } = generateEnhancedFractalImage());
    } else {
        ({ image, specs } = generateFractalImage());
    }
    res.json({ image: image.toString('base64'), specs });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
