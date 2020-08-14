import * as date from "date-and-time";
import * as fs from "fs";

import { validateSshProps } from "./ssh/validate-props";
import { createSshShell } from "./ssh/shell";
import { createSftpClient } from "./ssh/sftp";

export async function createBackup(props: any) {
  const sshProps = validateSshProps(props);
  const shell = await createSshShell(sshProps);
  const sftp = await createSftpClient(sshProps);

  try {
    await shell.run(
      'echo "[mysqldump]\nuser=root\npassword=$(cat bitnami_application_password)" >> /opt/bitnami/mysql/my.cnf'
    );
    const filename = `backup_${date.format(new Date(), "YYYYMMDDHHmm")}.sql`;
    await shell.run(`mysqldump bitnami_redmine > ${filename}`);
    await shell.run(
      'echo "$(head -n -3 /opt/bitnami/mysql/my.cnf)" > /opt/bitnami/mysql/my.cnf'
    );
    await shell.run(`zip ${filename}.zip ${filename}`);

    await sftp.get(`${filename}.zip`, fs.createWriteStream(`${filename}.zip`));

    await shell.run(`rm ${filename} ${filename}.zip`);

    return "OK";
  } finally {
    shell.close();
    sftp.end();
  }
}
