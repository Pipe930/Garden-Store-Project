import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Permission } from 'src/modules/access-control/dto/create-role.dto';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';

export function Auth(permissions: Permission[]) {

    return applyDecorators(
        SetMetadata(PERMISSIONS_KEY, permissions),
        UseGuards(AuthGuard, PermissionsGuard)
    )
}