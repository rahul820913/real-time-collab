import { useEffect } from 'react';


function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // If the click is inside the ref's element, do nothing
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      // Otherwise, call the handler function
      handler(event);
    };

    // Add event listeners for both mouse and touch events
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // Cleanup function to remove the event listeners
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]); // Re-run the effect if the ref or handler changes
}

export default useClickOutside;