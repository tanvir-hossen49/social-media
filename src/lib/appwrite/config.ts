import { Client, Databases, ID, Query, Storage } from "appwrite";
import conf from "../conf/conf";
import { INewPost } from "@/types";

export class Service {
    client = new Client();
    database;
    storage;
    
    constructor() {
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.projectId);
        this.database = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createPost(post: INewPost) {
        try {
            // upload image to storage
            const uploadedFile = await this.uploadFile(post.file[0]);

            if(!uploadedFile) throw Error;

            // get file url
            const fileUrl = await this.getFilePreview(uploadedFile.$id);

            if(!fileUrl) {
                await this.deleteFile(uploadedFile.$id)
            }

            const tags = post.tags?.replace(/ /g, "").split(",") || [];

            const newPost = await this.database.createDocument(
                conf.databaseId, conf.postsCollectionId, ID.unique(), 
                {
                    creator: post.userId,
                    caption: post.caption,
                    imageUrl: fileUrl,
                    imageId: uploadedFile.$id,
                    location: post.location,
                    tags: tags
                }
            );

            if(!newPost) {
                await this.deleteFile(uploadedFile.$id);
                throw Error;
            }
            
            return newPost;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async getRecentPosts() {
        try{
            const posts = await this.database.listDocuments(
                conf.databaseId, conf.postsCollectionId,
                [Query.orderDesc('$createdAt'), Query.limit(20)]
            );
            
            if(!posts) throw Error;

            return posts;
        }catch(error) {
            console.log(error);
        }
    }

    async likePost(postId: string, likesArray: string[]) {
        try{
            const updatePost = await this.database.updateDocument(
                conf.databaseId, conf.postsCollectionId, postId, {
                    likes: likesArray
                }
            )

            if(!updatePost) throw Error;

            return updatePost;
        }catch(error) {
            console.log(error);
        }
    }

    async savePost(postId: string, userId: string) {
        try{
            const updatePost = await this.database.createDocument(
                conf.databaseId, conf.savesCollectionId, ID.unique(), {
                    user: userId, 
                    post: postId
                } 
            )

            if(!updatePost) throw Error;

            return updatePost;
        }catch(error) {
            console.log(error);
        }
    }

    async deleteSavedPost(savedRecordId: string) {
        try{
            const statusCode = await this.database.deleteDocument(
                conf.databaseId, conf.savesCollectionId, savedRecordId
            )

            if(!statusCode) throw Error;

            return statusCode;
        }catch(error) {
            console.log(error);
        }
    }

    // upload file
    async uploadFile(file: File) {
        try{
            return await this.storage.createFile(conf.storageId, ID.unique(), file)
        }catch(error) {
            console.log(error);
        }
    }

    async getFilePreview(fileId: string) {
        try {
            const fileUrl = this.storage.getFilePreview(
                conf.storageId, fileId, 2000, 2000, 'top', 100
            );
            if(!fileUrl) throw Error;
            
            return fileUrl;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async deleteFile(fileId: string) {
        try {
            await this.storage.deleteFile(conf.storageId, fileId);
            return {status: 'Ok'}
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

const service = new Service();
export default service;