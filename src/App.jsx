import * as THREE from 'three';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { Image, ScrollControls, useScroll, Billboard, Text } from '@react-three/drei';
import { easing, geometry } from 'maath';

// Generate random words for labels (you can replace this with your own word generator)
const generate = (options) => {
  const words = ['Spring', 'Summer', 'Autumn', 'Winter', 'Nature', 'Season'];
  return Array(options.exactly).fill().map(() => words[Math.floor(Math.random() * words.length)]);
};

extend(geometry);

export const App = () => (
  <Canvas dpr={[1, 1.5]}>
    <ScrollControls pages={4} infinite>
      <Scene position={[0, 1.5, 0]} />
    </ScrollControls>
  </Canvas>
);

function Scene({ children, ...props }) {
  const ref = useRef();
  const scroll = useScroll();
  const [hovered, hover] = useState(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y = -scroll.offset * (Math.PI * 2);
      state.events.update();
      easing.damp3(state.camera.position, [-state.pointer.x * 2, state.pointer.y * 2 + 4.5, 9], 0.3, delta);
      state.camera.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={ref} {...props}>
      <Cards category="spring" from={0} len={Math.PI / 4} onPointerOver={hover} onPointerOut={hover} />
      <Cards category="summer" from={Math.PI / 4} len={Math.PI / 2} position={[0, 0.4, 0]} onPointerOver={hover} onPointerOut={hover} />
      <Cards category="autumn" from={Math.PI / 4 + Math.PI / 2} len={Math.PI / 2} onPointerOver={hover} onPointerOut={hover} />
      <Cards category="winter" from={Math.PI * 1.25} len={Math.PI * 2 - Math.PI * 1.25} position={[0, -0.4, 0]} onPointerOver={hover} onPointerOut={hover} />
      {hovered !== null && <ActiveCard hovered={hovered} />}
    </group>
  );
}

function Cards({ category, from = 0, len = Math.PI * 2, radius = 5.25, onPointerOver, onPointerOut, ...props }) {
  const [hovered, hover] = useState(null);
  const amount = Math.round(len * 22);
  const textPosition = from + (amount / 2 / amount) * len;

  return (
    <group {...props}>
      <Billboard position={[Math.sin(textPosition) * radius * 1.4, 0.5, Math.cos(textPosition) * radius * 1.4]}>
        <Text fontSize={0.25} anchorX="center" color="black">
          {category}
        </Text>
      </Billboard>
      {Array.from({ length: amount - 3 }, (_, i) => {
        const angle = from + (i / amount) * len;
        return (
          <Card
            key={angle}
            onPointerOver={(e) => {
              e.stopPropagation();
              hover(i);
              onPointerOver(i);
            }}
            onPointerOut={() => {
              hover(null);
              onPointerOut(null);
            }}
            position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
            rotation={[0, Math.PI / 2 + angle, 0]}
            active={hovered !== null}
            hovered={hovered === i}
            url={`/img${(i % 10) + 1}.jpg`}
          />
        );
      })}
    </group>
  );
}

function Card({ url, active, hovered, ...props }) {
  const groupRef = useRef();
  const imageRef = useRef();
  const [loaded, setLoaded] = useState(true);
  const initialPosition = useRef(props.position || [0, 0, 0]);

  useFrame((state, delta) => {
    if (imageRef.current) {
      const f = hovered ? 1.4 : active ? 1.25 : 1;
      const targetY = hovered ? 0.25 : 0;
      
      easing.damp3(
        imageRef.current.position,
        [0, targetY, 0],
        0.1,
        delta
      );
      
      easing.damp3(
        imageRef.current.scale,
        [1.618 * f, 1 * f, 1],
        0.15,
        delta
      );
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {loaded ? (
        <Image 
          ref={imageRef} 
          transparent 
          radius={0.075} 
          url={url} 
          scale={[1.618, 1, 1]} 
          side={THREE.DoubleSide} 
          onError={() => setLoaded(false)}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <Text fontSize={0.2} color="red">Image Error</Text>
      )}
    </group>
  );
}

function ActiveCard({ hovered, ...props }) {
  const groupRef = useRef();
  const imageRef = useRef();
  const name = useMemo(() => generate({ exactly: 2 }).join(' '), [hovered]);
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    if (imageRef.current?.material) {
      imageRef.current.material.zoom = 0.8;
      setIsReady(true);
    }
  }, [hovered]);

  if (hovered === null) return null;

  return (
    <group ref={groupRef} {...props}>
      <Billboard>
        <Image 
          ref={imageRef} 
          transparent 
          url={`/img${(hovered % 10) + 1}.jpg`} 
          scale={[3.5, 1.618 * 3.5, 0.2]} 
          position={[0, 1.5, 0]} 
          visible={isReady} 
        />
        <Text 
          fontSize={0.5} 
          position={[2.15, 3.85, 0]} 
          anchorX="left" 
          color="black"
        >
          {name}
        </Text>
      </Billboard>
    </group>
  );
}

export default App;