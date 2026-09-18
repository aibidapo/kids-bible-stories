import { useCallback, useEffect, useState } from "react";
import { Library } from "./components/Library";
import { StoryPlayer } from "./components/StoryPlayer";
import { Quiz } from "./components/Quiz";
import { StickerBook } from "./components/StickerBook";
import { Settings } from "./components/Settings";
import { getStory } from "./data/stories";
import { useProgress } from "./lib/store";
import { setMuted } from "./lib/sound";
import type { Story } from "./types";

type Route =
  | { view: "library" }
  | { view: "story"; storyId: string; index: number }
  | { view: "quiz"; storyId: string }
  | { view: "stickers" };

/**
 * Routing lives in the URL hash rather than component state so that the phone's
 * back button walks back through the book — which is the first thing a child
 * will press, and the first thing a home-screen web app usually gets wrong.
 */
function parse(hash: string): Route {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] === "stickers") return { view: "stickers" };
  if (parts[0] === "story" && parts[1]) {
    if (parts[2] === "quiz") return { view: "quiz", storyId: parts[1] };
    const index = Number.parseInt(parts[2] ?? "0", 10);
    return {
      view: "story",
      storyId: parts[1],
      index: Number.isFinite(index) ? index : 0,
    };
  }
  return { view: "library" };
}

function href(route: Route): string {
  switch (route.view) {
    case "stickers":
      return "#/stickers";
    case "story":
      return `#/story/${route.storyId}/${route.index}`;
    case "quiz":
      return `#/story/${route.storyId}/quiz`;
    default:
      return "#/";
  }
}

export default function App() {
  const progress = useProgress();
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash));
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const onHash = () => setRoute(parse(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    setMuted(progress.muted);
  }, [progress.muted]);

  const navigate = useCallback((next: Route, replace = false) => {
    const url = href(next);
    if (replace) window.history.replaceState(null, "", url);
    else window.location.hash = url;
    setRoute(next);
  }, []);

  const openStory = useCallback(
    (story: Story) => navigate({ view: "story", storyId: story.id, index: 0 }),
    [navigate],
  );
  const home = useCallback(() => navigate({ view: "library" }), [navigate]);

  let content;
  if (route.view === "stickers") {
    content = <StickerBook onBack={home} />;
  } else if (route.view === "story" || route.view === "quiz") {
    const story = getStory(route.storyId);
    if (!story) {
      content = (
        <Library
          onOpen={openStory}
          onStickers={() => navigate({ view: "stickers" })}
          onSettings={() => setSettingsOpen(true)}
        />
      );
    } else if (route.view === "quiz") {
      content = <Quiz story={story} onDone={home} />;
    } else {
      const index = Math.min(Math.max(route.index, 0), story.scenes.length - 1);
      content = (
        <StoryPlayer
          story={story}
          index={index}
          onIndex={(i) => navigate({ view: "story", storyId: story.id, index: i })}
          onQuiz={() => navigate({ view: "quiz", storyId: story.id })}
          onHome={home}
        />
      );
    }
  } else {
    content = (
      <Library
        onOpen={openStory}
        onStickers={() => navigate({ view: "stickers" })}
        onSettings={() => setSettingsOpen(true)}
      />
    );
  }

  return (
    <div className={`app${progress.calm ? " calm" : ""}`}>
      {content}
      {settingsOpen && <Settings onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
