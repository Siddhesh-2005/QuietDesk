import { Client, ID, Query, Storage, TablesDB } from "appwrite";
import conf from "../conf/conf";

class PostsService {
  client = new Client();
  tables;
  storage;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.tables = new TablesDB(this.client);
    this.storage = new Storage(this.client);
  }

  // Create a post
  async createPost({ userId, title, textContent, status = true, imageFile }) {
    try {
      let imageFileId = null;
      let imageUrl = null;

      if (imageFile) {
        // Upload file
        const upload = await this.storage.createFile({
          bucketId: conf.appwriteBucketId,
          fileId: ID.unique(),
          file: imageFile,
        });

        imageFileId = upload.$id;
        // getFileView may be async depending on SDK; await it and handle possible shapes
        try {
          const fileView = await this.storage.getFileView({
            bucketId: conf.appwriteBucketId,
            fileId: upload.$id,
          });

          // fileView could be an object with `href`, `url`, or a string URL depending on SDK
          imageUrl = fileView?.href || fileView?.url || fileView;

          // If still not a usable string, construct the Appwrite storage view URL as a fallback
          if (!imageUrl || typeof imageUrl !== "string") {
            imageUrl = `${conf.appwriteUrl.replace(
              /\/$/,
              ""
            )}/storage/buckets/${conf.appwriteBucketId}/files/${
              upload.$id
            }/view?project=${conf.appwriteProjectId}`;
          }
        } catch (err) {
          // If retrieving view URL fails, leave imageUrl null but keep file id
          console.warn("Could not get file view URL", err);
          imageUrl = null;
        }
      }

      return await this.tables.createRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPosts, // Posts table
        rowId: ID.unique(),
        data: {
          userId: userId,
          title: title,
          textContent: textContent,
          status: status,
          imageFileId: imageFileId,
          imageUrl: imageUrl,
        },
      });
    } catch (error) {
      console.error("Appwrite service :: createPost :: ", error);
      throw error;
    }
  }

  // Get all posts
  async getAllPosts() {
    try {
      return await this.tables.listRows({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPosts,
        queries: [Query.orderDesc("$createdAt")],
      });
    } catch (error) {
      console.error("Appwrite service :: getAllPosts :: ", error);
      throw error;
    }
  }

  async getAllPostsWithStats() {
    try {
      const posts = await this.tables.listRows({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPosts,
        queries: [Query.orderDesc("$createdAt")],
      });
      console.log(posts);

      return posts.rows.map((post) => ({
        ...post,
        stats: {
          likes: post.likesCount || 0,
          dislikes: post.dislikesCount || 0,
          commentsCount: post.commentsCount || 0,
          reportsCount: post.reportsCount || 0,
        },
      }));
    } catch (error) {
      console.error("Appwrite service :: getAllPostsWithStats ::", error);
      throw error;
    }
  }

  // Get posts of a specific user
  async getUserPosts(userId) {
    try {
      const posts = await this.tables.listRows({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPosts,
        queries: [
          // use 'userId' to match the field name used when creating rows
          Query.equal("userId", [userId]),
          Query.orderDesc("$createdAt"),
        ],
      });
      console.log(posts);

      return posts.rows.map((post) => ({
        ...post,
        stats: {
          likes: post.likesCount || 0,
          dislikes: post.dislikesCount || 0,
          commentsCount: post.commentsCount || 0,
          reportsCount: post.reportsCount || 0,
        },
      }));
    } catch (error) {
      console.error("Appwrite service :: getUserPosts ::", error);
      throw error;
    }
  }

  // Get a single post
  async getPost(postId) {
    try {
      return await this.tables.getRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPosts,
        rowId: postId,
      });
    } catch (error) {
      console.error("Appwrite service :: getPost :: ", error);
      throw error;
    }
  }

  async getPostWithStats(postId) {
    try {
      // 1. Fetch post
      const post = await this.tables.getRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPosts,
        rowId: postId,
      });

      // 2. Fetch reactions
      const reactions = await this.tables.listRows({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPostReactions,
        queries: [Query.equal("postId", [postId])],
      });

      const likes = reactions.rows.filter((r) => r.reaction === "like").length;
      const dislikes = reactions.rows.filter(
        (r) => r.reaction === "dislike"
      ).length;

      // 3. Fetch comments
      const comments = await this.tables.listRows({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdComments,
        queries: [Query.equal("postId", [postId])],
      });

      // 4. Fetch reports
      const reports = await this.tables.listRows({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPostReports,
        queries: [Query.equal("postId", [postId])],
      });

      // 5. Merge result
      return {
        ...post,
        stats: {
          likes,
          dislikes,
          commentsCount: comments.rows.length,
          reportsCount: reports.rows.length,
        },
        comments: comments.rows, // optional: remove if only counts needed
      };
    } catch (error) {
      console.error("Appwrite :: getPostWithStats ::", error);
      throw error;
    }
  }

  // Update a post
  async updatePost(postId, data) {
    try {
      return await this.tables.updateRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPosts,
        rowId: postId,
        data,
      });
    } catch (error) {
      console.error("Appwrite service :: updatePost :: ", error);
      throw error;
    }
  }

  // Delete a post
  async deletePost(postId) {
    try {
      return await this.tables.deleteRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwritePostsTableId,
        rowId: postId,
      });
    } catch (error) {
      console.error("Appwrite service :: deletePost :: ", error);
      throw error;
    }
  }
}

const postsService = new PostsService();
export default postsService;
