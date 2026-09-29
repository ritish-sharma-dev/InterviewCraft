import axiosInstance from "../lib/axios";

export const sessionApi = {
  createSession: async (data) => {
    const response = await axiosInstance.post("/sessions", data);
    return response.data;
  },

  getMyRecentSessions: async () => {
    const response = await axiosInstance.get("/sessions/my-recent");
    return response.data;
  },

  getSessionById: async (id) => {
    const response = await axiosInstance.get(`/sessions/${id}`);
    return response.data;
  },

  joinSession: async ({ id, joinCode }) => {
    const response = await axiosInstance.post(`/sessions/${id}/join`, { joinCode });
    return response.data;
  },
  selectQuestion: async ({ id, questionId }) => {
    const response = await axiosInstance.patch(`/sessions/${id}/question`, { questionId });
    return response.data;
  },
  updateCandidateCode: async ({ id, code, language, questionRevision, codeVersion }) => {
    const response = await axiosInstance.put(
      `/sessions/${id}/code`,
      { code, language, questionRevision, codeVersion },
    );
    return response.data;
  },
  endSession: async (id) => {
    const response = await axiosInstance.post(`/sessions/${id}/end`);
    return response.data;
  },
  getStreamToken: async (sessionId) => {
    const response = await axiosInstance.get(`/chat/token/${sessionId}`);
    return response.data;
  },
};
