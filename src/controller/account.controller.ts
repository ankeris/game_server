import { NextFunction, Request, Response, Router } from 'express';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import router from 'express';

class Account {
    constructor(
        public id: number | null = null, 
        public username: string,
        public password: string,
        public nickname: string) 
        {
            this.id = id;
            this.username = username;
            this.password = password;
            this.nickname = nickname;    
            if (!this.id) delete this.id;
        }
}

interface Cycle<T> {
    (req: Request, res: Response): void
}

type Success = {
    lastID: number
}

export default class ExpressRouter {
    private db: any;
    private router: Router;
    constructor(db: any) {
        this.router = router.Router();
        this.db = db;
    }

    public init = (): Router => {
        this.router.get("/", this.get_accounts)
        this.router.post("/", this.create_account)
        this.router.post("/login", this.login)
        return this.router
    }

    private get_accounts: Cycle<any> = (req, res) => {
        this.db.get('SELECT * FROM account', (err: Error, accounts: Array<Account>) => {
            res.json(accounts)
        })
    }

    private create_account: Cycle<Account> = async ({body}: {body: Account}, res) => {
        let exists = false;
        await new Promise((resolve, rej) => 
            this.db.get('SELECT id FROM account WHERE username = ?', 
            [body.username], 
            (err: Error, id: number) => err ? res.send(err) : resolve(exists = id ? true : false)))

        if (exists) res.send("Username already exists");
        else {
            const newItem = new Account(null, body.username, body.password, body.nickname);
            bcrypt.genSalt(10, (err: Error, salt: string) => {
                if (err) throw err;
                bcrypt.hash(newItem.password, salt, (err: Error, hash: string) => {
                    if (err) throw err;
                    // Hash the password
                    newItem.password = hash;

                    this.db.run('INSERT INTO account(username, password, nickname) VALUES (?, ?, ?)', 
                    [newItem.username, newItem.password, newItem.nickname], 
                    function (this: Success, err: Error, account: Account) {
                        if (err) return res.status(500).send(err);
                        else res.json(this.lastID)
                    })
                });
            });
        }
    }

    private login: Cycle<any> = async (req, res) => {
        const account: Account | null = await new Promise((resolve, reject) => 
            this.db.get('SELECT * FROM account WHERE username = ?', 
            [req.body.username],
            (err: Error, account: Account) => account ? resolve(account) : resolve(null)))
        
        if (!account) {
            res.status(500).json("Username or password incorrect");
        } else {
            // Check submitted password
            const submittedPassword = req.body.password;
            bcrypt.compare(submittedPassword, account.password, (err, isMatch) => {
                if (err) throw err;
                if (!isMatch) {
                    res.status(500).json("Username or password incorrect");
                }
                // Remove password from token since we don't need it
                delete account.password;
                jwt.sign({ account }, <string>process.env.JWT_SECRET, { expiresIn: "7 days" }, (err: Error, token: string) => {
                    res.status(200).json(token);
                });
            });
        }
    }
}
