const { env } = process;

export type Props = {
  sshHost: string;
  sshUser: string;
  sshKey: string;

  s3Bucket: string;

  iamKeyId: string;
  iamKeySecret: string;
};

const errorMessage = `The following structure is required: {
  sshHost: string;
  sshUser: string;
  sshKey: string;

  s3Bucket: string;

  iamKeyId: string;
  iamKeySecret: string;
}`;

export function sanitizeProps(input: Partial<Props>): Props {
  if (!input) throw Error(errorMessage);

  const props: Partial<Props> = {
    sshHost: input.sshHost || env.SSH_HOST,
    sshUser: input.sshUser || env.SSH_USER,
    sshKey: input.sshKey || env.SSH_KEY,

    s3Bucket: input.s3Bucket || env.S3_BUCKET,

    iamKeyId: input.iamKeyId || env.IAM_KEY_ID,
    iamKeySecret: input.iamKeySecret || env.IAM_KEY_SECRET,
  };

  if (!props.sshHost || !props.sshUser || !props.sshKey)
    throw Error(`SSH configuration invalid: ${errorMessage}`);
  if (!props.s3Bucket)
    throw Error(`S3 bucket configuration invalid: ${errorMessage}`);
  if (!props.iamKeyId || !props.iamKeySecret)
    throw Error(`IAM user configuration invalid: ${errorMessage}`);

  return props as Props;
}
