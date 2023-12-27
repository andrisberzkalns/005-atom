"use client";

import React from "react";
import Canvas from "~/app/_components/Canvas";
import { DynamicText } from "~/app/_components/DynamicText";
import { atom } from "~/data";
import { Button } from "~/app/_components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home({ params }: { params: { atomicNumber: string } }) {
  const { atomicNumber } = params;
  const [element, setElement] = React.useState(
    atom.find((e) => e.atomicNumber === Number(atomicNumber)),
  );

  const prevElement = () => {
    const prev = atom.find(
      (e) => e.atomicNumber === Number(element?.atomicNumber) - 1,
    );
    if (prev) {
      setElement(prev);
      window.history.pushState({}, "", `/atom/${Number(prev.atomicNumber)}`);
    }
  };

  const nextElement = () => {
    const next = atom.find(
      (e) => e.atomicNumber === Number(element?.atomicNumber) + 1,
    );
    if (next) {
      setElement(next);
      // Update url
      window.history.pushState({}, "", `/atom/${Number(next.atomicNumber)}`);
    }
  };

  return (
    <main className="relative h-screen w-screen">
      <Button
        variant="outline"
        className="absolute left-4 top-1/2 z-20 my-auto px-2 py-8 shadow-md"
        disabled={Number(element?.atomicNumber) === 1}
        onClick={() => prevElement()}
        aria-label="Previous element"
      >
        <ChevronLeft strokeWidth={1} />
      </Button>
      <Button
        variant="outline"
        className="absolute right-4 top-1/2 z-20 my-auto px-2 py-8 shadow-md"
        disabled={Number(element?.atomicNumber) === atom.length}
        onClick={() => nextElement()}
        aria-label="Next element"
      >
        <ChevronRight strokeWidth={1} />
      </Button>
      <div className="absolute top-0 flex h-screen w-screen flex-col bg-white text-black">
        <div className="w-screen bg-gradient-to-b from-gray-300 via-gray-100 to-white">
          <DynamicText>ATOM</DynamicText>
        </div>
        <div className="grow"></div>
        <div className="relative z-10 w-screen select-none pb-32">
          <span className="text-stroke absolute w-full pr-4 text-right text-3xl font-black leading-[normal] tracking-[0] text-white [font-family:'Inter-Black',Helvetica] md:text-9xl lg:pr-12 lg:text-9xl">
            {element?.atomicNumber}
          </span>
          <span className="absolute w-full pr-4 text-right text-3xl font-black leading-[normal] tracking-[0] text-white [font-family:'Inter-Black',Helvetica] md:text-9xl lg:pr-12 lg:text-9xl">
            {element?.atomicNumber}
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
        <Canvas element={element} />
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
