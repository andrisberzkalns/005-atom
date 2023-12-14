"use client";

import React, { useEffect } from "react";
import { Canvas, MeshProps, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  OrthographicCamera,
  Outlines,
  Sphere,
  StatsGl,
  Trail,
} from "@react-three/drei";
import * as THREE from "three";
import { DynamicText } from "~/app/_components/DynamicText";
import { rotate } from "~/utils/rotate";
import { atom } from "~/data";
import electronCalculation from "~/utils/electronCalculation";
import calculatePositions from "~/utils/positionSpheres";
import {
  Physics,
  RapierRigidBody,
  RigidBody,
  useRapier,
} from "@react-three/rapier";

export default function Home({ params }: { params: { atomicNumber: string } }) {
  const { atomicNumber } = params;

  const element = atom.find((e) => e.atomicNumber === Number(atomicNumber));

  return (
    <main className="relative h-screen w-screen">
      <div className="absolute top-0 flex h-screen w-screen flex-col bg-white text-black">
        <div className="w-screen bg-gradient-to-b from-gray-300 via-gray-100 to-white">
          <DynamicText>ATOM</DynamicText>
        </div>
        <div className="grow"></div>
        <div className="relative z-10 w-screen select-none pb-32">
          <span className="text-stroke absolute w-full pr-4 text-right text-3xl font-black leading-[normal] tracking-[0] text-white [font-family:'Inter-Black',Helvetica] md:text-9xl lg:pr-12 lg:text-9xl">
            {element && element.atomicNumber}
          </span>
          <div className="mb-2 pl-4 lg:pl-12">
            <span className="text-3xl font-black leading-[normal] tracking-[0] text-black [font-family:'Inter-Black',Helvetica] md:text-5xl lg:text-6xl">
              {element?.name.trim()}
            </span>
            <span className="ml-4 text-3xl font-medium italic leading-[normal] tracking-[0] text-black [font-family:'Inter-MediumItalic',Helvetica] md:text-5xl lg:text-6xl">
              {element && `(${element?.symbol})`}
            </span>
          </div>
          <p className="pl-4 text-lg font-normal leading-[normal] tracking-[0] text-black [font-family:'Inter-Regular',Helvetica] md:text-xl lg:pl-12 lg:text-2xl">
            {/* A colorless, odorless, tasteless, non-toxic, inert, monatomic gas */}
            {element?.atomicMass} m
            <span className="align-sub text-base">a</span>
          </p>
        </div>
      </div>
      {element ? (
        <Canvas className="absolute left-0 top-0 h-screen w-screen">
          <Scene atomicNumber={Number(atomicNumber)} />
        </Canvas>
      ) : (
        <div className="absolute left-0 top-0 flex h-screen w-screen items-center justify-center">
          <div className="text-4xl font-black leading-[normal] tracking-[0] text-black [font-family:'Inter-Black',Helvetica] md:text-5xl lg:text-6xl">
            Element not found
          </div>
        </div>
      )}
    </main>
  );
}

const PROTON_NEUTRON_RADIUS = 0.4;

export const Proton = (props: MeshProps): JSX.Element => {
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

export const Neutron = (props: MeshProps): JSX.Element => {
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
  const initial = rotate(0, 0, radius!, radius!, initialAngle);

  useFrame((state) => {
    if (!meshRef.current || !meshRef.current.position) return;
    const position = meshRef.current.position;

    const et = state.clock.elapsedTime;
    const it = (et % secondsRotation) / secondsRotation;

    const [nx, ny] = rotate(0, 0, initial[0], initial[1], it * 360);
    // if (!nx || !ny) return;
    // actions["CameraAction.005"].time = THREE.MathUtils.lerp(actions["CameraAction.005"].time, actions["CameraAction.005"].getClip().duration * scroll.current, 0.05)

    // meshRef.current?.position.set(nx, 0, ny);
  });

  return (
    <Trail
      width={0.05} // Width of the line
      color={"#efefef"} // Color of the line
      length={20} // Length of the line
      decay={1} // How fast the line fades away
      interval={1} // Number of frames to wait before next calculation
      target={undefined} // Optional target. This object will produce the trail.
    >
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
    </Trail>
  );
};

const ROTATION_SPEED = 0.3;

export const Scene: React.FC<{
  atomicNumber: number;
}> = ({ atomicNumber }): JSX.Element => {
  const cameraRef = React.useRef<THREE.OrthographicCamera>(null);
  const [electrons, setElectrons] = React.useState<
    {
      initialAngle: number;
      level: number;
      rotationSpeed: number;
    }[]
  >(() => {
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
  });

  const positions = calculatePositions(
    atomicNumber * 2,
    PROTON_NEUTRON_RADIUS,
    10,
  );

  useFrame(() => {
    if (!cameraRef.current) return;
    cameraRef.current?.lookAt(new THREE.Vector3(0, 0, 0));
  });

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
        {positions.map((position, index) => {
          if (index % 2 === 0) {
            return (
              <Proton
                position={[position.x, position.y, position.z]}
                key={index}
              />
            );
          } else {
            return (
              <Neutron
                position={[position.x, position.y, position.z]}
                key={index}
              />
            );
          }
        })}
        {/* <Proton position={[-0.7, 0, -0.7]} />
        <Proton position={[-0.7, 0, -0.7]} />
        <Proton position={[0.7, 0, 0.7]} />
        <Neutron position={[-1, 0, 1]} />
        <Neutron position={[1, 0, -1]} /> */}
        {electrons.map((electron, index) => (
          <Electron {...electron} key={index} />
        ))}
      </React.Suspense>
    </>
  );
};
