import { KMS } from "aws-sdk";

const { env } = process;

export type Config = {
  sshHost: string;
  sshUser: string;
  sshKey: string;

  s3Bucket: string;

  iamKeyId: string;
  iamKeySecret: string;
};

const requiredVarNames = [
  "AWS_REGION",

  "SSH_HOST",
  "SSH_USER",
  "SSH_KEY",

  "S3_BUCKET",

  "IAM_KEY_ID",
  "IAM_KEY_SECRET",
];

function validateEnv() {
  const missingVars = requiredVarNames.filter((name) => !env[name]);
  if (missingVars.length)
    throw Error(`Missing Environment Variables: ${missingVars.join(", ")}`);
}

async function decryptVars(names: string[], config: any): Promise<Config> {
  if (!env.AWS_LAMBDA_FUNCTION_NAME) return config;
  const kms = new KMS({ region: env.AWS_REGION });

  const decrypted: any = { ...config };

  for (const name of names) {
    decrypted[name] = (
      await kms
        .decrypt({
          CiphertextBlob: Buffer.from(config[name] || "", "base64"),
          EncryptionContext: {
            LambdaFunctionName: env.AWS_LAMBDA_FUNCTION_NAME,
          },
        })
        .promise()
    ).Plaintext?.toString();
  }

  return decrypted as Config;
}

function sanitizeConfig(rawConfig: any): Config {
  const config: any = {};
  for (const name of Object.keys(rawConfig)) {
    config[name] = rawConfig[name].replace(/\\n/g, "\n");
  }

  return config as Config;
}

export async function getConfig(): Promise<Config> {
  validateEnv();

  const config = {
    sshHost: env.SSH_HOST!,
    sshUser: env.SSH_USER!,
    sshKey: env.SSH_KEY!,

    s3Bucket: env.S3_BUCKET!,

    iamKeyId: env.IAM_KEY_ID!,
    iamKeySecret: env.IAM_KEY_SECRET!,
  };

  return sanitizeConfig(await decryptVars(["sshKey", "iamKeySecret"], config));
}
