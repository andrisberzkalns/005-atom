import { useEffect, useRef } from "react";

export const DynamicText = ({ children: text }: { children: string }) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function adjustFontSize() {
      if (!divRef.current) return;

      const div = divRef.current;

      let fontSize = 10; // Start with an initial font size
      let divWidth = div.offsetWidth;
      let textWidth;

      // Create a temporary element to measure the text width
      let tempElement = document.createElement("span");
      tempElement.innerText = text;
      tempElement.style.visibility = "hidden";
      div.appendChild(tempElement);

      do {
        fontSize++;
        tempElement.style.fontSize = fontSize + "px";
        textWidth = tempElement.offsetWidth;
      } while (textWidth < divWidth);

      // Remove the temporary element
      div.removeChild(tempElement);

      // Set the font size to the div
      div.style.fontSize = fontSize - 1 + "px"; // Subtract 1 because the loop ends when the textWidth is greater than divWidth
      div.style.marginBottom = -fontSize / 10 - 2 + "px";
    }

    window.addEventListener("resize", adjustFontSize);
    adjustFontSize();

    return () => window.removeEventListener("resize", adjustFontSize);
  }, []);

  return (
    <div
      ref={divRef}
      className="w-screen font-black leading-none text-white [font-family:'Inter-Black',Helvetica]"
    >
      {text}
    </div>
  );
};

export default DynamicText;
