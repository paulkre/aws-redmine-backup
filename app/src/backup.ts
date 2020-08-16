import * as date from "date-and-time";

import { Config } from "./config";
import { createSSH } from "./ssh";

export async function createBackup(config: Config) {
  const ssh = await createSSH(config);

  try {
    await ssh.execCommand(
      'echo "[mysqldump]\nuser=root\npassword=$(cat bitnami_application_password)" >> /opt/bitnami/mysql/my.cnf'
    );

    const tmpFilename = `${date.format(new Date(), "YYMMDDHHmm")}.sql`;
    await ssh.execCommand(`mysqldump bitnami_redmine > ${tmpFilename}`);
    await ssh.execCommand(
      'echo "$(head -n -3 /opt/bitnami/mysql/my.cnf)" > /opt/bitnami/mysql/my.cnf'
    );

    const filename = `${tmpFilename}.zip`;
    await ssh.execCommand(`zip ${filename} ${tmpFilename}`);

    try {
      await ssh.execCommand(
        `aws configure set aws_access_key_id ${config.iamKeyId}`
      );
      await ssh.execCommand(
        `aws configure set aws_secret_access_key ${config.iamKeySecret}`
      );
      await ssh.execCommand(
        `aws s3api put-object --bucket ${config.s3Bucket} --key ${filename} --body ${filename}`
      );
    } finally {
      await ssh.execCommand(`rm ${tmpFilename} ${filename}`);
    }

    return filename;
  } finally {
    ssh.dispose();
  }
}
