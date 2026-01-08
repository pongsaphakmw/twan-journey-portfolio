'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Experience } from '@/data/experiences';
import { Calendar, Briefcase, Code } from 'lucide-react';

interface PlanetCardProps {
    experience: Experience;
    index: number;
}

const PlanetCard = ({ experience, index }: PlanetCardProps) => {
    const isEven = index % 2 === 0;

    return (
        <div className={`flex w-full mb-32 relative ${isEven ? 'justify-start' : 'justify-end'}`}>
            {/* Connector Line to Center */}
            <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`absolute top-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent ${isEven ? 'right-0' : 'left-0'}`}
            />

            {/* Planet/Card Container */}
            <motion.div
                initial={{ opacity: 0, x: isEven ? -50 : 50, scale: 0.8 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring" }}
                className={`relative z-10 w-full max-w-xl p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden group hover:border-white/20 transition-colors ${isEven ? 'mr-12' : 'ml-12'}`}
            >
                {/* Zero Gravity Float Effect wrapper */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                >
                    {/* Decorative Planet Orb (Background) */}
                    <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${isEven ? 'bg-blue-500' : 'bg-purple-500'}`} />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">{experience.title}</h3>
                            <span className="px-3 py-1 text-xs font-mono text-blue-200 bg-blue-500/20 rounded-full border border-blue-500/30">
                                {experience.type}
                            </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-300 mb-6 font-mono">
                            <div className="flex items-center">
                                <Briefcase className="w-4 h-4 mr-2 text-blue-400" />
                                {experience.company}
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                                {experience.period}
                            </div>
                        </div>

                        <p className="text-gray-300 mb-6 leading-relaxed">
                            {experience.description}
                        </p>

                        {experience.details && (
                            <ul className="mb-6 space-y-2 text-sm text-gray-400 list-disc list-inside">
                                {experience.details.map((detail, i) => (
                                    <li key={i}>{detail}</li>
                                ))}
                            </ul>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {experience.technologies.map((tech) => (
                                <span key={tech} className="px-2 py-1 text-xs text-white/70 bg-white/5 rounded border border-white/10 flex items-center">
                                    <Code className="w-3 h-3 mr-1" />
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PlanetCard;
