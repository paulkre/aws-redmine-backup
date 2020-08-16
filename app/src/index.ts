import { getConfig } from "./config";
import { createBackup } from "./backup";
import { deleteExpiredBackups } from "./delete-expired-backups";

export const handler = async () => {
  const config = await getConfig();

  const filename = await createBackup(config);
  const deleted = await deleteExpiredBackups(config);

  const result = {
    BackupCreated: filename,
    ExpiredBackupsDeleted: deleted,
  };

  console.log(result);

  return result;
};
