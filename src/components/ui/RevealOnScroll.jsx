import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function RevealOnScroll({ children, delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 18, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power3.out", delay }
    );
  }, [delay]);

  return <div ref={ref}>{children}</div>;
}