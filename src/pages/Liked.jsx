import { useEffect, useState } from "react";
import { getLikedVideos } from "../api/like";
import VideoGrid from "../components/VideoGrid";

function Liked() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLikedVideos()
      .then((res) => setVideos(res.data.data || []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-5 text-2xl font-medium text-ink">Liked videos</h1>

      {loading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : (
        <VideoGrid videos={videos} emptyMessage="You haven't liked any videos yet." />
      )}
    </main>
  );
}

export default Liked;
