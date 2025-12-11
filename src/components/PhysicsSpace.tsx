'use client';

import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { FileCode, FileJson, FileText, FileType2 } from 'lucide-react';

// Configuration for the nodes
const NODES_CONFIG = [
    { id: 'about', label: 'ABOUT_ME.MD', subLabel: 'My Journey', icon: FileText, color: 'text-blue-400', width: 220, height: 100 },
    { id: 'projects', label: 'PROJECTS.JSON', subLabel: 'Recent Work', icon: FileJson, color: 'text-yellow-400', width: 220, height: 100 },
    { id: 'stack', label: 'STACK.YML', subLabel: 'Skills & Tools', icon: FileCode, color: 'text-purple-400', width: 200, height: 100 },
    { id: 'contact', label: 'CONTACT.TXT', subLabel: 'Get in Touch', icon: FileType2, color: 'text-green-400', width: 200, height: 100 },
];

interface PhysicsNodeState {
    id: string;
    x: number;
    y: number;
    angle: number;
}

export default function PhysicsSpace() {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const [nodes, setNodes] = useState<PhysicsNodeState[]>([]);

    useEffect(() => {
        if (!sceneRef.current) return;

        // 1. Setup Matter.js Engine
        const engine = Matter.Engine.create();
        engine.gravity.y = 0; // Zero gravity
        engineRef.current = engine;

        const render = Matter.Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: sceneRef.current.clientWidth,
                height: sceneRef.current.clientHeight,
                wireframes: false, // Set to true to debug physics bodies
                background: 'transparent', // We only want the physics, visual is via React
                showAngleIndicator: false,
            },
        });

        // 2. Create Bodies (Nodes)
        // Randomize initial positions slightly within the center area
        const centerX = sceneRef.current.clientWidth / 2;
        const centerY = sceneRef.current.clientHeight / 2;

        const bodies = NODES_CONFIG.map((config, index) => {
            const x = centerX + (Math.random() - 0.5) * 200;
            const y = centerY + (Math.random() - 0.5) * 100;

            return Matter.Bodies.rectangle(x, y, config.width, config.height, {
                label: config.id, // Use label to map back to config
                chamfer: { radius: 10 }, // Rounded corners for physics
                restitution: 0.9, // Bouncy
                frictionAir: 0.02, // Slow down a bit in "space"
                density: 0.001,
            });
        });

        // 3. Create Walls
        const wallOptions = { isStatic: true, render: { visible: false } };
        const width = sceneRef.current.clientWidth;
        const height = sceneRef.current.clientHeight;
        const wallThick = 60;

        const walls = [
            Matter.Bodies.rectangle(width / 2, -wallThick / 2, width, wallThick, wallOptions), // Top
            Matter.Bodies.rectangle(width / 2, height + wallThick / 2, width, wallThick, wallOptions), // Bottom
            Matter.Bodies.rectangle(width + wallThick / 2, height / 2, wallThick, height, wallOptions), // Right
            Matter.Bodies.rectangle(-wallThick / 2, height / 2, wallThick, height, wallOptions), // Left
        ];

        Matter.World.add(engine.world, [...bodies, ...walls]);

        // 4. Mouse Interaction
        const mouse = Matter.Mouse.create(render.canvas);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false },
            },
        });
        Matter.World.add(engine.world, mouseConstraint);

        // Keep the mouse in sync with rendering
        render.mouse = mouse;

        // 5. Run the engine
        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, engine);
        // Matter.Render.run(render); // Optional: Uncomment to see the physics debug view

        // 6. Sync Loop (Physics -> React State)
        let animationFrameId: number;
        const updateReactState = () => {
            const newNodesState = bodies.map((body) => ({
                id: body.label,
                x: body.position.x,
                y: body.position.y,
                angle: body.angle,
            }));
            setNodes(newNodesState);
            animationFrameId = requestAnimationFrame(updateReactState);
        };
        updateReactState();

        // Cleanup
        return () => {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
            cancelAnimationFrame(animationFrameId);
            if (engineRef.current) {
                Matter.World.clear(engineRef.current.world, false);
                Matter.Engine.clear(engineRef.current);
            }
        };
    }, []);

    // Helper to find config and state for rendering
    const getNodeData = (config: typeof NODES_CONFIG[0]) => {
        const state = nodes.find((n) => n.id === config.id);
        return state ? { ...config, ...state } : null;
    };

    return (
        <div className="relative w-full h-full overflow-hidden bg-transparent" ref={sceneRef}>
            {/* Instructions / subtle background text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <div className="text-6xl font-black text-slate-500 tracking-tighter">
                    ZERO GRAVITY
                </div>
            </div>

            {/* Render the React Nodes based on Physics State */}
            {NODES_CONFIG.map((config) => {
                const data = getNodeData(config);
                if (!data) return null;

                return (
                    <div
                        key={config.id}
                        className="absolute flex flex-col items-center justify-center backdrop-blur-md bg-slate-900/40 border border-slate-700/50 shadow-lg cursor-grab active:cursor-grabbing hover:border-slate-500/80 transition-colors select-none group"
                        style={{
                            width: config.width,
                            height: config.height,
                            borderRadius: '12px',
                            left: 0,
                            top: 0,
                            // Translate to physics position (centering the div on the coordinate)
                            transform: `translate(${data.x - config.width / 2}px, ${data.y - config.height / 2}px) rotate(${data.angle}rad)`,
                        }}
                    >
                        {/* Header / Icon */}
                        <div className="flex items-center space-x-2 mb-1">
                            <config.icon size={20} className={config.color} />
                            <span className="font-mono text-sm text-slate-200 font-bold group-hover:text-white transition-colors">
                                {config.label}
                            </span>
                        </div>
                        {/* Subtitle */}
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold group-hover:text-slate-400">
                            {config.subLabel}
                        </span>

                        {/* Decoration corners */}
                        <div className="absolute top-1 left-1 w-1 h-1 bg-slate-600/50 rounded-full" />
                        <div className="absolute top-1 right-1 w-1 h-1 bg-slate-600/50 rounded-full" />
                        <div className="absolute bottom-1 left-1 w-1 h-1 bg-slate-600/50 rounded-full" />
                        <div className="absolute bottom-1 right-1 w-1 h-1 bg-slate-600/50 rounded-full" />
                    </div>
                );
            })}
        </div>
    );
}
