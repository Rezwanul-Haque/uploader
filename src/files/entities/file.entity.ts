import { EntityHelper } from 'src/utils/entity-helper';

// @Entity({ name: 'file' })
export class FileEntity extends EntityHelper {
  publicKey: string;
  path: string;
  privateKey: string;
}
