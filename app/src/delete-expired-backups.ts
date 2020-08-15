import { S3 } from "aws-sdk";

import { Config } from "./config";

const maxNumBackups = 5;

export async function deleteExpiredBackups({
  s3Bucket,
}: Config): Promise<string[]> {
  const s3 = new S3();

  const { Contents: allObjects } = await s3
    .listObjects({ Bucket: s3Bucket })
    .promise();

  if (!allObjects || !allObjects.length) return [];

  const numExpired = allObjects.length - maxNumBackups;
  if (numExpired < 1) return [];

  const expiredObjects = allObjects
    .sort(
      ({ LastModified: a }, { LastModified: b }) => a!.getTime() - b!.getTime()
    )
    .slice(0, numExpired);

  const { Deleted } = await s3
    .deleteObjects({
      Bucket: s3Bucket,
      Delete: {
        Objects: expiredObjects.map(({ Key }) => ({ Key: Key! })),
      },
    })
    .promise();

  return Deleted ? Deleted.map(({ Key }) => Key!) : [];
}
