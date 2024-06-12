const express = require('express');
const { createCanvas } = require('canvas');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 443;

const width = 800;
const height = 800;
const goldenRatio = 1.618;
const phi = (1 + Math.sqrt(5)) / 2;

const colors = [
  '#B5CEA8', '#98D5F6', '#FFB386', '#FF6961', '#303031', 
  '#8A2BE2', '#5F9EA0', '#7FFF00', '#6495ED', '#D2691E', 
  '#FF7F50', '#DC143C', '#00CED1', '#9400D3', '#FFD700', 
  '#808080', '#00FF00', '#800080', '#4682B4', '#EE82EE'
];

app.use(express.static(path.join(__dirname, 'public')));

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

  ctx.fillStyle = '#1C1C1D';
  ctx.fillRect(0, 0, width, height);

  ctx.shadowBlur = 30;
  ctx.shadowColor = 'rgba(152, 213, 246, 0.94)';
  ctx.strokeStyle = 'rgba(152, 213, 246, 0.94)';
  ctx.lineWidth = 20;
  ctx.strokeRect(0, 0, width, height);

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

  return { image: canvas.toBuffer(), specs };
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

  return { image: canvas.toBuffer(), specs };
}

app.get('/', async (req, res) => {
  const { image, specs } = generateFractalImage();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>phiSquares</title>
      <meta name="description" content="Explore the aesthetically pleasing placement and orientation of squares using the Golden Ratio, Phi, and the Fibonacci Sequence.">
      <meta property="og:image" content="phiSquares.png">
      <link rel="icon" href="/favicon.ico" type="image/x-icon">
      <style>
        @font-face {
          font-family: 'Tron';
          src: url('/fonts/Tron.woff') format('woff');
        }
        body {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #1C1C1D;
          color: #98D5F6;
          font-family: 'Tron', Arial, sans-serif;
          padding: 20px;
          margin-top: 10px;
        }
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #303031;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.8);
          max-width: 820px;
          width: 100%;
        }
        .button-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
          width: calc(100% - 20px);
        }
        button {
          flex: 1 1 calc(50% - 10px);
          padding: 15px;
          background-color: #98D5F6;
          border: none;
          color: #1C1C1D;
          font-weight: bold;
          cursor: pointer;
          border-radius: 5px;
          font-family: 'Tron', Arial, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2em;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        .button-icon {
          margin-right: 10px;
        }
        img {
          width: 100%;
          max-width: 800px;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.8);
          border-radius: 12px;
        }
        .description-box {
          background: #303031;
          padding: 20px;
          color: #FFB386;
          text-align: left;
          white-space: pre-wrap;
          font-family: 'Tron', Arial, sans-serif;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.8);
          border-radius: 12px;
          width: 100%;
          max-width: 860px;
          margin-top: 20px;
        }
        @media (max-width: 600px) {
          .description-box {
            padding: 30px;
          }
          .button-container {
            margin-bottom: 30px;
          }
          .button {
            font-size: 1.2em;
          }
        }
        pre {
          margin-top: 40px;
          background: #303031;
          padding: 20px;
          color: #FFB386;
          white-space: pre-wrap;
          position: relative;
          font-family: 'Tron', Arial, sans-serif;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.8);
          border-radius: 12px;
          width: 100%;
          max-width: 860px;
          margin-top: 20px;
          max-height: 360px;
          overflow-y: auto;
        }
        pre::-webkit-scrollbar {
          width: 12px;
        }
        pre::-webkit-scrollbar-thumb {
          background: #303030;
          border-radius: 6px;
        }
        pre::-webkit-scrollbar-track {
          background: #1C1C1D;
        }
        @media (max-width: 600px) {
          pre {
            padding: 30px;
          }
        }
        .copy-button {
          font-size: .8em;
          position: absolute;
          top: 10px;
          right: 20px;
          background-color: #98D5F6;
          border: none;
          color: #1C1C1D;
          font-weight: bold;
          cursor: pointer;
          border-radius: 5px;
          font-family: 'Tron', Arial, sans-serif;
          padding: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="button-container">
          <button id="phiSquares-button" onclick="loadImage('phiSquares')">
            <svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4 7.58 4 4 7.58 4 12s3.58 8 8 8c3.93 0 7.19-2.86 7.88-6.65h-2.08c-.64 2.33-2.74 4-5.32 4-3.04 0-5.5-2.46-5.5-5.5s2.46-5.5 5.5-5.5c1.53 0 2.9.63 3.88 1.62l-2.88 2.88H20V4l-2.35 2.35z"/></svg>
            phiSquares
          </button>
          <button id="phiSquaresAlpha-button" onclick="loadImage('phiSquaresAlpha')">
            <svg class="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4 7.58 4 4 7.58 4 12s3.58 8 8 8c3.93 0 7.19-2.86 7.88-6.65h-2.08c-.64 2.33-2.74 4-5.32 4-3.04 0-5.5-2.46-5.5-5.5s2.46-5.5 5.5-5.5c1.53 0 2.9.63 3.88 1.62l-2.88 2.88H20V4l-2.35 2.35z"/></svg>
            phiSquares Alpha
          </button>
        </div>
        <img id="generated-image" src="data:image/png;base64,${image.toString('base64')}" alt="Generated Image">
      </div>
      <div class="description-box">
        The process begins with a canvas where the algorithm sets the background color and adds an outer glow effect around the border. Squares are drawn in layers, each smaller than the previous, following the golden ratio. The position, color, angle, opacity, and glow intensity of each square are determined using randomization and calculations based on the Golden Ratio and the Fibonacci Sequence. Each square's placement and rotation are influenced by Phi Offsets, and their visual properties include alternating glow intensities and z-index adjustments. The interplay of these organic ratios results in images imbued with motion, life, and elegance. Each piece of the collection represents a harmonious fusion of art and science, showcasing the intricate and delightful variations achievable only through these mathematical principles.
      </div>
      <pre id="json-specs"><code>${JSON.stringify(specs, null, 2)}</code><button class="copy-button" onclick="copyToClipboard()">Copy JSON</button></pre>
      <script>
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
            document.getElementById('json-specs').innerHTML = '<code>' + JSON.stringify(data.specs, null, 2) + '</code><button class="copy-button" onclick="copyToClipboard()">Copy JSON</button>';
          } catch (error) {
            console.error('Error fetching image:', error);
            alert('Failed to load image. Please try again later.');
          }
        }
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
  } else {
    ({ image, specs } = generateFractalImage());
  }
  res.json({ image: image.toString('base64'), specs });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
