import * as date from "date-and-time";
import * as fs from "fs";

import { Props } from "./props";
import { createSshShell } from "./ssh/shell";
import { createSftpClient } from "./ssh/sftp";

async function downloadBackup(props: Props, filename: string) {
  const sftp = await createSftpClient(props.ssh);
  try {
    await sftp.get(
      filename,
      fs.createWriteStream(`${props.tmpDir}/${filename}`)
    );
  } finally {
    sftp.end();
  }
}

export async function createBackup(props: Props) {
  const shell = await createSshShell(props.ssh);

  try {
    await shell.run(
      'echo "[mysqldump]\nuser=root\npassword=$(cat bitnami_application_password)" >> /opt/bitnami/mysql/my.cnf'
    );

    const tmpFilename = `backup_${date.format(new Date(), "YYMMDDHHmm")}.sql`;
    await shell.run(`mysqldump bitnami_redmine > ${tmpFilename}`);
    await shell.run(
      'echo "$(head -n -3 /opt/bitnami/mysql/my.cnf)" > /opt/bitnami/mysql/my.cnf'
    );

    const filename = `${tmpFilename}.zip`;
    await shell.run(`zip ${filename} ${tmpFilename}`);

    await downloadBackup(props, filename);

    try {
      await shell.run(`rm ${tmpFilename} ${filename}`);
    } catch (err) {
      fs.unlinkSync(filename);
      throw err;
    }

    return filename;
  } finally {
    shell.close();
  }
}
