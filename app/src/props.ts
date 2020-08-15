export type SshProps = {
  key: string;
  host: string;
  user: string;
};

export type S3Props = {
  bucketName: string;
};

export type IamCredentials = {
  accessKeyId: string;
  accessKeySecret: string;
};

export type Props = {
  userDir?: string;
  ssh: SshProps;
  s3: S3Props;
  iam: IamCredentials;
};

const errorMessage = `The following structure is required: {
  ssh: {
    key: string;
    host: string;
    user: string;
  };
  s3: { bucketName: string };
  iam: {
    accessKeyId: string;
    accessKeySecret: string;
  };
}`;

function validateSshProps(input?: Partial<SshProps>) {
  if (!input || !input.key || !input.host || !input.user)
    throw Error(`SSH config invalid: ${errorMessage}`);
}

function validateS3Props(input?: Partial<S3Props>) {
  if (!input || !input.bucketName)
    throw Error(`S3 config invalid: ${errorMessage}`);
}

function validateIamProps(input?: Partial<IamCredentials>) {
  if (!input || !input.accessKeyId || !input.accessKeySecret)
    throw Error(`IAM config invalid: ${errorMessage}`);
}

export function sanitizeProps(input: any): Props {
  validateSshProps(input.ssh);
  validateS3Props(input.s3);
  validateIamProps(input.iam);

  return input;
}
