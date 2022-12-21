import { useState, useEffect, useRef } from "react";

function useScroll() {
  const lastScrollTop = useRef(0);
  const [bodyOffset, setBodyOffset] = useState({});
  const [scrollY, setScrollY] = useState(bodyOffset.top);
  const [scrollX, setScrollX] = useState(bodyOffset.left);
  const [scrollDirection, setScrollDirection] = useState("");

  const listener = (e) => {
    setBodyOffset(document.body.getBoundingClientRect());
    setScrollY(window.scrollY);
    setScrollX(bodyOffset.left);
    setScrollDirection(lastScrollTop.current > window.scrollY ? "down" : "up");
    lastScrollTop.current = window.scrollY;
  };

  useEffect(() => {
    setBodyOffset(document.body.getBoundingClientRect());
    window.addEventListener("scroll", listener);
    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, []);

  return {
    scrollY,
    scrollX,
    scrollDirection,
  };
}

export default useScroll;
