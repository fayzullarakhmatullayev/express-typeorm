import app from "./app";
import { PORT } from "./config";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Express server has started on http://localhost:${PORT}`);
    });
  })
  .catch(error => console.log(error));
