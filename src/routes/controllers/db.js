import { createPool } from "mysql2/promise";
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "../../config.js";

export const pool = createPool({
  host: "locahost",
  user: "root",
  password: "1065828184",
  port: 3306,
  database: "lnfg",
});
