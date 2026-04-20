import { useEffect } from "react";

interface Options {
  onScan: (code: string) => void;
  enabled?: boolean;
  minLength?: number;
  timeoutMs?: number;
}

/**
 * Listener global tipo HID: captura una ráfaga rápida de teclas terminada en Enter.
 * Ignora cuando el foco está en inputs/textarea/contenteditable para no interferir.
 */
export function useHidScanner({ onScan, enabled = true, minLength = 4, timeoutMs = 80 }: Options) {
  useEffect(() => {
    if (!enabled) return;
    let buf = "";
    let last = 0;

    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const tag = (t?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || t?.isContentEditable) return;

      const now = Date.now();
      if (now - last > timeoutMs) buf = "";
      last = now;

      if (e.key === "Enter") {
        if (buf.length >= minLength) {
          e.preventDefault();
          const code = buf;
          buf = "";
          onScan(code);
        }
        return;
      }
      if (e.key.length === 1) buf += e.key;
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onScan, enabled, minLength, timeoutMs]);
}
