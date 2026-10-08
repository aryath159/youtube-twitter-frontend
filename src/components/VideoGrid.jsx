import VideoCard from "./VideoCard";

// responsive grid of video cards, reused by Home / Channel / History / Liked
function VideoGrid({ videos, emptyMessage = "No videos yet" }) {
  if (!videos || videos.length === 0) {
    return <p className="text-sm text-muted">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
}

export default VideoGrid;
