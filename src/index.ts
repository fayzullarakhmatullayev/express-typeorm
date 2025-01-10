import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import * as morgan from "morgan";
import "dotenv/config";
import { AppDataSource } from "./data-source";


AppDataSource.initialize()




    app.listen(PORT, () => {
      console.log(`Express server has started on http://localhost:${PORT}`);
    });
  })
  .catch(error => console.log(error));
