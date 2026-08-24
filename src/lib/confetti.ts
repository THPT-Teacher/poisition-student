import confetti from 'canvas-confetti';

export function triggerWinnerConfetti() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'],
    ticks: 200,
  });
}

export function triggerGrandCelebration() {
  const duration = 3.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // Bắn từ 2 bên màn hình
    confetti({ ...defaults, particleCount, origin: { x: 0.1, y: 0.7 } });
    confetti({ ...defaults, particleCount, origin: { x: 0.9, y: 0.7 } });
  }, 250);
}
