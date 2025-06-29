
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BlockchainVisualization = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x8B5CF6, 2, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Create blockchain blocks
    const blocks: THREE.Mesh[] = [];
    const blockGeometry = new THREE.BoxGeometry(1, 0.5, 0.2);
    
    // Create materials with different colors
    const blockMaterials = [
      new THREE.MeshPhongMaterial({ color: 0x8B5CF6, transparent: true, opacity: 0.8 }),
      new THREE.MeshPhongMaterial({ color: 0x9b87f5, transparent: true, opacity: 0.8 }),
      new THREE.MeshPhongMaterial({ color: 0x0FA0CE, transparent: true, opacity: 0.8 })
    ];
    
    // Create blockchain blocks
    for (let i = 0; i < 7; i++) {
      const materialIndex = i % blockMaterials.length;
      const block = new THREE.Mesh(blockGeometry, blockMaterials[materialIndex]);
      block.position.y = i * 0.7 - 2;
      block.position.x = Math.sin(i * 0.4) * 0.3;
      block.position.z = Math.cos(i * 0.4) * 0.3;
      blocks.push(block);
      scene.add(block);
    }
    
    // Create connections between blocks
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x9b87f5, transparent: true, opacity: 0.5 });
    
    for (let i = 0; i < blocks.length - 1; i++) {
      const points = [];
      points.push(new THREE.Vector3(blocks[i].position.x, blocks[i].position.y, blocks[i].position.z));
      points.push(new THREE.Vector3(blocks[i + 1].position.x, blocks[i + 1].position.y, blocks[i + 1].position.z));
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    }
    
    // Add small spheres as data nodes
    const sphereGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x0FA0CE, transparent: true, opacity: 0.8 });
    
    for (let i = 0; i < 15; i++) {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2
      );
      scene.add(sphere);
      
      // Animate each sphere
      const animate = () => {
        sphere.position.x += Math.sin(Date.now() * 0.001 + i) * 0.002;
        sphere.position.y += Math.cos(Date.now() * 0.001 + i) * 0.002;
      };
      
      // Add animation function to the sphere
      (sphere as any).animate = animate;
    }
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Animate blocks
      blocks.forEach((block, index) => {
        block.rotation.x = Math.sin(Date.now() * 0.001 + index * 0.2) * 0.1;
        block.rotation.y = Math.sin(Date.now() * 0.001 + index * 0.3) * 0.1;
      });
      
      // Animate spheres
      scene.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry && (child as any).animate) {
          (child as any).animate();
        }
      });
      
      // Slowly rotate entire scene
      scene.rotation.y = Date.now() * 0.0001;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px]"></div>
  );
};

export default BlockchainVisualization;
