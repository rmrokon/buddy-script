import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";
import { IComment, ICommentsResponse } from "@/types/comment";

interface IGetCommentsParams {
    postId: string;
    parentCommentId?: string | null;
    page?: number;
    limit?: number;
    enabled?: boolean;
}

export const useGetInfiniteComments = ({ postId, parentCommentId = null, limit = 5, enabled = true }: IGetCommentsParams) => {
    return useInfiniteQuery({
        queryKey: ["comments", postId, parentCommentId],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await apiClient.get<{ result: ICommentsResponse }>("/comments", {
                params: {
                    postId,
                    parentCommentId: parentCommentId || undefined,
                    page: pageParam,
                    limit
                },
            });
            return response.data.result;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage?.page_info?.has_next_page ? allPages.length + 1 : undefined;
        },
        enabled: !!postId && enabled,
    });
};

interface ICreateCommentRequest {
    postId: string;
    content: string;
    parentCommentId?: string | null;
}

export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ICreateCommentRequest) => {
            const response = await apiClient.post<{ result: IComment }>("/comments", data);
            return response.data.result;
        },
        onSuccess: (_, variables) => {
            // Invalidate post feed to update counts
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            // Invalidate all comment lists for this post to ensure parent reply counts 
            // and nested threads are fully updated
            queryClient.invalidateQueries({
                queryKey: ["comments", variables.postId]
            });
            toast.success(variables.parentCommentId ? "Reply posted!" : "Comment posted!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to post comment");
        },
    });
};
