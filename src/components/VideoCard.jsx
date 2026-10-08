import { Link } from "react-router-dom";
import { formatViews, formatDuration, timeAgo } from "../utils/format";

function VideoCard({ video }) {
  const owner = video.owner;

  return (
    // when the user clicks the VideoCard -> watch page
    <Link to={`/watch/${video._id}`} className="group block">
      {/* thumbnail + duration */}
      <div className="relative aspect-video overflow-hidden rounded-sm bg-line">
        <img
          src={video.thumbnail?.url}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:opacity-90"
        />

        <span className="absolute bottom-2 right-2 rounded bg-black px-2 py-1 text-xs text-white">
          {formatDuration(video.duration)}
        </span>
      </div>

      {/* video information */}
      <div className="mt-2 flex gap-2">
        {/* avatar (the backend sends avatar as a plain url string) */}
        {owner?.avatar && (
          <img
            src={owner.avatar}
            alt=""
            className="mt-0.5 h-8 w-8 shrink-0 rounded-full object-cover"
          />
        )}

        <div className="min-w-0">
          {/* TITLE + CHANNEL + VIEWS */}
          <h3 className="line-clamp-2 font-display text-sm font-medium leading-snug text-ink">
            {video.title}
          </h3>

          <p className="mt-1 truncate text-xs text-muted">{owner?.username}</p>

          <p className="text-xs text-muted">
            {formatViews(video.views)}
            {" · "}
            {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;

/*
  Link
  ├── Thumbnail container
  │   ├── Thumbnail image
  │   └── Duration badge
  └── Video information
      ├── Avatar
      └── Text: title / username / views + time

  Tailwind notes:
  - "group" + "group-hover:" lets the image react when the whole card is hovered
  - "relative" on the container makes the "absolute" duration badge sit inside it
  - "min-w-0" lets "truncate" / "line-clamp-2" work inside a flex row
*/
