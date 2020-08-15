import { NodeSSH } from "node-ssh";
import { Props } from "./props";

export async function createSSH({
  sshHost,
  sshUser,
  sshKey,
}: Props): Promise<NodeSSH> {
  const client = new NodeSSH();

  return client.connect({
    host: sshHost,
    username: sshUser,
    privateKey: sshKey,
  });
}
