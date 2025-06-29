// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";

// const PageTransition: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const location = useLocation();
//   const [displayLocation, setDisplayLocation] = useState(location);
//   const [transitionStage, setTransitionStage] = useState("fadeIn");

//   useEffect(() => {
//     if (location !== displayLocation) {
//       setTransitionStage("fadeOut");
//     }
//   }, [location, displayLocation]);

//   const handleAnimationEnd = () => {
//     if (transitionStage === "fadeOut") {
//       setTransitionStage("fadeIn");
//       setDisplayLocation(location);
//     }
//   };

//   return (
//     <div
//       className={`page-transition ${transitionStage}`}
//       onAnimationEnd={handleAnimationEnd}
//     >
//       {children}
//     </div>
//   );
// };

// export default PageTransition;

import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const PageTransition: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;

// import React, { useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useLocation } from "react-router-dom";
// import * as THREE from "three";
// import { Canvas, useFrame } from "@react-three/fiber";

// // ✅ RotatingSphere component: must be inside <Canvas>
// const RotatingSphere = () => {
//   const sphereRef = useRef<THREE.Mesh>(null);

//   useFrame(() => {
//     if (sphereRef.current) {
//       sphereRef.current.rotation.x += 0.01;
//       sphereRef.current.rotation.y += 0.01;
//     }
//   });

//   return (
//     <mesh ref={sphereRef}>
//       <sphereGeometry args={[1, 32, 32]} />
//       <meshStandardMaterial color="hotpink" />
//     </mesh>
//   );
// };

// const PageTransition: React.FC<{
//   children: React.ReactNode;
//   pageName: string;
// }> = ({ children, pageName }) => {
//   const location = useLocation();

//   const transitionVariants = {
//     initial: (direction: number) => ({
//       opacity: 0,
//       clipPath: "circle(0% at 50% 50%)",
//       x: direction > 0 ? 50 : -50,
//       scale: 0.9,
//     }),
//     animate: {
//       opacity: 1,
//       clipPath: "circle(100% at 50% 50%)",
//       x: 0,
//       scale: 1,
//       transition: {
//         duration: 0.7,
//         ease: [0.33, 1, 0.68, 1],
//       },
//     },
//     exit: (direction: number) => ({
//       opacity: 0,
//       clipPath: "circle(0% at 50% 50%)",
//       x: direction < 0 ? 50 : -50,
//       scale: 1.1,
//       transition: {
//         duration: 0.5,
//         ease: [0.33, 1, 0.68, 1],
//       },
//     }),
//   };

//   return (
//     <div
//       className="page-transition-container"
//       style={{ position: "relative", overflow: "hidden" }}
//     >
//       <AnimatePresence initial={false} custom={location.pathname.length}>
//         <motion.div
//           key={location.pathname}
//           variants={transitionVariants}
//           initial="initial"
//           animate="animate"
//           exit="exit"
//           custom={location.pathname.length}
//           style={{
//             position: "absolute",
//             width: "100%",
//             top: 0,
//             left: 0,
//           }}
//         >
//           {/* Optional Canvas-based background or effect */}
//           <Canvas style={{ width: "100%", height: "300px" }}>
//             <ambientLight />
//             <pointLight position={[10, 10, 10]} />
//             <RotatingSphere />
//           </Canvas>

//           {/* Page content */}
//           <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
//         </motion.div>
//       </AnimatePresence>
//     </div>
//   );
// };

// export default PageTransition;
