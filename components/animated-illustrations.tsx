"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import dynamic from "next/dynamic"

export const ContactHeroIllustration = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Delay activation of animations until component is visible
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Use simpler animations when reduced motion is preferred
  const animationDuration = prefersReducedMotion ? 0.5 : 2;
  
  // Only render detailed animations if component is visible
  if (!isVisible) return null;
  
  return (
    <div 
      className="absolute right-0 top-0 h-full w-full overflow-hidden opacity-20 md:opacity-30"
      style={{ willChange: 'transform' }} // Performance hint for browser
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute right-0 top-0"
        preserveAspectRatio="xMaxYMin meet"
      >
        <motion.path
          d="M600,300 Q650,150 700,300 T800,300"
          stroke="white"
          strokeWidth="2"
          fill="transparent"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: animationDuration, ease: "easeInOut" }}
        />
        <motion.path
          d="M500,400 Q550,250 600,400 T700,400"
          stroke="white"
          strokeWidth="2"
          fill="transparent"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: animationDuration, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.circle
          cx="650"
          cy="250"
          r="15"
          fill="white"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.5 }}
        />
        <motion.circle
          cx="600"
          cy="300"
          r="8"
          fill="white"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.9 }}
        />
      </svg>
    </div>
  )
}

export const FormIllustration = () => {
  return (
    <div className="absolute -right-16 -top-16 z-0 h-64 w-64 opacity-10 md:opacity-20">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M140.5 30C149.5 39 158.5 48 162.5 59.5C166.5 71 165.5 85 159 97.5C152.5 110 140.5 121 128 131.5C115.5 142 102.5 152 87.5 156.5C72.5 161 55.5 160 42.5 152.5C29.5 145 20.5 131 15 115C9.5 99 7.5 81 13.5 66.5C19.5 52 33.5 41 48.5 33C63.5 25 79.5 20 96 19.5C112.5 19 129.5 23 140.5 30Z"
          fill="currentColor"
          className="text-primary dark:text-primary-400"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.path
          d="M65 80L90 105L135 60"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="transparent"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
        />
      </svg>
    </div>
  )
}

export const MessageIllustration = () => {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true)
      setTimeout(() => setAnimate(false), 3000)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute -bottom-12 -left-12 z-0 h-64 w-64 opacity-10 md:opacity-20">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.rect
          x="40"
          y="50"
          width="120"
          height="80"
          rx="10"
          fill="currentColor"
          className="text-secondary dark:text-secondary-400"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <motion.path
          d="M40 60L100 100L160 60"
          stroke="white"
          strokeWidth="4"
          fill="transparent"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.circle
          cx="100"
          cy="150"
          r="10"
          fill="currentColor"
          className="text-secondary dark:text-secondary-400"
          initial={{ scale: 1 }}
          animate={{ scale: animate ? 1.5 : 1, opacity: animate ? 0 : 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.circle
          cx="100"
          cy="150"
          r="20"
          stroke="currentColor"
          className="text-secondary dark:text-secondary-400"
          strokeWidth="2"
          fill="transparent"
          initial={{ scale: 1 }}
          animate={{ scale: animate ? 2 : 1, opacity: animate ? 0 : 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        />
        <motion.circle
          cx="100"
          cy="150"
          r="30"
          stroke="currentColor"
          className="text-secondary dark:text-secondary-400"
          strokeWidth="1"
          fill="transparent"
          initial={{ scale: 1 }}
          animate={{ scale: animate ? 2.5 : 1, opacity: animate ? 0 : 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
        />
      </svg>
    </div>
  )
}

export const LocationIllustration = () => {
  return (
    <div className="absolute -bottom-8 -right-8 z-0 h-64 w-64 opacity-10 md:opacity-20">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M100 30C83.4315 30 70 43.4315 70 60C70 80 100 130 100 130C100 130 130 80 130 60C130 43.4315 116.569 30 100 30Z"
          fill="currentColor"
          className="text-primary dark:text-primary-400"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <motion.circle
          cx="100"
          cy="60"
          r="10"
          fill="white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.8 }}
        />
        <motion.path
          d="M70 150H130"
          stroke="currentColor"
          className="text-primary dark:text-primary-400"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 1 }}
        />
        <motion.path
          d="M80 165H120"
          stroke="currentColor"
          className="text-primary dark:text-primary-400"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 1.2 }}
        />
        <motion.path
          d="M90 180H110"
          stroke="currentColor"
          className="text-primary dark:text-primary-400"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 1.4 }}
        />
      </svg>
    </div>
  )
}

