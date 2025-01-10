import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import * as morgan from "morgan";
import "dotenv/config";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import { handleError } from "./middleware/errorMiddleware";

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(morgan("tiny"));
    app.use(bodyParser.json());
    app.use(handleError);
    const PORT = process.env.PORT || 8080;

    // register express routes from defined application routes
    Routes.forEach(route => {
      (app as any)[route.method](
        route.route,
        async (req: Request, res: Response, next: Function) => {
          try {
            const result = await new (route.controller as any)()[route.action](
              req,
              res,
              next
            );

            res.json(result);
          } catch (error) {
            next(error);
          }
        }
      );
    });

    // setup express app here
    // ...

    // start express server

    app.listen(PORT, () => {
      console.log(`Express server has started on http://localhost:${PORT}`);
    });
  })
  .catch(error => console.log(error));
