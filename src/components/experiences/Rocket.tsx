'use client';

import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';

interface RocketProps {
    scrollYProgress: MotionValue<number>;
}

const Rocket = ({ scrollYProgress }: RocketProps) => {
    // Map scroll progress to vertical position (top to bottom)
    // We want the rocket to stay somewhat visible/central or move slightly.
    // Actually, per requirements: "A Rocket SVG that follows the scroll position using useScroll and useTransform."
    // If it follows scroll position inside a relative container, we might want it fixed or moving.
    // "Traveling from the present (top) into the past (bottom)" -> Rocket moves down as we scroll down?
    // Or rocket stays fixed in viewport and world moves up?
    // "Rocket follows the scroll position" usually implies it tracks with the user's progress.

    // Let's make the rocket move down the track.
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '90%']);

    // Simulating steering: slightly rotate based on velocity (or just wobbling if velocity isn't easily accessible without a hook)
    // Ideally we use useVelocity but that reacts to speed. For now let's add a subtle wobble.

    return (
        <motion.div
            style={{ top: y }}
            className="absolute left-1/2 -translate-x-1/2 z-20 w-12 h-20 pointer-events-none"
        >
            {/* Simple Rocket SVG */}
            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-[0_0_15px_rgba(255,100,50,0.8)]"
            >
                <motion.path
                    d="M12 2C12 2 4 14 4 16C4 19 8 22 12 22C16 22 20 19 20 16C20 14 12 2 12 2Z"
                    fill="white"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M12 14C12 14 9 18 9 19C9 20 11 20 12 20C13 20 15 20 15 19C15 18 12 14 12 14Z"
                    fill="#333"
                />
                {/* Flame */}
                <motion.path
                    d="M12 22C12 22 10 24 10 26C10 28 12 30 12 30C12 30 14 28 14 26C14 24 12 22 12 22Z"
                    fill="#FF6432"
                    animate={{ pathLength: [0.8, 1, 0.8], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                />
            </svg>
        </motion.div>
    );
};

export default Rocket;
