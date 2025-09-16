import { Client, Account, ID } from "appwrite";
import conf from "../conf/conf";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
  }

  // Send Magic URL
  async sendEmail({ email }) {
    try {
      
     
      const result = await this.account.createMagicURLToken({
        Id:ID.unique() ,// Let Appwrite create a unique ID for new users.
        email:email,
        url: "http://localhost:5173/auth/callback" //callback URL
      }
        
      );
      return result;
    } catch (error) {
      console.error("Magic URL error:", error);
      throw error;
    }
  }

  // Login with the secret from the URL 
  async loginWithMagicURL({ userId, secret }) {
    try {
      
      
      const session = await this.account.createSession({userId, secret});
      return session;
    } catch (error) {
      console.error("Failed to create session with magic URL:", error);
      throw error;
    }
  }

  // Get the currently logged-in user
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.info("No active Appwrite session found. This is expected for guests.");
      return null;
    }
  }
  
  // Logout the current user 
  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.error("Appwrite service :: logout :: error", error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;