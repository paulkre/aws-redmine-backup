import { validateSshProps } from "./ssh/validate-props";
import { createSshShell } from "./ssh/shell";

export async function listRootFiles(props: any) {
  const sshProps = validateSshProps(props);
  const shell = await createSshShell(sshProps);

  try {
    return (await shell.run("ls -alh"))?.toString();
  } finally {
    shell.close();
  }
}
