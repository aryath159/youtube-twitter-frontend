import api from "./axios";

// get all videos
// params can be: query, page, limit, sortBy, sortType, userId
export const getAllVideos = (params = {}) => {
  return api.get("/videos", {
    params: params,
  });
};

export const getVideobyId = (videoId) => {
  return api.get(`/videos/v/${videoId}`);
};

// formdata: title, description, videoFile, thumbnail
// onUploadProgress lets the Upload page show a progress bar
export const uploadVideo = (formdata, onUploadProgress) => {
  return api.post("/videos", formdata, { onUploadProgress });
};

export const updateVideo = (videoId, formdata) => {
  return api.patch(`/videos/v/${videoId}`, formdata);
};

export const deleteVideo = (videoId) => {
  return api.delete(`/videos/v/${videoId}`);
};

export const togglePublishStatus = (videoId) => {
  return api.patch(`/videos/toggle/publish/${videoId}`);
};
