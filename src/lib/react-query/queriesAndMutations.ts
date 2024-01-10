import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authService from "../appwrite/auth";
import { INewPost, INewUser } from "@/types";
import service from "../appwrite/config";
import { QUERY_KEYS } from "./queryKeys";

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => authService.createAccount(user)
    })
};

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {email: string; password: string}) => authService.signInAccount(user)
    })
};

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: () => authService.signOutAccount()
    })
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: INewPost) => service.createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
};

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: () => service.getRecentPosts()
    })
};

export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({postId, likesArray} : {
            postId: string; likesArray: string[]
        }) => service.likePost(postId, likesArray) , 
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useSavePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({postId, userId} : {
            postId: string; userId: string
        }) => service.savePost(postId, userId) , 
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (savedRecordId: string) => service.deleteSavedPost(savedRecordId) , 
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}