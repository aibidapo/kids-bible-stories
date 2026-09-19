interface Props {
  onHome: () => void;
}

/** Shown in place of the stage when a story's art is not on the device and cannot be fetched. */
export function StoryUnavailable({ onHome }: Props) {
  return (
    <div className="stage stage--unavailable" role="status">
      <div className="stage__frame stage__frame--message">
        <p className="unavailable__title">This story is not on this device yet.</p>
        <p className="unavailable__text">
          Connect to the internet, or download it from the library first.
        </p>
        <button type="button" className="btn btn--big" onClick={onHome}>
          Back to the stories
        </button>
      </div>
    </div>
  );
}
