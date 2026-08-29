import React, { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  isListening: boolean;
  isSpeaking?: boolean;
  color?: string;
  barCount?: number;
  height?: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isListening,
  isSpeaking = false,
  color = '#5BC0BE',
  barCount = 18,
  height = 36,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const barWidth = Math.floor(width / barCount) - 3;
      const centerY = height / 2;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4;

        if (isListening || isSpeaking) {
          // Dynamic procedural wave reacting to speech state
          const wave1 = Math.sin(phase + i * 0.45);
          const wave2 = Math.cos(phase * 1.5 + i * 0.3);
          const magnitude = (wave1 + wave2 + 2) / 4;
          const maxH = height * (isSpeaking ? 0.9 : 0.75);
          barHeight = Math.max(4, magnitude * maxH);
        }

        const x = i * (barWidth + 3) + 2;
        const y = centerY - barHeight / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isSpeaking) {
          grad.addColorStop(0, '#fbbf24'); // Gold mentor tone
          grad.addColorStop(1, '#f59e0b');
        } else if (isListening) {
          grad.addColorStop(0, color); // Teal student listening
          grad.addColorStop(1, '#0284c7');
        } else {
          grad.addColorStop(0, '#3A506B');
          grad.addColorStop(1, '#1C2541');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      phase += isSpeaking ? 0.12 : 0.08;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isListening, isSpeaking, color, barCount, height]);

  return (
    <canvas
      ref={canvasRef}
      width={barCount * 8}
      height={height}
      className="inline-block rounded-lg"
    />
  );
};
