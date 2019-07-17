import * as bodyParser from 'body-parser';
import { createConnection } from 'typeorm';
import express from 'express';
import { Routes } from './routes/Routes';
import 'reflect-metadata';
import { User } from './entity/User';

class Index {
  public app: express.Application = express();
  public routePrv: Routes = new Routes();
  // public mongoUrl: string = 'mongodb://localhost/CRMdb';
  // public mongoUrl: string = 'mongodb://dalenguyen:123123@localhost:27017/CRMdb';

  constructor() {
    this.config();
    this.DBSetup();
    this.routePrv.routes(this.app);
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    // serving static files
    this.app.use(express.static('public'));
  }

  private DBSetup(): void {
    createConnection()
      .then(async connection => {
        console.log(connection);
        console.log('Inserting a new user into the database...');
        const user = new User();
        user.firstName = 'Timber';
        user.lastName = 'Saw';
        user.age = 25;
        await connection.manager.save(user);
        console.log('Saved a new user with id: ' + user.id);

        console.log('Loading users from the database...');
        const users = await connection.manager.find(User);
        console.log('Loaded users: ', users);

        console.log('Here you can setup and run express/koa/any other framework.');
      })
      .catch(error => console.log(error));
  }
}

export default new Index().app;
