import { Express, Router } from "express";
import * as UserController from "./controller/user.controller";
import AccountController from "./controller/account.controller";
import { ensureAuth } from "./controller/user.controller";

export default class ExpressRouter {
    public router: Router;
    private app: Express;
    private db: any;

    constructor(app: Express, db: any) {
        this.router = Router();
        this.app = app;
        this.db = db;
    }

    public init(): void {
        this.router.use('/account', new AccountController(this.db).init());
        this.app.use("/api/", this.router);
    }
}

// Get
// this.router.get("/questions", ensureAuth, QuestionController.getAll);