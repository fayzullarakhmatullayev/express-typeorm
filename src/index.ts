import app from "./app";
import { AppDataSource } from "./data-source";

AppDataSource.initialize()
  .then(async () => {
    const PORT = process.env.PORT || 8080;

    app.listen(PORT, () => {
      console.log(`Express server has started on http://localhost:${PORT}`);
    });
  })
  .catch(error => console.log(error));
