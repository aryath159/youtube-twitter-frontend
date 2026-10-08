import api from "./axios";

// NOTE: for FormData we don't set Content-Type ourselves.
// The browser adds "multipart/form-data; boundary=..." - setting it by hand
// (the old "multipart/formdata" typo) breaks the upload.

// register user function
export const registerUser = (formdata) => {
  return api.post("/users/register", formdata);
};

// login user function
export const loginUser = (data) => {
  return api.post("/users/login", data);
};

// logout user
export const logoutUser = () => {
  return api.post("/users/logout");
};

// get current user
export const getCurrentUser = () => {
  return api.get("/users/current-user");
};

// the backend route is PATCH /update-account (it was POST here)
export const UpdateAccDetails = (data) => {
  return api.patch("/users/update-account", data);
};

export const updateAvatar = (file) => {
  const formdata = new FormData();
  formdata.append("avatar", file);

  return api.patch("/users/avatar", formdata);
};

export const UpdateCoverImage = (file) => {
  const formdata = new FormData();
  formdata.append("coverImage", file);

  return api.patch("/users/cover-image", formdata);
};

export const changePassword = (data) => {
  return api.post("/users/change-password", data);
};

export const GetProfile = (name) => {
  return api.get(`/users/c/${name}`);
};

export const getWatchHistory = () => {
  return api.get("/users/history");
};
