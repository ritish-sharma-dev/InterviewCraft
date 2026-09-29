import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sessionApi } from "../api/sessions";

export const useCreateSession = () => {
  const result = useMutation({
    mutationKey: ["createSession"],
    mutationFn: async (data) => sessionApi.createSession(data),
    onSuccess: () => toast.success("Session created successfully!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to create room"),
  });

  return result;
};

export const useMyRecentSessions = () => {
  const result = useQuery({
    queryKey: ["myRecentSessions"],
    queryFn: async () => sessionApi.getMyRecentSessions(),
  });

  return result;
};

export const useSessionById = (id) => {
  const result = useQuery({
    queryKey: ["session", id],
    queryFn: async () => sessionApi.getSessionById(id),
    enabled: !!id,
    refetchInterval: 5000, // refetch every 5 seconds to detect session status changes
  });

  return result;
};

export const useJoinSession = () => {
  const result = useMutation({
    mutationKey: ["joinSession"],
    mutationFn: async ({ id, joinCode }) => sessionApi.joinSession({ id, joinCode }),
    onSuccess: () => toast.success("Joined session successfully!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to join session"),
  });

  return result;
};

export const useEndSession = () => {
  const result = useMutation({
    mutationKey: ["endSession"],
    mutationFn: async (id) => sessionApi.endSession(id),
    onSuccess: () => toast.success("Session ended successfully!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to end session"),
  });

  return result;
};

export const useSelectQuestion = () => {
  return useMutation({
    mutationKey: ["selectQuestion"],
    mutationFn: async ({ id, questionId }) => sessionApi.selectQuestion({ id, questionId }),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to select question"),
  });
};

export const useUpdateCandidateCode = () => {
  return useMutation({
    mutationKey: ["updateCandidateCode"],
    mutationFn: async ({ id, code, language, questionRevision, codeVersion }) =>
      sessionApi.updateCandidateCode({
        id,
        code,
        language,
        questionRevision,
        codeVersion,
      }),
    onError: (error) => {
      if (error.response?.status === 409) return;
      toast.error(error.response?.data?.message || "Failed to sync candidate code");
    },
  });
};
