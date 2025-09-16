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
        userId: ID.unique(),
        email: email,
        url: "http://localhost:5173/auth/callback"
      });
      console.log("Magic URL token result:", result);
      return result;
    } catch (error) {
      console.error("Magic URL error:", error);
      throw error;
    }
  }

  //login method
  async login({userId,secret}){
    try {
      const session=await this.account.createSession({
        userId: userId,
        secret: secret
      })
      return session
    } catch (error) {
      throw error
    }
  }
  //get the currently logged user
  async getCurrentUser(){
    try {
      const user=await this.account.get()
      const {email,...restData}=user
      return restData;
    } catch (error) {
      throw error
    }
  }
  //log out the current user
  async logout(){
    try {
      await this.account.deleteSessions();
    } catch (error) {
      throw error
    }
  }
}

const authService = new AuthService();
export default authService;
