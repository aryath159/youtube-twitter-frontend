import { useEffect, useState } from "react";
import { getAllVideos } from "../api/video.js";
import VideoGrid from "../components/VideoGrid.jsx";
// Used to read the search query from the URL.
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 12;

function Home() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  //   URL /?query=node  ->  searchParams.get("query")  ->  "node"

  // videos received from the backend
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  // "Loading videos..." while the first request is running
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // run this every time the search text changes
  useEffect(() => {
    // protects against an older, slower request overwriting a newer one
    let cancelled = false;

    setLoading(true);

    getAllVideos({ query, page: 1, limit: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;

        // the backend paginates: { docs: [...], hasNextPage, page, ... }
        const data = res.data.data;
        setVideos(data.docs || []);
        setHasNextPage(Boolean(data.hasNextPage));
        setPage(1);
      })
      .catch(() => {
        // if the request fails show an empty list
        if (cancelled) return;
        setVideos([]);
        setHasNextPage(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  const handleLoadMore = async () => {
    setLoadingMore(true);

    try {
      const nextPage = page + 1;
      const res = await getAllVideos({ query, page: nextPage, limit: PAGE_SIZE });
      const data = res.data.data;

      setVideos((current) => [...current, ...(data.docs || [])]);
      setHasNextPage(Boolean(data.hasNextPage));
      setPage(nextPage);
    } catch (error) {
      console.log("could not load more videos", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      {/* page title */}
      <h1 className="mb-5 text-2xl font-medium text-ink">
        {query ? `Search results for "${query}"` : "Recommended"}
      </h1>

      {loading && <p className="text-sm text-muted">Loading videos...</p>}

      {!loading && (
        <VideoGrid
          videos={videos}
          emptyMessage={query ? `No videos found for "${query}"` : "No videos yet"}
        />
      )}

      {!loading && hasNextPage && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="btn btn-outline"
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </main>
  );
}

export default Home;
