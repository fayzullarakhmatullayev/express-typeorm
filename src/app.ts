import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import * as morgan from "morgan";
import "dotenv/config";
import { Routes } from "./routes";
import { handleError } from "./middleware/errorMiddleware";
import { validationResult } from "express-validator";

const app = express();
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(handleError);

// register express routes from defined application routes
Routes.forEach(route => {
  (app as any)[route.method](
    route.route,
    ...route.validation,
    async (req: Request, res: Response, next: Function) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

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

export default app;
