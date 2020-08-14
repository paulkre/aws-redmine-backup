import * as Client from "ssh2-sftp-client";
import { SshProps } from "../props";

export async function createSftpClient({
  key,
  host,
  user,
}: SshProps): Promise<Client> {
  const client = new Client();
  await client.connect({
    host,
    username: user,
    privateKey: key,
  });
  return client;
}
