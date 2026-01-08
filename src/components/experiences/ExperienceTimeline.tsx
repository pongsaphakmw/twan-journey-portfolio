'use client';

import React, { useRef } from 'react';
import { useScroll } from 'framer-motion';
import { experiences } from '@/data/experiences';
import Rocket from './Rocket';
import PlanetCard from './PlanetCard';
import Starfield from './Starfield';
import SpaceDust from './SpaceDust';

const ExperienceTimeline = () => {
    // This ref attaches to the SCROLLABLE container
    const containerRef = useRef<HTMLDivElement>(null);

    // We track the scroll progress of THIS container
    const { scrollYProgress } = useScroll({
        container: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        // The scroll container. Replaces 'min-h-screen' with 'h-full' to fit in layout. 
        // 'sticky' children will stick to this container's viewport.
        <div
            ref={containerRef}
            className="relative w-full h-full bg-[#050b14] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        >
            {/* Background Layer - Sticky to stay in view */}
            <div className="sticky top-0 left-0 w-full h-full pointer-events-none z-0">
                <Starfield />
                <SpaceDust />
            </div>

            {/* Rocket Layer - Sticky to stay in view */}
            <div className="sticky top-0 left-0 w-full h-full pointer-events-none z-30 flex justify-center">
                <div className="relative w-full max-w-7xl h-full">
                    <Rocket scrollYProgress={scrollYProgress} />
                </div>
            </div>

            {/* Scrollable Content */}
            {/* We need to push content down a bit so it doesn't start under the header immediately if there was one, 
                but here we just flow naturally.
                Note: Since we have sticky layers covering the usage area above, we place content *relative* 
                and ensure z-index puts it in right place.
                The visual content needs to "scroll" past the sticky viewport.
            */}
            <div className="relative z-10 w-full -mt-[200vh]">
                {/* 
                   Hack/Trick: The sticky containers take up height in the flow? 
                   If top:0 and h-full, they take up 100% height EACH if position isn't handled?
                   'sticky' acts like relative until scrolled. 
                   We want them to overlap. 
                   Better approach: Grid stacking.
                */}
            </div>

            {/* 
                Let's use a Grid approach for correct stacking without negative margins hacks which break easily.
                Grid area: 1 / 1 / -1 / -1
            */}

        </div>
    );
};

// Re-write to use Grid for cleaner stacking context of scroll vs sticky
const ExperienceTimelineGrid = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        container: containerRef,
    });

    return (
        <div ref={containerRef} className="h-full w-full overflow-y-auto bg-[#050b14] relative">

            {/* Sticky Wrapper for Background & Rocket */}
            {/* This div stays fixed relative to the scrolling viewport */}
            <div className="sticky top-0 h-full w-full pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
                {/* Backgrounds */}
                <div className="absolute inset-0 z-0">
                    <Starfield />
                    <SpaceDust />
                </div>

                {/* Rocket */}
                <div className="absolute inset-0 z-30 flex justify-center">
                    <div className="relative w-full max-w-7xl h-full">
                        <Rocket scrollYProgress={scrollYProgress} />
                    </div>
                </div>
            </div>

            {/* Scrollable Content Layer */}
            {/* This renders AFTER the sticky block in DOM but we pull it up so it overlays? 
                Actually, if we have a sticky block of h-full, the content starts AFTER one screen height.
                That's actually fine! It gives a nice intro space. 
                But if we want content to start earlier, we can use negative margin on the content wrapper.
            */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 -mt-[90vh] pb-32 flex flex-col items-center pointer-events-auto">
                {/* Header */}
                <div className="text-center mb-32 pt-32">
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 mb-6 font-sans">Mission Log</h1>
                    <p className="text-blue-200/60 text-lg max-w-2xl mx-auto font-sans">
                        Scroll to travel back in time through my professional universe.
                    </p>
                </div>

                {/* Central Timeline Track */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent border-r border-dashed border-white/10 h-full" />

                {/* Experience Planets */}
                <div className="w-full space-y-32">
                    {experiences.map((exp, index) => (
                        <PlanetCard key={exp.id} experience={exp} index={index} />
                    ))}
                </div>

                {/* Bottom/Start of Time */}
                <div className="mt-32 text-center text-white/30 text-sm font-mono">
                    [ TIME ORIGIN REACHED ]
                </div>
            </div>
        </div>
    );
};

export default ExperienceTimelineGrid;
