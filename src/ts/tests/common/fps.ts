export function measureFPS(f: () => void, repeat = 1): Promise<number> {
  return new Promise((resolve) => {
    let fps = 0;
    const start = performance.now();

    function frame(): void {
      for (let i = 0; i < repeat; i++) {
        f();
      }

      if (performance.now() - start < 1000) {
        fps++;
        requestAnimationFrame(frame);
      } else {
        resolve(fps);
      }
    }

    requestAnimationFrame(frame);
  });
}

export async function estimateMaximumTheoreticalFPS(f: () => void): Promise<number> {
  const MARGIN = 0.95;
  const SPACING = 5;
  const TRIALS = 7;

  let repeat = 0;
  let avg0: number | null = null;

  while (true) {
    const ys: number[] = [];
    let yTotal = 0;

    for (let trial = 0; trial < TRIALS; trial++) {
      const fps = await measureFPS(f, repeat);
      ys.push(fps);
      yTotal += fps;
    }

    const avg = yTotal / TRIALS;

    if (repeat === 0) {
      avg0 = avg;
      console.log("avg0", avg0);
    }

    console.log(repeat, ys);

    if (avg0 != null && repeat > 0 && ys.reduce((p, c) => p && c < (avg0 as number) * MARGIN, true)) {
      console.log("avg * repeat", avg, repeat);
      return Math.round(avg * repeat);
    }

    repeat += SPACING;
  }
}