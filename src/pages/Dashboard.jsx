import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getChannelStats, getChannelVideos } from "../api/dashboard";
import { deleteVideo, togglePublishStatus } from "../api/video";
import { formatCount, formatDuration, timeAgo } from "../utils/format";

function StatCard({ label, value }) {
  return (
    <div className="card">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold">{formatCount(value)}</p>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getChannelStats(), getChannelVideos()])
      .then(([statsRes, videosRes]) => {
        setStats(statsRes.data.data);
        setVideos(videosRes.data.data || []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "could not load your dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleTogglePublish = async (videoId) => {
    try {
      const res = await togglePublishStatus(videoId);
      const { isPublished } = res.data.data;

      setVideos((current) =>
        current.map((v) => (v._id === videoId ? { ...v, isPublished } : v))
      );
    } catch (err) {
      setError(err.response?.data?.message || "could not change publish status");
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm("Delete this video permanently?")) return;

    try {
      await deleteVideo(videoId);
      setVideos((current) => current.filter((v) => v._id !== videoId));
      // keep the numbers at the top roughly in sync
      setStats((current) =>
        current ? { ...current, totalVideos: Math.max(current.totalVideos - 1, 0) } : current
      );
    } catch (err) {
      setError(err.response?.data?.message || "could not delete the video");
    }
  };

  if (loading) {
    return <p className="px-4 py-10 text-center text-sm text-muted">Loading...</p>;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-medium text-ink">Channel dashboard</h1>
        <Link to="/upload" className="btn btn-primary">
          Upload video
        </Link>
      </div>

      {error && <p className="form-error">{error}</p>}

      {stats && (
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Videos" value={stats.totalVideos} />
          <StatCard label="Views" value={stats.totalViews} />
          <StatCard label="Likes" value={stats.totalLikes} />
          <StatCard label="Subscribers" value={stats.totalSubscribers} />
        </div>
      )}

      <div className="card overflow-x-auto p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th>Video</th>
              <th>Status</th>
              <th>Views</th>
              <th>Likes</th>
              <th>Uploaded</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {videos.length === 0 && (
              <tr>
                <td colSpan={6} className="text-muted">
                  You haven't uploaded any videos yet.
                </td>
              </tr>
            )}

            {videos.map((video) => (
              <tr key={video._id}>
                <td>
                  <Link to={`/watch/${video._id}`} className="flex items-center gap-3">
                    <img
                      src={video.thumbnail?.url}
                      alt=""
                      className="h-12 w-20 shrink-0 rounded-sm bg-line object-cover"
                    />
                    <span>
                      <span className="line-clamp-1 font-medium">{video.title}</span>
                      <span className="text-xs text-muted">
                        {formatDuration(video.duration)}
                      </span>
                    </span>
                  </Link>
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(video._id)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      video.isPublished
                        ? "border-leaf text-leaf"
                        : "border-line text-muted"
                    }`}
                    title="Click to change"
                  >
                    {video.isPublished ? "Published" : "Unpublished"}
                  </button>
                </td>

                <td>{formatCount(video.views)}</td>
                <td>{formatCount(video.likesCount)}</td>
                <td className="whitespace-nowrap">{timeAgo(video.createdAt)}</td>

                <td>
                  <button
                    type="button"
                    onClick={() => handleDelete(video._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Dashboard;
