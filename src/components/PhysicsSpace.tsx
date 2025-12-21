'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Matter from 'matter-js';
import { FileCode, FileJson, FileText, FileType2 } from 'lucide-react';

// Configuration for the nodes
const NODES_CONFIG = [
    { id: 'about', label: 'ABOUT_ME.MD', subLabel: 'My Journey', icon: FileText, color: 'text-blue-400', width: 220, height: 100 },
    { id: 'projects', label: 'PROJECTS.JSON', subLabel: 'Recent Work', icon: FileJson, color: 'text-yellow-400', width: 220, height: 100 },
    { id: 'experiences', label: 'EXPERIENCES.MD', subLabel: 'Skills & Tools', icon: FileCode, color: 'text-purple-400', width: 200, height: 100 },
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
    const router = useRouter();

    useEffect(() => {
        const sceneElement = sceneRef.current;
        if (!sceneElement) return;

        // 1. Setup Matter.js Engine
        const engine = Matter.Engine.create();
        engine.gravity.y = 0; // Zero gravity
        engineRef.current = engine;

        const render = Matter.Render.create({
            element: sceneElement,
            engine: engine,
            options: {
                width: sceneElement.clientWidth,
                height: sceneElement.clientHeight,
                wireframes: false,
                background: 'transparent',
                showAngleIndicator: false,
            },
        });

        // 2. Create Bodies (Nodes)
        const centerX = sceneElement.clientWidth / 2;
        const centerY = sceneElement.clientHeight / 2;

        const bodies = NODES_CONFIG.map((config) => {
            const x = centerX + (Math.random() - 0.5) * 200;
            const y = centerY + (Math.random() - 0.5) * 200;

            const body = Matter.Bodies.rectangle(x, y, config.width, config.height, {
                label: config.id,
                chamfer: { radius: 10 },
                restitution: 0.9,
                frictionAir: 0.001, // Reduced friction for better floating
                density: 0.001,
            });

            // Add initial random velocity
            Matter.Body.setVelocity(body, {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2,
            });

            // Add initial random rotation
            Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.02);

            return body;
        });

        // 3. Create Walls (and handle resize)
        let walls: Matter.Body[] = [];
        const createWalls = () => {
            // Remove existing walls if needed
            if (walls.length > 0) {
                Matter.World.remove(engine.world, walls);
            }
            const width = sceneElement.clientWidth || window.innerWidth;
            const height = sceneElement.clientHeight || window.innerHeight;
            const wallThick = 60;
            const wallOptions = { isStatic: true, render: { visible: false } };

            walls = [
                Matter.Bodies.rectangle(width / 2, -wallThick / 2, width, wallThick, wallOptions), // Top
                Matter.Bodies.rectangle(width / 2, height + wallThick / 2, width, wallThick, wallOptions), // Bottom
                Matter.Bodies.rectangle(width + wallThick / 2, height / 2, wallThick, height, wallOptions), // Right
                Matter.Bodies.rectangle(-wallThick / 2, height / 2, wallThick, height, wallOptions), // Left
            ];

            Matter.World.add(engine.world, walls);
        };

        createWalls();
        Matter.World.add(engine.world, bodies);

        // Resize Handler
        const handleResize = () => {
            // Update canvas size
            render.canvas.width = sceneElement.clientWidth;
            render.canvas.height = sceneElement.clientHeight;
            // Re-create walls
            createWalls();
        };
        window.addEventListener('resize', handleResize);


        // 4. Mouse Interaction
        // Attach to the container (sceneRef.current) to ensure events are captured even over React nodes
        const mouse = Matter.Mouse.create(sceneElement);
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
        // Matter.Render.run(render); 

        // Add gentle continuous force (floating effect)
        Matter.Events.on(engine, 'beforeUpdate', () => {
            bodies.forEach(body => {
                // Apply tiny random force
                Matter.Body.applyForce(body, body.position, {
                    x: (Math.random() - 0.5) * 0.00001,
                    y: (Math.random() - 0.5) * 0.00001
                });
            });
        });

        // 6. Sync Loop (Physics -> React State)
        let animationFrameId: number;
        const updateReactState = () => {
            // Only update if engine exists
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
            window.removeEventListener('resize', handleResize);
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
            cancelAnimationFrame(animationFrameId);
            if (engineRef.current) {
                Matter.World.clear(engineRef.current.world, false);
                Matter.Engine.clear(engineRef.current);
            }
            // Be careful not to remove the canvas if we want to recycle, but here we rebuild.
            if (render.canvas && sceneElement) {
                render.canvas.remove();
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
                        onPointerDown={(e) => {
                            e.currentTarget.dataset.startX = e.clientX.toString();
                            e.currentTarget.dataset.startY = e.clientY.toString();
                        }}
                        onPointerUp={(e) => {
                            const startX = parseFloat(e.currentTarget.dataset.startX || '0');
                            const startY = parseFloat(e.currentTarget.dataset.startY || '0');
                            const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
                            if (dist < 5) {
                                router.push('/' + config.id);
                            }
                        }}
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
                        <div className="flex items-center space-x-2 mb-1 pointer-events-none">
                            <config.icon size={20} className={config.color} />
                            <span className="font-mono text-sm text-slate-200 font-bold group-hover:text-white transition-colors">
                                {config.label}
                            </span>
                        </div>
                        {/* Subtitle */}
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold group-hover:text-slate-400 pointer-events-none">
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
