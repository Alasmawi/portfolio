import { motion } from 'framer-motion';

export default function DraggableCloud({
  Comp,
  size,
  color,
  opacity,
  left,
  top,
  duration,
  delay,
  containerRef,
}) {
  return (
    <div
      className="drift-item"
      style={{
        left,
        top,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
    >
      <motion.div
        className="pointer-events-auto cursor-grab active:cursor-grabbing"
        style={{ color, opacity }}
        drag
        dragConstraints={containerRef}
        dragElastic={0.4}
        dragSnapToOrigin
        dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
        whileHover={{ scale: 1.22 }}
        whileDrag={{ scale: 1.3 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Comp size={size} />
      </motion.div>
    </div>
  );
}
