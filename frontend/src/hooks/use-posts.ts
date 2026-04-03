import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";
import { ICreatePostRequest, IPostsResponse } from "@/types/post";

export const useGetPosts = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ["posts", page, limit],
        queryFn: async () => {
            const response = await apiClient.get<IPostsResponse>("/posts", {
                params: { page, limit },
            });
            return response.data.result.nodes;
        },
    });
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (postData: ICreatePostRequest) => {
            const response = await apiClient.post("/posts", postData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Post created successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create post");
        },
    });
};
