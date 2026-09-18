import { useMemo } from "react";
import { splitWords } from "../hooks/useNarration";

interface Props {
  text: string;
  /** Character offset the narrator has reached, or -1 when silent. */
  charIndex: number;
  /** Big readers get read-along highlighting; little ones get bigger type. */
  mode: "little" | "big";
}

/**
 * The story text, with the word currently being spoken lit up. Following the
 * highlight is how early readers connect the sound of a word to its shape.
 */
export function NarrationText({ text, charIndex, mode }: Props) {
  const words = useMemo(() => splitWords(text), [text]);
  const activeIndex = useMemo(() => {
    if (charIndex < 0) return -1;
    // The last word that has started; boundary events land on a word's first char.
    let idx = -1;
    for (let i = 0; i < words.length; i++) {
      if (words[i].start <= charIndex) idx = i;
      else break;
    }
    return idx;
  }, [words, charIndex]);

  return (
    <p className={`narration narration--${mode}`}>
      {words.map((w, i) => (
        <span
          key={`${w.start}-${i}`}
          className={
            i === activeIndex ? "narration__word is-active" : "narration__word"
          }
        >
          {w.text}{" "}
        </span>
      ))}
    </p>
  );
}
