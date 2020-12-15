import * as TypeORM from "typeorm";
import models from "../models";

export default async () => {
  // Get the options from ormconfig.js
  const options = await TypeORM.getConnectionOptions();

  await TypeORM.createConnection({
    ...options,
    entities: models,
    synchronize: true,
    dropSchema: true,
  });
};
