import * as fs from "fs";

import { sanitizeProps } from "./props";
import { createBackup } from "./create-backup";
import { uploadBackup } from "./upload-backup";

export const handler = async (input: any) => {
  const props = sanitizeProps(input);

  const filename = await createBackup(props);

  try {
    return await uploadBackup(filename, props);
  } finally {
    fs.unlinkSync(`${props.tmpDir}/${filename}`);
  }
};
