export type SshProps = {
  key: string;
  host: string;
  user: string;
};

export function validateSshProps(input: any): SshProps {
  if (!input || !input.key || !input.host || !input.user)
    throw Error(
      "Function input invalid. The following structure is required: { host: string; user: string; key: string; }"
    );

  return input;
}
