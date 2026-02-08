import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

function useMediaQuery(minWidth) {
    const [matches, setMatches] = useState(typeof window !== 'undefined' && window.innerWidth >= minWidth);
    useEffect(() => {
        const m = window.matchMedia(`(min-width: ${minWidth}px)`);
        setMatches(m.matches);
        const fn = () => setMatches(m.matches);
        m.addEventListener('change', fn);
        return () => m.removeEventListener('change', fn);
    }, [minWidth]);
    return matches;
}

export default function BentoCard({ children, colSpan = 1, rowSpan = 1, colStart, rowStart, staggerDelay = 0, className = '' }) {
    const isMd = useMediaQuery(768);
    const spanClass = {
        1: 'md:col-span-1',
        2: 'md:col-span-2',
        3: 'md:col-span-3',
        4: 'md:col-span-4',
        5: 'md:col-span-5',
        6: 'md:col-span-6',
    };
    const rowClass = {
        1: 'md:row-span-1',
        2: 'md:row-span-2',
        3: 'md:row-span-3',
    };
    const placeStyle = isMd && colStart != null && rowStart != null
        ? { gridColumnStart: colStart, gridRowStart: rowStart }
        : {};

    return (
        <motion.div
            className={`${spanClass[colSpan] || spanClass[1]} ${rowClass[rowSpan] || rowClass[1]} ${className}`}
            style={Object.keys(placeStyle).length ? placeStyle : undefined}
            variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, ease: 'easeOut' },
                },
            }}
            transition={{ delay: staggerDelay }}
        >
            <div className="h-full p-6 md:p-8 rounded-2xl bg-white dark:bg-[#151725] border border-gray-200 dark:border-gray-800 transition-colors duration-300 hover:border-gray-300 dark:hover:border-gray-700">
                {children}
            </div>
        </motion.div>
    );
}
