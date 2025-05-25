import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

export default function CursorFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState(1);
  const [verticalRotation, setVerticalRotation] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const currentPosition = useRef({ x: 0, y: 0 });
  const moveTimeout = useRef<ReturnType<typeof setTimeout>>();

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;

      // Horizontal direction (left/right)
      if (newX < currentPosition.current.x && direction === 1) {
        setDirection(-1);
      } else if (newX > currentPosition.current.x && direction === -1) {
        setDirection(1);
      }

      // Vertical rotation (up/down)
      const verticalDiff = newY - currentPosition.current.y;
      if (Math.abs(verticalDiff) > 10) {
        const newRotation = Math.max(Math.min(verticalDiff * 0.2, 30), -30);
        setVerticalRotation(newRotation);
      }

      setMousePosition({
        x: newX,
        y: newY,
      });

      setIsMoving(true);
      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current);
      }

      moveTimeout.current = setTimeout(() => {
        setIsMoving(false);
        setVerticalRotation(0);
      }, 100);
    },
    [direction]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current);
      }
    };
  }, [handleMouseMove]);

  const handleUpdate = useCallback(() => {
    currentPosition.current = {
      x: mousePosition.x,
      y: mousePosition.y,
    };
  }, [mousePosition.x, mousePosition.y]);

  const runningAnimation = {
    running: {
      y: [-2, -4, -2, 0, -2],
      scale: [1, 1.1, 1.1, 1, 1],
      transition: {
        repeat: Infinity,
        duration: 0.5,
        ease: "linear",
      },
    },
    idle: {
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        zIndex: 9999,
        pointerEvents: "auto",
        width: "50px",
        height: "50px",
        transformOrigin: "center",
        cursor: "pointer",
        willChange: "transform",
      }}
      onClick={() => setIsVisible(false)}
      animate={{
        x: mousePosition.x - 25,
        y: mousePosition.y - 25,
        scaleX: direction,
        rotateZ: verticalRotation,
      }}
      exit={{ opacity: 0, scale: 0 }}
      onUpdate={handleUpdate}
      transition={{
        x: {
          type: "tween",
          duration: 1.5,
          ease: "linear",
        },
        y: {
          type: "tween",
          duration: 1.5,
          ease: "linear",
        },
        scaleX: {
          type: "tween",
          duration: 0.15,
          ease: "easeOut",
        },
        rotateZ: {
          type: "spring",
          stiffness: 200,
          damping: 20,
        },
      }}
    >
      <motion.img
        src="/images/cursor-follower.gif"
        alt="Duck Follower"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transformOrigin: "center",
          willChange: "transform",
        }}
        variants={runningAnimation}
        animate={isMoving ? "running" : "idle"}
        loading="eager"
      />
    </motion.div>
  );
}
