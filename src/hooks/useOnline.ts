import { useSyncExternalStore } from "react";

function subscribe(listener: () => void) {
  window.addEventListener("online", listener);
  window.addEventListener("offline", listener);
  return () => {
    window.removeEventListener("online", listener);
    window.removeEventListener("offline", listener);
  };
}

const read = () => navigator.onLine;

/** Whether the browser believes it has a connection; re-renders when that changes. */
export function useOnline(): boolean {
  return useSyncExternalStore(subscribe, read, read);
}
