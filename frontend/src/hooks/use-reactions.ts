import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { IToggleReactionRequest, IReactionResponse } from "@/types/reaction";

export const useToggleReaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: IToggleReactionRequest) => {
            const response = await apiClient.post<IReactionResponse>("/reactions", data);
            return response.data.result;
        },
        onSuccess: () => {
            // Invalidate posts list to reflect new reaction counts and state
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        // We can add optimistic updates here if needed for better UX
    });
};
