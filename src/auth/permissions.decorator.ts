import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export interface PermissionRequirement {
  resource: string;
  action: string;
}

export const Permissions = (resource: string, action: string) =>
  SetMetadata(PERMISSIONS_KEY, { resource, action } as PermissionRequirement);
