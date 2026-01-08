'use client';

import React, { useEffect, useRef } from 'react';

const SpaceDust = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: { x: number; y: number; size: number; alpha: number; speedY: number; speedX: number }[] = [];

        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            initParticles();
        };

        const initParticles = () => {
            // Fewer, larger, softer particles
            const count = 30;
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 1,
                    alpha: Math.random() * 0.5 + 0.1,
                    speedY: Math.random() * 0.5 - 0.25,
                    speedX: Math.random() * 0.5 - 0.25,
                });
            }
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = '#bad7ff'; // Light blueish dust
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#bad7ff';

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Move
                p.y += p.speedY;
                p.x += p.speedX;

                // Wrap
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;

                // Twinkle
                p.alpha += (Math.random() - 0.5) * 0.02;
                if (p.alpha < 0.1) p.alpha = 0.1;
                if (p.alpha > 0.6) p.alpha = 0.6;
            });

            ctx.shadowBlur = 0; // Reset
            animationFrameId = requestAnimationFrame(drawParticles);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        drawParticles();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-[1]"
        />
    );
};

export default SpaceDust;
