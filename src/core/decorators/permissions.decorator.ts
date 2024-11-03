import { SetMetadata } from '@nestjs/common';
import { PermissionObject } from 'src/modules/access-control/dto/create-role.dto';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (permissions: PermissionObject[]) => SetMetadata(PERMISSIONS_KEY, permissions);
