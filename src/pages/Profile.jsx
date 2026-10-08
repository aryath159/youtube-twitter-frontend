import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  UpdateAccDetails,
  updateAvatar,
  UpdateCoverImage,
  changePassword,
} from "../api/auth";

// small helper: every section shows its own success / error text
function Message({ message }) {
  if (!message) return null;

  return (
    <p className={message.type === "error" ? "form-error" : "form-success"}>
      {message.text}
    </p>
  );
}

const errorText = (err, fallback) => ({
  type: "error",
  text: err.response?.data?.message || fallback,
});

function Profile() {
  const { user, setUser } = useContext(AuthContext);

  // ----- account details -----
  const [details, setDetails] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
  });
  const [detailsMsg, setDetailsMsg] = useState(null);

  const handleDetails = async (e) => {
    e.preventDefault();
    setDetailsMsg(null);

    try {
      const res = await UpdateAccDetails(details);
      setUser(res.data.data);
      setDetailsMsg({ type: "success", text: "Account details updated" });
    } catch (err) {
      setDetailsMsg(errorText(err, "could not update your details"));
    }
  };

  // ----- avatar / cover image -----
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [imageMsg, setImageMsg] = useState(null);
  const [imageBusy, setImageBusy] = useState(false);

  const handleImage = async (kind) => {
    const file = kind === "avatar" ? avatarFile : coverFile;
    if (!file) return;

    setImageMsg(null);
    setImageBusy(true);

    try {
      const res = kind === "avatar" ? await updateAvatar(file) : await UpdateCoverImage(file);
      setUser(res.data.data);
      setImageMsg({
        type: "success",
        text: kind === "avatar" ? "Avatar updated" : "Cover image updated",
      });
    } catch (err) {
      setImageMsg(errorText(err, "image upload failed"));
    } finally {
      setImageBusy(false);
    }
  };

  // ----- password -----
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [passwordMsg, setPasswordMsg] = useState(null);

  const handlePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);

    try {
      await changePassword(passwords);
      setPasswords({ oldPassword: "", newPassword: "" });
      setPasswordMsg({ type: "success", text: "Password changed" });
    } catch (err) {
      setPasswordMsg(errorText(err, "could not change the password"));
    }
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-6">
      <h1 className="mb-5 text-2xl font-medium text-ink">Profile settings</h1>

      {/* images */}
      <section className="card mb-6">
        <h2 className="mb-4 font-medium">Images</h2>

        <div className="mb-4 flex items-center gap-4">
          <img
            src={user.avatar}
            alt=""
            className="h-16 w-16 rounded-full bg-line object-cover"
          />
          <div className="form-field !mb-0 flex-1">
            <label htmlFor="avatar">Avatar</label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0] || null)}
            />
          </div>
          <button
            type="button"
            className="btn btn-outline"
            disabled={!avatarFile || imageBusy}
            onClick={() => handleImage("avatar")}
          >
            Update
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-line">
            {user.coverImage && (
              <img src={user.coverImage} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="form-field !mb-0 flex-1">
            <label htmlFor="coverImage">Cover image</label>
            <input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files[0] || null)}
            />
          </div>
          <button
            type="button"
            className="btn btn-outline"
            disabled={!coverFile || imageBusy}
            onClick={() => handleImage("cover")}
          >
            Update
          </button>
        </div>

        <div className="mt-4">
          <Message message={imageMsg} />
        </div>
      </section>

      {/* account details */}
      <form onSubmit={handleDetails} className="card mb-6">
        <h2 className="mb-4 font-medium">Account details</h2>

        <div className="form-field">
          <label htmlFor="fullname">Full name</label>
          <input
            id="fullname"
            type="text"
            value={details.fullname}
            onChange={(e) => setDetails({ ...details, fullname: e.target.value })}
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={details.email}
            onChange={(e) => setDetails({ ...details, email: e.target.value })}
          />
        </div>

        <Message message={detailsMsg} />

        <button type="submit" className="btn btn-primary">
          Save changes
        </button>
      </form>

      {/* password */}
      <form onSubmit={handlePassword} className="card">
        <h2 className="mb-4 font-medium">Change password</h2>

        <div className="form-field">
          <label htmlFor="oldPassword">Current password</label>
          <input
            id="oldPassword"
            type="password"
            autoComplete="current-password"
            required
            value={passwords.oldPassword}
            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
          />
        </div>

        <div className="form-field">
          <label htmlFor="newPassword">New password (min 6 characters)</label>
          <input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          />
        </div>

        <Message message={passwordMsg} />

        <button type="submit" className="btn btn-primary">
          Change password
        </button>
      </form>
    </main>
  );
}

export default Profile;
