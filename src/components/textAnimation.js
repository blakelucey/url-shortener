import React, { useRef, useEffect, useState } from "react";
import anime from "animejs";

const TypingText = () => {
  const textRef = useRef(null);
  const cursorRef = useRef(null);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const text = textRef.current;
    const cursor = cursorRef.current;
    const lines = ["The simplest way to manage, track, and elevate your links in a decentralized web."];
    const line = lines[0];
    const lineLength = line.length;
    let currentCharacterIndex = 0;

    // Animate the text opacity
    anime({
      targets: text,
      opacity: 1,
      duration: 2000,
      delay: 500,
    });

    // Typing function using state
    function typeCharacter() {
      if (currentCharacterIndex < lineLength) {
        setTypedText(line.slice(0, currentCharacterIndex + 1));
        currentCharacterIndex += 1;
        setTimeout(typeCharacter, 100);
      } else {
        // Typing complete, start cursor blinking
        setTimeout(() => {
          anime({
            targets: cursor,
            opacity: [1, 0],
            duration: 500,
            easing: "easeOutQuad",
            loop: true,
            direction: "alternate",
          });
        }, 1000);
      }
    }

    typeCharacter();

    // Cleanup on unmount
    return () => {
      anime.remove(text);
      anime.remove(cursor);
    };
  }, []);

  return (
    <div>
      <h3 ref={textRef} style={{ opacity: 0 }}>
        {typedText.split("").map((char, index) => (
          <span key={index}>{char}</span>
        ))}
        <span ref={cursorRef}>|</span>
      </h3>
    </div>
  );
};

export default TypingText;