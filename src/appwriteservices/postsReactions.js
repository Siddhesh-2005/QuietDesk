import { Client, ID, Query, TablesDB } from "appwrite";
import conf from "../conf/conf";

class PostsReactionService {
  client = new Client();
  tables;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.tables = new TablesDB(this.client);
  }

  // async addReaction({ postId, userId, reaction }) {

  //   try {
  //     // 1. Save reaction
  //     await this.tables.createRow({
  //       databaseId: conf.appwriteDatabaseId,
  //       tableId: conf.appwriteCollectionIdPostReactions,
  //       rowId: ID.unique(),
  //       data: { postId, userId, reaction },
  //     });

  //     // 2. Update counter in posts table
  //     const field = reaction === "like" ? "likesCount" : "dislikesCount";
  //     const post = await this.tables.getRow({
  //       databaseId: conf.appwriteDatabaseId,
  //       tableId: conf.appwriteCollectionIdPosts,
  //       rowId: postId,
  //     });

  //     await this.tables.updateRow({
  //       databaseId: conf.appwriteDatabaseId,
  //       tableId: conf.appwritePostsTableId,
  //       rowId: postId,
  //       data: {
  //         [field]: (post[field] || 0) + 1,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Appwrite service :: addReaction ::", error);
  //     throw error;
  //   }
  // }

  // Toggle like/dislike reaction

  async toggleReaction({ postId, userId, reaction }) {
    try {
      if (!postId || !userId) {
        console.error("toggleReaction: postId or userId is missing");
        return;
      }
      // 1. Check if the user already reacted
      const existing = await this.tables.listRows({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPostReactions,
        queries: [Query.equal("postId", postId), Query.equal("userId", userId)],
      });

      if (existing.rows.length > 0) {
        const existingReaction = existing.rows[0];

        if (existingReaction.reaction === reaction) {
          // Same reaction → remove
          await this.tables.deleteRow({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteCollectionIdPostReactions,
            rowId: existingReaction.$id,
          });

          // Decrement counter in posts table
          const field = reaction === "like" ? "likesCount" : "dislikesCount";
          const post = await this.tables.getRow({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteCollectionIdPosts,
            rowId: postId,
          });

          await this.tables.updateRow({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteCollectionIdPosts,
            rowId: postId,
            data: {
              [field]: Math.max((post[field] || 0) - 1, 0),
            },
          });
        } else {
          // Different reaction → update reaction type
          await this.tables.updateRow({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteCollectionIdPostReactions,
            rowId: existingReaction.$id,
            data: { reaction },
          });

          // Update post counters
          const post = await this.tables.getRow({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteCollectionIdPosts,
            rowId: postId,
          });

          const oldField =
            existingReaction.reaction === "like"
              ? "likesCount"
              : "dislikesCount";
          const newField = reaction === "like" ? "likesCount" : "dislikesCount";

          await this.tables.updateRow({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteCollectionIdPosts,
            rowId: postId,
            data: {
              [oldField]: Math.max((post[oldField] || 0) - 1, 0),
              [newField]: (post[newField] || 0) + 1,
            },
          });
        }
      } else {
        // No reaction → create new
        await this.tables.createRow({
          databaseId: conf.appwriteDatabaseId,
          tableId: conf.appwriteCollectionIdPostReactions,
          rowId: ID.unique(),
          data: { postId, userId, reaction },
        });

        // Increment counter in posts table
        const field = reaction === "like" ? "likesCount" : "dislikesCount";
        const post = await this.tables.getRow({
          databaseId: conf.appwriteDatabaseId,
          tableId: conf.appwriteCollectionIdPosts,
          rowId: postId,
        });

        await this.tables.updateRow({
          databaseId: conf.appwriteDatabaseId,
          tableId: conf.appwriteCollectionIdPosts,
          rowId: postId,
          data: {
            [field]: (post[field] || 0) + 1,
          },
        });
      }
    } catch (error) {
      console.error("PostsReactionService :: toggleReaction ::", error);
      throw error;
    }
  }

  async addComment({ postId, userId, content }) {
    try {
      // 1. Save comment in comments table
      await this.tables.createRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdComments,
        rowId: ID.unique(),
        data: { postId, userId, content },
      });

      // 2. Increment commentsCount in posts table
      const post = await this.tables.getRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPosts,
        rowId: postId,
      });

      await this.tables.updateRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPosts,
        rowId: postId,
        data: {
          commentsCount: (post.commentsCount || 0) + 1,
        },
      });
    } catch (error) {
      console.error("Appwrite service :: addComment ::", error);
      throw error;
    }
  }

  async getComments(postId){
    try {
      const comments = await this.tables.listRows({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdComments,
        queries: [
          Query.equal("postId", [postId]),
          Query.orderDesc("$createdAt"),
        ],
      });
      return comments;
    } catch (error) {
      console.error("Appwrite service :: getComments ::", error);
      
    }
  }

  async addReport({ postId, userId }) {
    try {
      // 1. Save report in postReports table
      await this.tables.createRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPostReports,
        rowId: ID.unique(),
        data: { postId, userId },
      });

      // 2. Increment reportsCount in posts table
      const post = await this.tables.getRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPosts,
        rowId: postId,
      });

      await this.tables.updateRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPosts,
        rowId: postId,
        data: {
          reportsCount: (post.reportsCount || 0) + 1,
        },
      });
    } catch (error) {
      console.error("Appwrite service :: addReport ::", error);
      throw error;
    }
  }

  // async removeReaction({ postId, userId }) {
  //   try {
  //     // 1. Find the user’s reaction
  //     const reactions = await this.tables.listRows({
  //       databaseId: conf.appwriteDatabaseId,
  //       tableId: conf.appwriteCollectionIdPostReactions,
  //       queries: [
  //         Query.equal("postId", [postId]),
  //         Query.equal("userId", [userId]),
  //       ],
  //     });

  //     if (reactions.rows.length === 0) return; // nothing to remove

  //     const reaction = reactions.rows[0];

  //     // 2. Delete reaction row
  //     await this.tables.deleteRow({
  //       databaseId: conf.appwriteDatabaseId,
  //       tableId: conf.appwriteCollectionIdPostReactions,
  //       rowId: reaction.$id,
  //     });

  //     // 3. Decrement counter in posts table
  //     const field =
  //       reaction.reaction === "like" ? "likesCount" : "dislikesCount";
  //     const post = await this.tables.getRow({
  //       databaseId: conf.appwriteDatabaseId,
  //       tableId: conf.appwriteCollectionIdPosts,
  //       rowId: postId,
  //     });

  //     await this.tables.updateRow({
  //       databaseId: conf.appwriteDatabaseId,
  //       tableId: conf.appwriteCollectionIdPosts,
  //       rowId: postId,
  //       data: {
  //         [field]: Math.max((post[field] || 0) - 1, 0),
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Appwrite service :: removeReaction ::", error);
  //     throw error;
  //   }
  // }

  async removeComment({ postId, commentId }) {
    try {
      // 1. Delete comment
      await this.tables.deleteRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdComments,
        rowId: commentId,
      });

      // 2. Decrement counter in posts table
      const post = await this.tables.getRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPosts,
        rowId: postId,
      });

      await this.tables.updateRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPosts,
        rowId: postId,
        data: {
          commentsCount: Math.max((post.commentsCount || 0) - 1, 0),
        },
      });
    } catch (error) {
      console.error("Appwrite service :: removeComment ::", error);
      throw error;
    }
  }

  async removeReport({ postId, reportId }) {
    try {
      // 1. Delete report
      await this.tables.deleteRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPostReports,
        rowId: reportId,
      });

      // 2. Decrement counter in posts table
      const post = await this.tables.getRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPosts,
        rowId: postId,
      });

      await this.tables.updateRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionIdPosts,
        rowId: postId,
        data: {
          reportsCount: Math.max((post.reportsCount || 0) - 1, 0),
        },
      });
    } catch (error) {
      console.error("Appwrite service :: removeReport ::", error);
      throw error;
    }
  }
}

const postsReactionService = new PostsReactionService();
export default postsReactionService;
