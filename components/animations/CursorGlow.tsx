'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CursorGlow: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  // Position motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs to add elegant lag and momentum
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  useEffect(() => {
    // Only activate cursor glow on desktop devices with precise pointers
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setIsEnabled(true);
      // Offset by half of glow width (300px / 2 = 150px)
      mouseX.set(e.clientX - 150);
      mouseY.set(e.clientY - 150);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  if (!isEnabled) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-50 mix-blend-screen opacity-60"
      style={{
        x: springX,
        y: springY,
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, rgba(6, 182, 212, 0.04) 45%, rgba(0, 0, 0, 0) 70%)',
      }}
    />
  );
};
export default CursorGlow;
