import { NodeSSH } from "node-ssh";
import { Config } from "./config";

export async function createSSH({
  sshHost,
  sshUser,
  sshKey,
}: Config): Promise<NodeSSH> {
  const client = new NodeSSH();

  return client.connect({
    host: sshHost,
    username: sshUser,
    privateKey: sshKey,
  });
}
