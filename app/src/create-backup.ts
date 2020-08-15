import * as date from "date-and-time";

import { Props } from "./props";
import { createSshShell } from "./ssh-shell";

export async function createBackup(props: Props) {
  const shell = await createSshShell(props.ssh);

  try {
    await shell.run(
      'echo "[mysqldump]\nuser=root\npassword=$(cat bitnami_application_password)" >> /opt/bitnami/mysql/my.cnf'
    );

    const tmpFilename = `${props.ssh.host}.${date.format(
      new Date(),
      "YYMMDDHHmm"
    )}.sql`;
    await shell.run(`mysqldump bitnami_redmine > ${tmpFilename}`);
    await shell.run(
      'echo "$(head -n -3 /opt/bitnami/mysql/my.cnf)" > /opt/bitnami/mysql/my.cnf'
    );

    const filename = `${tmpFilename}.zip`;
    await shell.run(`zip ${filename} ${tmpFilename}`);

    try {
      await shell.run(
        `aws configure set aws_access_key_id ${props.iam.accessKeyId}`
      );
      await shell.run(
        `aws configure set aws_secret_access_key ${props.iam.accessKeySecret}`
      );
      await shell.run(
        `aws s3api put-object --bucket ${props.s3.bucketName} --key ${filename} --body ${filename}`
      );
    } finally {
      await shell.run(`rm ${tmpFilename} ${filename}`);
    }

    return filename;
  } finally {
    shell.close();
  }
}
