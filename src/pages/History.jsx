import { useEffect, useState } from "react";
import { getWatchHistory } from "../api/auth";
import VideoGrid from "../components/VideoGrid";

function History() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWatchHistory()
      .then((res) => setVideos(res.data.data || []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-5 text-2xl font-medium text-ink">Watch history</h1>

      {loading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : (
        <VideoGrid videos={videos} emptyMessage="You haven't watched anything yet." />
      )}
    </main>
  );
}

export default History;
