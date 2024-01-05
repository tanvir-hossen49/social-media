import { Account, Avatars, Client, Databases, ID, Query } from "appwrite";
import { INewUser } from "@/types";
import conf from "../conf/conf";

export class AuthService {
    client = new Client;
    account;
    databases;
    avatars;
    
    constructor() {
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.projectId)
        this.account = new Account(this.client)
        this.databases = new Databases(this.client)
        this.avatars = new Avatars(this.client)   
    }

    async createAccount(user: INewUser) {
       try {
        const newAccount = await this.account.create(
            ID.unique(), user.email, user.password, user.name
        )

        if(!newAccount)  throw Error;

        const avatarUrl = this.avatars.getInitials(user.name);

        const newUser  = await this.saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl
        });

        return newUser;
       } catch (error) {
        console.log(error);
        return error;
       }
    }

    async saveUserToDB(user: {
        accountId: string; email: string; name: string; imageUrl: URL; username?: string;
      }) {
        try {
          const newUser = await this.databases.createDocument(
            conf.databaseId,
            conf.usersCollectionId,
            ID.unique(),
            user
          );
      
          return newUser;
        } catch (error) {
          console.log(error);
          return error;
        }
    }

    async signInAccount(user: { email: string, password: string }) {
        try{
            return await this.account.createEmailSession(user.email, user.password);
        } catch(error) {
            console.log(error);
            return error;
        }
    }

    async signOutAccount() {
        try {
            const session = await this.account.deleteSession('current')
            return session
        } catch (error) {
            console.log(error);
        }
    }

    async getCurrentUser() {
        try {
            const currentAccount = await this.account.get();
            
            if(!currentAccount) throw Error('Current user not available');
            console.log(currentAccount);
            
            const currentUser = await this.databases.listDocuments(
                conf.databaseId, conf.usersCollectionId,
                [Query.equal("accountId", currentAccount.$id)]
            )
            
            if(!currentUser) throw Error('Current user not available');

            return currentUser.documents[0];
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

const authService = new AuthService();
export default authService;