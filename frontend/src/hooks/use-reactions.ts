import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { IToggleReactionRequest, IReactionResponse, IReactionsResponse, EReactableType } from "@/types/reaction";

export const useGetInfiniteReactions = (reactableId: string, reactableType: EReactableType = EReactableType.POST) => {
    return useInfiniteQuery({
        queryKey: ["reactions", reactableId, reactableType],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await apiClient.get<IReactionsResponse>("/reactions", {
                params: {
                    reactableId,
                    reactableType,
                    page: pageParam,
                    limit: 10,
                },
            });
            return response.data.result;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        enabled: !!reactableId,
    });
};

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
