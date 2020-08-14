// import { createBackup } from "./create-backup";
import { listRootFiles } from "./list-root-files";

export const handler = async (props: any) => {
  return listRootFiles(props);
  // return await createBackup(props);
};
