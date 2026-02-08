import React from 'react';
import { motion } from 'motion/react';

export default function BentoGrid({ children, className = '' }) {
    return (
        <motion.div
            className={`grid grid-cols-1 md:grid-cols-6 md:grid-rows-3 gap-4 md:gap-5 ${className}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
                visible: {
                    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
                },
                hidden: {},
            }}
        >
            {children}
        </motion.div>
    );
}
