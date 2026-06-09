import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const { chromium } = await import(
  "file:///Users/joshuaventiwalker/Documents/TecDev-Core-OS/_tools/open-design/node_modules/.pnpm/node_modules/playwright/index.mjs"
);

const sourceDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(sourceDir, "../../..");
const boardPath = resolve(root, "brand/social/source/social-asset-board.html");
const outputDir = resolve(root, "brand/social/examples");
const audioPath = resolve(root, "brand/social/examples/the-elite-theme-140bpm-bm-preview.wav");

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  args: ["--autoplay-policy=no-user-gesture-required"]
});

const page = await browser.newPage({ viewport: { width: 2600, height: 1500 }, deviceScaleFactor: 1 });
await page.goto(`file://${boardPath}`);

const exports = [
  ["youtube-banner-jyw", 2560, 1440],
  ["instagram-carousel-01", 1080, 1080],
  ["instagram-carousel-02", 1080, 1080],
  ["instagram-carousel-03", 1080, 1080],
  ["threads-post-card", 1080, 1350],
  ["youtube-beat-video-still", 1920, 1080]
];

for (const [name, width, height] of exports) {
  const element = page.locator(`[data-export="${name}"]`);
  const box = await element.boundingBox();
  if (!box) throw new Error(`Missing export element: ${name}`);
  await page.screenshot({
    path: resolve(outputDir, `${name}.png`),
    fullPage: true,
    clip: {
      x: Math.floor(box.x),
      y: Math.floor(box.y),
      width,
      height
    }
  });
}

const stillDataUrl = `data:image/png;base64,${(await readFile(resolve(outputDir, "youtube-beat-video-still.png"))).toString("base64")}`;
const audioDataUrl = `data:audio/wav;base64,${(await readFile(audioPath)).toString("base64")}`;
const videoBytes = await page.evaluate(async ({ audioUrl, stillUrl }) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  const image = new Image();
  image.src = stillUrl;
  await image.decode();

  const audio = new Audio(audioUrl);
  audio.crossOrigin = "anonymous";
  audio.volume = 0.92;

  const audioStream = audio.captureStream ? audio.captureStream() : null;
  const videoStream = canvas.captureStream(30);
  const tracks = [...videoStream.getVideoTracks(), ...(audioStream ? audioStream.getAudioTracks() : [])];
  const stream = new MediaStream(tracks);
  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
    ? "video/webm;codecs=vp9,opus"
    : "video/webm";
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8000000 });
  const chunks = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size) chunks.push(event.data);
  };

  const draw = () => {
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
  };

  draw();
  recorder.start(1000);
  await audio.play();
  const started = performance.now();
  await new Promise((resolveFrame) => {
    const tick = () => {
      const elapsed = (performance.now() - started) / 1000;
      ctx.drawImage(image, 0, 0);
      ctx.fillStyle = "rgba(255, 90, 31, 0.95)";
      ctx.fillRect(76, canvas.height - 50, Math.min(canvas.width - 152, elapsed / 15 * (canvas.width - 152)), 8);
      ctx.fillStyle = "rgba(255,255,255,0.38)";
      ctx.fillRect(76, canvas.height - 36, canvas.width - 152, 2);
      if (elapsed < 15) requestAnimationFrame(tick);
      else resolveFrame();
    };
    requestAnimationFrame(tick);
  });
  audio.pause();
  recorder.stop();
  await new Promise((resolveStop) => recorder.onstop = resolveStop);
  const blob = new Blob(chunks, { type: mimeType });
  return Array.from(new Uint8Array(await blob.arrayBuffer()));
}, { audioUrl: audioDataUrl, stillUrl: stillDataUrl });

await writeFile(resolve(outputDir, "youtube-beat-video-the-elite-theme.webm"), Buffer.from(videoBytes));

await browser.close();
