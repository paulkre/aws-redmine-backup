export type SshProps = {
  key: string;
  host: string;
  user: string;
};

export type S3Props = {
  bucketName: string;
};

export type Props = {
  tmpDir: string;
  ssh: SshProps;
  s3: S3Props;
};

function validateSshProps(input?: Partial<SshProps>) {
  if (!input || !input.key || !input.host || !input.user)
    throw Error(
      "Function input invalid. The following structure is required: { host: string; user: string; key: string; }"
    );
}

function validateS3Props(input?: Partial<S3Props>) {
  if (!input || !input.bucketName)
    throw Error(
      "Function input invalid. The following structure is required: { bucketName: string; }"
    );
}

export function sanitizeProps(input: any): Props {
  validateSshProps(input.ssh);
  validateS3Props(input.s3);

  return {
    ...input,
    tmpDir: input.tmpDir || "/tmp",
  };
}
