import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export default function PageTransition({ children }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 18, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power3.out" }
      );
    }, ref);

    return () => ctx.revert(); // ✅ clean up (no stacking)
  }, []);

  return <div ref={ref}>{children}</div>;
}
