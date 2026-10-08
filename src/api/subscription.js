import api from "./axios";

export const toggleSubscription = (channelId) =>
  api.post(`/subscriptions/c/${channelId}`);

export const getChannelSubscibers = (channelId) =>
  api.get(`/subscriptions/c/${channelId}`);

export const getSubscribedChannels = (subscriberId) =>
  api.get(`/subscriptions/u/${subscriberId}`);
