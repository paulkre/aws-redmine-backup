import { NodeSSH } from "node-ssh";
import { Config } from "./config";

type SSH = {
  execCommand(command: string): Promise<string>;
  dispose(): void;
};

export async function createSSH({
  sshHost,
  sshUser,
  sshKey,
}: Config): Promise<SSH> {
  const client = await new NodeSSH().connect({
    host: sshHost,
    username: sshUser,
    privateKey: sshKey,
  });

  return {
    async execCommand(command) {
      const { stdout, stderr } = await client.execCommand(command);

      if (stderr) throw stderr;

      return stdout;
    },
    dispose: () => client.dispose(),
  };
}