export const SocialIllustration = () => {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true)
      setTimeout(() => setAnimate(false), 3000)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute -bottom-8 -left-8 z-0 h-64 w-64 opacity-10 md:opacity-20">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.circle
          cx="60"
          cy="60"
          r="15"
          fill="currentColor"
          className="text-tertiary dark:text-tertiary/80"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <motion.circle
          cx="140"
          cy="60"
          r="15"
          fill="currentColor"
          className="text-tertiary dark:text-tertiary/80"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        />
        <motion.circle
          cx="100"
          cy="140"
          r="15"
          fill="currentColor"
          className="text-tertiary dark:text-tertiary/80"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        />
        <motion.path
          d="M60 60L100 140"
          stroke="currentColor"
          className="text-tertiary dark:text-tertiary/80"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
        />
        <motion.path
          d="M140 60L100 140"
          stroke="currentColor"
          className="text-tertiary dark:text-tertiary/80"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.8 }}
        />
        <motion.path
          d="M60 60L140 60"
          stroke="currentColor"
          className="text-tertiary dark:text-tertiary/80"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 1 }}
        />
        <motion.circle
          cx="60"
          cy="60"
          r="25"
          stroke="currentColor"
          className="text-tertiary dark:text-tertiary/80"
          strokeWidth="2"
          fill="transparent"
          initial={{ scale: 1 }}
          animate={{ scale: animate ? 1.5 : 1, opacity: animate ? 0 : 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.circle
          cx="140"
          cy="60"
          r="25"
          stroke="currentColor"
          className="text-tertiary dark:text-tertiary/80"
          strokeWidth="2"
          fill="transparent"
          initial={{ scale: 1 }}
          animate={{ scale: animate ? 1.5 : 1, opacity: animate ? 0 : 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        />
        <motion.circle
          cx="100"
          cy="140"
          r="25"
          stroke="currentColor"
          className="text-tertiary dark:text-tertiary/80"
          strokeWidth="2"
          fill="transparent"
          initial={{ scale: 1 }}
          animate={{ scale: animate ? 1.5 : 1, opacity: animate ? 0 : 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
        />
      </svg>
    </div>
  )
}

export const MapIllustration = () => {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    // Start animation after initial render
    setAnimate(true)
    // Set up interval to repeat animation
    const interval = setInterval(() => {
      setAnimate(false)
      setTimeout(() => setAnimate(true), 300)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 z-0 opacity-10">
      <svg viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        {/* Map grid */}
        <motion.path
          d="M0 50H800M0 100H800M0 150H800M0 200H800M0 250H800M0 300H800M0 350H800"
          stroke="currentColor"
          strokeWidth="1"
          className="text-muted-foreground dark:text-muted-foreground/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2 }}
        />
        <motion.path
          d="M50 0V400M100 0V400M150 0V400M200 0V400M250 0V400M300 0V400M350 0V400M400 0V400M450 0V400M500 0V400M550 0V400M600 0V400M650 0V400M700 0V400M750 0V400"
          stroke="currentColor"
          strokeWidth="1"
          className="text-muted-foreground dark:text-muted-foreground/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 0.5 }}
        />

        {/* Roads */}
        <motion.path
          d="M200 100C200 100 300 150 400 150C500 150 600 100 600 100"
          stroke="currentColor"
          strokeWidth="6"
          className="text-muted-foreground dark:text-muted-foreground/70"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        <motion.path
          d="M400 150V350"
          stroke="currentColor"
          strokeWidth="6"
          className="text-muted-foreground dark:text-muted-foreground/70"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
        />

        {/* Location pin */}
        <motion.path
          d="M400 200C391.716 200 385 206.716 385 215C385 225 400 245 400 245C400 245 415 225 415 215C415 206.716 408.284 200 400 200Z"
          fill="currentColor"
          className="text-primary dark:text-primary-400"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 3 }}
        />
        <motion.circle
          cx="400"
          cy="215"
          r="5"
          fill="white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 3.5 }}
        />

        {/* Pulse effect */}
        <motion.circle
          cx="400"
          cy="215"
          r="15"
          stroke="currentColor"
          className="text-primary dark:text-primary-400"
          strokeWidth="2"
          fill="transparent"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: animate ? 3 : 1, opacity: animate ? 0 : 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </svg>
    </div>
  )
}

export const WaveAnimation = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="h-12 w-full fill-background dark:fill-background md:h-16"
      >
        <motion.path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,141.14,213.2,141.14c67.6,0,124.85-16.82,180.19-39.06a258.34,258.34,0,0,1,39.65-16.81Z"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
    </div>
  )
}
