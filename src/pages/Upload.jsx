import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../api/video";

function Upload() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", description: "" });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!videoFile || !thumbnail) {
      setError("please choose a video file and a thumbnail");
      return;
    }

    const formdata = new FormData();
    formdata.append("title", form.title);
    formdata.append("description", form.description);
    // these two names must match upload.fields([...]) in video.route.js
    formdata.append("videoFile", videoFile);
    formdata.append("thumbnail", thumbnail);

    setUploading(true);
    setProgress(0);

    try {
      const res = await uploadVideo(formdata, (event) => {
        if (event.total) {
          setProgress(Math.round((event.loaded * 100) / event.total));
        }
      });

      navigate(`/watch/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "upload failed, please try again");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-6">
      <h1 className="mb-5 text-2xl font-medium text-ink">Upload a video</h1>

      <form onSubmit={handleSubmit} className="card">
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="videoFile">Video file (max 100 MB)</label>
          <input
            id="videoFile"
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0] || null)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="thumbnail">Thumbnail</label>
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0] || null)}
          />
        </div>

        {uploading && (
          <div className="mb-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full bg-leaf transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted">
              {progress < 100 ? `Uploading ${progress}%` : "Processing on the server..."}
            </p>
          </div>
        )}

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={uploading} className="btn btn-primary">
          {uploading ? "Uploading..." : "Publish video"}
        </button>
      </form>
    </main>
  );
}

export default Upload;
