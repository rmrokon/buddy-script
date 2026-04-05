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
            let data: any = postData;

            // If image is a File, use FormData
            if (postData.image instanceof File) {
                const formData = new FormData();
                if (postData.content) formData.append("content", postData.content);
                formData.append("visibility", postData.visibility);
                formData.append("image", postData.image);
                data = formData;
            }

            const response = await apiClient.post("/posts", data, {
                headers: {
                    "Content-Type": postData.image instanceof File ? "multipart/form-data" : "application/json",
                },
            });
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
