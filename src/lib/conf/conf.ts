const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    projectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    databaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    storageId: String(import.meta.env.VITE_APPWRITE_STORAGE_ID),
    usersCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_USERS_ID),
    postsCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_POSTS_ID),
    savesCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_SAVES_ID),
};

export default conf;