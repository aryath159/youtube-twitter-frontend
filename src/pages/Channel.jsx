import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { GetProfile } from "../api/auth.js";
import { toggleSubscription } from "../api/subscription.js";
import { getAllVideos } from "../api/video.js";

import { AuthContext } from "../context/AuthContext";
import VideoGrid from "../components/VideoGrid";
import { formatCount } from "../utils/format";

function Channel() {
  // useParams() returns an OBJECT ({ username }), so destructure it
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);

    GetProfile(username)
      .then((res) => {
        const data = res.data.data;
        if (!cancelled) setChannel(data);
        return getAllVideos({ userId: data._id, limit: 50 });
      })
      .then((res) => {
        if (!cancelled) setVideos(res?.data?.data?.docs || []);
      })
      .catch(() => {
        if (!cancelled) setChannel(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  const handleSubscribe = async () => {
    // guests have to log in first
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await toggleSubscription(channel._id);

      // update the ui
      setChannel((current) => ({
        ...current,
        isSubscribed: !current.isSubscribed,
        subscribersCount: current.isSubscribed
          ? current.subscribersCount - 1
          : current.subscribersCount + 1,
      }));
    } catch (error) {
      console.log("subscription error", error);
    }
  };

  // loading state
  if (loading) {
    return <p className="px-4 py-10 text-center text-sm text-muted">Loading...</p>;
  }

  // if channel not found
  if (!channel) {
    return (
      <p className="px-4 py-10 text-center text-sm text-muted">Channel not found.</p>
    );
  }

  // channel page
  return (
    <div>
      {/* cover image */}
      <div className="h-40 w-full overflow-hidden bg-line sm:h-56">
        {channel.coverImage && (
          <img src={channel.coverImage} alt="" className="h-full w-full object-cover" />
        )}
      </div>

      {/* channel information */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="-mt-10 flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            {/* channel avatar */}
            <img
              src={channel.avatar}
              alt=""
              className="h-20 w-20 rounded-full border-4 border-cream bg-line object-cover"
            />

            {/* channel name and subscribers */}
            <div>
              <h1 className="font-display text-xl font-semibold">{channel.fullname}</h1>

              <p className="text-sm text-muted">
                @{channel.username}
                {" · "}
                {formatCount(channel.subscribersCount)} subscribers
              </p>
            </div>
          </div>

          {/* subscribe button (hidden on your own channel) */}
          {user?.username !== channel.username && (
            <button
              onClick={handleSubscribe}
              className={`rounded-sm px-4 py-1.5 text-sm font-medium ${
                channel.isSubscribed
                  ? "border border-line text-ink"
                  : "bg-leaf text-white hover:opacity-90"
              }`}
            >
              {channel.isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          )}
        </div>

        {/* videos */}
        <div className="mt-8 pb-10">
          <VideoGrid videos={videos} emptyMessage="No videos yet" />
        </div>
      </div>
    </div>
  );
}

export default Channel;
