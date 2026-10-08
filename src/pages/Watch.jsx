import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getVideobyId } from "../api/video";
import { toggleVideoLike, toggleCommentLike } from "../api/like";
import { toggleSubscription } from "../api/subscription";
import { addComment, deleteComment, getVideoComments } from "../api/comment";

import { AuthContext } from "../context/AuthContext";
import { formatCount, formatViews, timeAgo } from "../utils/format";

function Watch() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);

  // load the video + the first page of comments whenever the video id changes
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    getVideobyId(videoId)
      .then((res) => {
        if (!cancelled) setVideo(res.data.data);
      })
      .catch((err) => {
        if (!cancelled) {
          setVideo(null);
          setError(err.response?.data?.message || "could not load this video");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    getVideoComments(videoId, { page: 1, limit: 10 })
      .then((res) => {
        if (cancelled) return;
        const data = res.data.data;
        setComments(data.docs || []);
        setHasMoreComments(Boolean(data.hasNextPage));
        setCommentPage(1);
      })
      .catch(() => {
        if (!cancelled) setComments([]);
      });

    return () => {
      cancelled = true;
    };
  }, [videoId]);

  // guests are sent to the login page for any action that needs an account
  const requireLogin = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/watch/${videoId}` } } });
      return false;
    }
    return true;
  };

  const handleLike = async () => {
    if (!requireLogin()) return;

    try {
      const res = await toggleVideoLike(videoId);
      const isLiked = res.data.data.isLiked;

      setVideo((current) => ({
        ...current,
        isLiked,
        likesCount: current.likesCount + (isLiked ? 1 : -1),
      }));
    } catch (err) {
      console.log("like error", err);
    }
  };

  const handleSubscribe = async () => {
    if (!requireLogin()) return;

    try {
      await toggleSubscription(video.owner._id);

      setVideo((current) => ({
        ...current,
        owner: {
          ...current.owner,
          isSubscribed: !current.owner.isSubscribed,
          subscribersCount: current.owner.isSubscribed
            ? current.owner.subscribersCount - 1
            : current.owner.subscribersCount + 1,
        },
      }));
    } catch (err) {
      console.log("subscribe error", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!requireLogin()) return;
    if (!newComment.trim()) return;

    setPosting(true);

    try {
      const res = await addComment(videoId, newComment.trim());
      // newest comment goes to the top
      setComments((current) => [res.data.data, ...current]);
      setNewComment("");
    } catch (err) {
      console.log("comment error", err);
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await deleteComment(commentId);
      setComments((current) => current.filter((c) => c._id !== commentId));
    } catch (err) {
      console.log("delete comment error", err);
    }
  };

  const handleCommentLike = async (commentId) => {
    if (!requireLogin()) return;

    try {
      const res = await toggleCommentLike(commentId);
      const isLiked = res.data.data.isLiked;

      setComments((current) =>
        current.map((c) =>
          c._id === commentId
            ? { ...c, isLiked, likesCount: c.likesCount + (isLiked ? 1 : -1) }
            : c
        )
      );
    } catch (err) {
      console.log("comment like error", err);
    }
  };

  const loadMoreComments = async () => {
    try {
      const nextPage = commentPage + 1;
      const res = await getVideoComments(videoId, { page: nextPage, limit: 10 });
      const data = res.data.data;

      setComments((current) => [...current, ...(data.docs || [])]);
      setHasMoreComments(Boolean(data.hasNextPage));
      setCommentPage(nextPage);
    } catch (err) {
      console.log("could not load more comments", err);
    }
  };

  if (loading) {
    return <p className="px-4 py-10 text-center text-sm text-muted">Loading...</p>;
  }

  if (!video) {
    return (
      <p className="px-4 py-10 text-center text-sm text-muted">
        {error || "Video not found."}
      </p>
    );
  }

  const isOwnVideo = user && video.owner?._id === user._id;

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      {/* player */}
      <video
        key={video._id}
        src={video.videoFile?.url}
        poster={video.thumbnail?.url}
        controls
        className="aspect-video w-full rounded-sm bg-black"
      />

      {!video.isPublished && (
        <p className="mt-2 text-sm text-muted">
          This video is unpublished - only you can see it.
        </p>
      )}

      <h1 className="mt-4 font-display text-xl font-semibold">{video.title}</h1>

      {/* channel + actions */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to={`/channel/${video.owner?.username}`}>
            <img
              src={video.owner?.avatar}
              alt=""
              className="h-10 w-10 rounded-full bg-line object-cover"
            />
          </Link>

          <div>
            <Link
              to={`/channel/${video.owner?.username}`}
              className="text-sm font-medium"
            >
              {video.owner?.fullname || video.owner?.username}
            </Link>
            <p className="text-xs text-muted">
              {formatCount(video.owner?.subscribersCount)} subscribers
            </p>
          </div>

          {!isOwnVideo && (
            <button
              type="button"
              onClick={handleSubscribe}
              className={`ml-2 rounded-sm px-4 py-1.5 text-sm font-medium ${
                video.owner?.isSubscribed
                  ? "border border-line text-ink"
                  : "bg-leaf text-white hover:opacity-90"
              }`}
            >
              {video.owner?.isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleLike}
          className={`rounded-sm border px-4 py-1.5 text-sm font-medium ${
            video.isLiked ? "border-leaf bg-leaf text-white" : "border-line text-ink"
          }`}
        >
          {video.isLiked ? "Liked" : "Like"} · {formatCount(video.likesCount)}
        </button>
      </div>

      {/* description */}
      <div className="mt-4 rounded-sm bg-line/50 p-3 text-sm">
        <p className="font-medium">
          {formatViews(video.views)} · {timeAgo(video.createdAt)}
        </p>
        <p className="mt-1 whitespace-pre-wrap">{video.description}</p>
      </div>

      {/* comments */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-medium">Comments</h2>

        <form onSubmit={handleAddComment} className="mb-6 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? "Add a comment..." : "Log in to comment"}
            className="flex-1 rounded-sm border border-line bg-white px-3 py-2 text-sm outline-none focus:border-leaf"
          />
          <button
            type="submit"
            disabled={posting || !newComment.trim()}
            className="btn btn-primary"
          >
            {posting ? "Posting..." : "Comment"}
          </button>
        </form>

        {comments.length === 0 && (
          <p className="text-sm text-muted">No comments yet. Be the first!</p>
        )}

        <ul className="flex flex-col gap-5">
          {comments.map((comment) => (
            <li key={comment._id} className="flex gap-3">
              <img
                src={comment.owner?.avatar}
                alt=""
                className="h-8 w-8 shrink-0 rounded-full bg-line object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted">
                  <span className="font-medium text-ink">@{comment.owner?.username}</span>
                  {" · "}
                  {timeAgo(comment.createdAt)}
                </p>

                <p className="mt-0.5 whitespace-pre-wrap break-words text-sm">
                  {comment.content}
                </p>

                <div className="mt-1 flex gap-3 text-xs text-muted">
                  <button
                    type="button"
                    onClick={() => handleCommentLike(comment._id)}
                    className={comment.isLiked ? "font-semibold text-leaf" : ""}
                  >
                    {comment.isLiked ? "Liked" : "Like"} · {comment.likesCount}
                  </button>

                  {user && comment.owner?._id === user._id && (
                    <button type="button" onClick={() => handleDeleteComment(comment._id)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {hasMoreComments && (
          <button
            type="button"
            onClick={loadMoreComments}
            className="btn btn-outline mt-6"
          >
            Show more comments
          </button>
        )}
      </section>
    </main>
  );
}

export default Watch;
