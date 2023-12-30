"use client";

import React, { useEffect } from "react";
import { Canvas as ThreeCanvas, MeshProps, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  OrthographicCamera,
  Outlines,
} from "@react-three/drei";
import * as THREE from "three";
import { rotate } from "~/utils/rotate";
import electronCalculation from "~/utils/electronCalculation";
import calculatePositions, { Position } from "~/utils/positionSpheres";
import elementCalculation from "~/utils/elementCalculation";
import shuffle from "~/utils/shuffle";

export const Canvas: React.FC<{
  element: {atomicNumber: number, atomicMass: string};
}> = ({ element }) => {
  return (
    <ThreeCanvas className="absolute left-0 top-0 h-screen w-screen">
      <Scene atomicNumber={Number(element?.atomicNumber)} mass={Number(element.atomicMass.split("(")[0])} />
    </ThreeCanvas>
  );
};

const PROTON_NEUTRON_RADIUS = 0.4;

export const Proton = (props: MeshProps) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <mesh
      {...props}
      onClick={() => {
        console.log("Proton");
      }}
      onPointerLeave={() => {
        setHovered(false);
      }}
      onPointerOver={() => {
        setHovered(true);
      }}
    >
      <sphereGeometry args={[PROTON_NEUTRON_RADIUS, 16, 16]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "white"} />
      <Outlines
        thickness={0.08}
        color="black"
        screenspace={false}
        opacity={1}
        transparent={false}
        angle={0}
      />
    </mesh>
  );
};

export const Neutron = (props: MeshProps) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <mesh
      {...props}
      onClick={() => {
        console.log("Proton");
      }}
      onPointerLeave={() => {
        setHovered(false);
      }}
      onPointerOver={() => {
        setHovered(true);
      }}
    >
      <sphereGeometry args={[PROTON_NEUTRON_RADIUS, 16, 16]} />
      <meshStandardMaterial color={hovered ? "green" : "gray"} />
      <Outlines
        thickness={0.08}
        color="black"
        screenspace={false}
        opacity={1}
        transparent={false}
        angle={0}
      />
    </mesh>
  );
};

const getElectronLevelRadius = (level: number) => {
  return level + 2 + (level - 1) * 2;
};

export const Electron: React.FC<{
  initialAngle?: number;
  level?: number;
  rotationSpeed?: number;
}> = (props): JSX.Element => {
  const { initialAngle = 0, level = 1, rotationSpeed = 3 } = props;
  const meshRef = React.useRef<THREE.Mesh>(null);
  const radius = getElectronLevelRadius(level);
  const secondsRotation = 1 / rotationSpeed;
  const initial = rotate(0, 0, radius, radius, initialAngle);

  useFrame((state) => {
    if (!meshRef.current?.position) return;
    const position = meshRef.current.position;

    const et = state.clock.elapsedTime;
    const it = (et % secondsRotation) / secondsRotation;

    const [nx, ny] = rotate(0, 0, initial[0], initial[1], it * 360);
    if (!nx || !ny) return;

    position.set(nx, 0, ny);
  });

  return (
    // <Trail
    //   width={0.05} // Width of the line
    //   color={"#efefef"} // Color of the line
    //   length={20} // Length of the line
    //   decay={1} // How fast the line fades away
    //   interval={1} // Number of frames to wait before next calculation
    //   target={undefined} // Optional target. This object will produce the trail.
    // >
    <mesh {...props} ref={meshRef} position={[initial[0], 0, initial[1]]}>
      <sphereGeometry args={[0.125, 16, 16]} />
      <meshStandardMaterial color="white" />
      <Outlines
        thickness={0.08}
        color="black"
        screenspace={false}
        opacity={1}
        transparent={false}
        angle={0}
      />
    </mesh>
    // </Trail>
  );
};

const ROTATION_SPEED = 0.3;

const calculateElectrons = (atomicNumber: number) => {
  const electrons = [];
  const electronsLevels = electronCalculation(atomicNumber);
  for (let i = 0; i < electronsLevels.length; i++) {
    const electronsLevel = electronsLevels[i]!;
    const reverse = i % 2;
    const rotationSpeed = reverse ? ROTATION_SPEED : -ROTATION_SPEED;
    for (let j = 0; j < electronsLevel; j++) {
      electrons.push({
        initialAngle: j * (360 / electronsLevel),
        level: i + 1,
        rotationSpeed: rotationSpeed,
      });
    }
  }
  return electrons;
};

export const Scene: React.FC<{
  atomicNumber: number;
  mass: number;
}> = ({ atomicNumber, mass }): JSX.Element => {
  const cameraRef = React.useRef<THREE.OrthographicCamera>(null);
  const [parts, setParts] = React.useState<{
    protons: THREE.Vector3[];
    neutrons: THREE.Vector3[];
    electrons: {
      initialAngle: number;
      level: number;
      rotationSpeed: number;
    }[];
  }>({ protons: [], neutrons: [], electrons: [] });
  
  useFrame(() => {
    if (!cameraRef.current) return;
    cameraRef.current?.lookAt(new THREE.Vector3(0, 0, 0));
  });

  useEffect(() => {
    const counts = elementCalculation(atomicNumber, mass);

    const positions = shuffle(calculatePositions(
      counts.protons + counts.neutrons,
      PROTON_NEUTRON_RADIUS
    ));
    const protons: THREE.Vector3[] = [];
    const neutrons: THREE.Vector3[] = [];

    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      if (!position) continue;

      if (i < counts.protons) {
        protons.push( position );
      } else {
        neutrons.push( position );
      }
    }

    setParts({
      protons: protons,
      neutrons: neutrons,
      electrons: calculateElectrons(atomicNumber),
    })
    // setElectrons(calculateElectrons(atomicNumber));
    // setNeutrons(counts.neutrons);
  }, [atomicNumber]);

  return (
    <>
      {/* <StatsGl /> */}
      <OrthographicCamera
        ref={cameraRef}
        makeDefault
        position={[25, 25, 25]}
        zoom={15}
      />
      <OrbitControls />
      <directionalLight position={[15, 50, 5]} intensity={10} />
      <directionalLight position={[-15, -50, -5]} intensity={2} />
      <ambientLight intensity={1} />
      {/* <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="white" />
      </mesh> */}
      <React.Suspense fallback={null}>
        <mesh>
          {parts.protons.map((position: Position, index) => 
            <Proton
              position={[position.x, position.y, position.z]}
              key={index}
            />
          )}
          {parts.neutrons.map((position: Position, index) =>
            <Neutron
              position={[position.x, position.y, position.z]}
              key={index}
            />
          )}
        </mesh>

        {/* <Proton position={[-0.7, 0, -0.7]} />
        <Proton position={[-0.7, 0, -0.7]} />
        <Proton position={[0.7, 0, 0.7]} />
        <Neutron position={[-1, 0, 1]} />
        <Neutron position={[1, 0, -1]} /> */}
        {parts.electrons.map((electron, index) => (
          <Electron {...electron} key={index} />
        ))}
      </React.Suspense>
    </>
  );
};

export default Canvas;
