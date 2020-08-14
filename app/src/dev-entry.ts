import { config } from "dotenv";
import { handler } from ".";

config();

const { SSH_HOST, SSH_USER, SSH_KEY } = process.env;

handler({
  host: SSH_HOST,
  user: SSH_USER,
  key: SSH_KEY,
}).then((res) => console.log(res));
