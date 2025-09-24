const conf={
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionIdPosts: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID_POSTS),
    appwriteCollectionIdComments: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID_COMMENTS),
    appwriteCollectionIdPostReactions: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID_POST_REACTIONS),
    //appwriteCollectionIdCommentReactions: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID_COMMENT_REACTIONS),
    appwriteCollectionIdPostReports: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID_POST_REPORTS),
    //appwriteCollectionIdCommentReports: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID_COMMENT_REPORTS),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
}
export default conf