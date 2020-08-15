import { getConfig } from "./config";
import { createBackup } from "./backup";
import { deleteExpiredBackups } from "./delete-expired-backups";

export const handler = async () => {
  const props = await getConfig();

  const filename = await createBackup(props);
  const deleted = await deleteExpiredBackups(props);

  const result = {
    BackupCreated: filename,
    ExpiredBackupsDeleted: deleted,
  };

  console.log(result);

  return result;
};
