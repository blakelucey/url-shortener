import React, { useRef, useEffect, useState } from "react";
import anime from "animejs";
// import { logFn } from "../../../../logging/logging";
// const log = logFn('src.customComponents.Animations.textAnimation.js')

const TypingText = () => {
  const textRef = useRef(null);
  const cursorRef = useRef(null);
  const [setIsAnimating] = useState(false);

//   log('isAnimating', 'info', isAnimating)

  useEffect(() => {
    const text = textRef.current;
    const cursor = cursorRef.current;

    const lines = ["Transform Long URLs into Short, Shareable Links in Seconds"];

    function animateLine(lineNumber) {
      setIsAnimating(true);
      anime({
        targets: text,
        opacity: 1,
        duration: 2000,
        delay: 500,
      });

      let line = lines[lineNumber];
      let lineLength = line.length;

      let currentCharacterIndex = 0;

      function typeCharacter() {
        if (currentCharacterIndex < lineLength) {
          let currentText = line.slice(0, currentCharacterIndex + 1);
          text.textContent = "";
          for (let i = 0; i < currentText.length; i++) {
            const char = document.createElement("span");
            char.textContent = currentText[i];
            text.appendChild(char);
          }
          text.appendChild(cursorRef.current); // Append cursor after text
          currentCharacterIndex += 1;
          setTimeout(typeCharacter, 100);
        } else {
          // Typing is complete: set up cursor to blink indefinitely
          setTimeout(() => {
            anime({
              targets: cursorRef.current,
              opacity: [1, 0], // Blink from visible to invisible
              duration: 500,   // Speed of each blink
              easing: "easeOutQuad",
              loop: true,      // Blink forever
              direction: "alternate", // Toggle opacity back and forth
            });
          }, 1000); // Delay before blinking starts
        }
      }

      typeCharacter();
    }

    // Start the animation with the first (and only) line
    animateLine(0);

    return () => {
      // Clean up animations when component unmounts
      anime.remove(text);
      anime.remove(cursor);
    };
  }, [setIsAnimating]);

  return (
    <div>
      <h3 ref={textRef} style={{ opacity: 0 }}></h3>
      <span ref={cursorRef}>|</span>
    </div>
  );
};

export default TypingText;