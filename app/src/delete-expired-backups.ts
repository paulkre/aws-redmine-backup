import { S3 } from "aws-sdk";

import { Props } from "./props";

const maxNumBackups = 5;

export async function deleteExpiredBackups(props: Props): Promise<string[]> {
  const s3 = new S3();
  const { bucketName } = props.s3;

  const { Contents: allObjects } = await s3
    .listObjects({
      Bucket: bucketName,
    })
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
      Bucket: bucketName,
      Delete: {
        Objects: expiredObjects.map(({ Key }) => ({ Key: Key! })),
      },
    })
    .promise();

  return Deleted ? Deleted.map(({ Key }) => Key!) : [];
}
