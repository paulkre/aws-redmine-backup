import { config } from "dotenv";
import { Props } from "./props";
import { handler } from ".";

config();

const { SSH_HOST, SSH_USER, SSH_KEY, S3_BUCKET_NAME } = process.env;

const props: Props = {
  ssh: {
    host: SSH_HOST!,
    user: SSH_USER!,
    key: SSH_KEY!,
  },
  s3: {
    bucketName: S3_BUCKET_NAME!,
  },
  tmpDir: process.cwd(),
};

handler(props).then((res) => console.log(res));
