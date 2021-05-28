import { config } from "dotenv";
import Cadency from "./cadency/Cadency";
import Config from "./cadency/Config";

config();

new Cadency(new Config(process.env.BOT_TOKEN as string)).start();
