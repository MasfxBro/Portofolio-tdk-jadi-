const typingLines = [...document.querySelectorAll("[data-typing]")];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

async function typeLine(element, text, delay = 38) {
  return new Promise((resolve) => {
    let position = 0;
    let previousFrame = 0;
    let elapsed = 0;

    function renderFrame(timestamp) {
      if (previousFrame) elapsed += timestamp - previousFrame;
      previousFrame = timestamp;

      while (elapsed >= delay && position < text.length) {
        position += 1;
        elapsed -= delay;
        element.textContent = text.slice(0, position);
      }

      if (position < text.length) {
        requestAnimationFrame(renderFrame);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(renderFrame);
  });
}

async function playTypingAnimation() {
  for (const line of typingLines) {
    await typeLine(line, line.dataset.typing);
  }
}

if (prefersReducedMotion) {
  typingLines.forEach((line) => {
    line.textContent = line.dataset.typing;
  });
} else {
  playTypingAnimation();
}
