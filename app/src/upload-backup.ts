import { readFileSync } from "fs";
import { S3 } from "aws-sdk";
import { fromBuffer as getFileType } from "file-type";

import { Props } from "./props";

export async function uploadBackup(filename: string, props: Props) {
  const buffer = readFileSync(`${props.tmpDir}/${filename}`);
  const fileTypeResult = await getFileType(buffer);
  const s3 = new S3();
  return s3
    .putObject({
      Bucket: props.s3.bucketName,
      Key: filename,
      Body: buffer,
      ContentType: fileTypeResult ? fileTypeResult.mime : "application/zip",
    })
    .promise();
}
