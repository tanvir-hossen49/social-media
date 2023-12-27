import { Client, Databases, Query, Storage, ID } from "appwrite";
import conf from "../conf/conf";

export class Service {
    client = new Client;
    database;
    constructor() {
        this.client = this.client.setEndpoint(conf.appwriteUrl).setProject(conf.projectId)
        this.database = new Databases(this.client)   
    }
}