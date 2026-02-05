export type Permission = string

export type AuthorizationConfig = {
  readonly permissions: Record<Permission, true | undefined>
}

export const emptyAuthorization: AuthorizationConfig = { permissions: {} }

export const hasPermission = (config: AuthorizationConfig, permission: Permission): boolean =>
  config.permissions[permission] === true

export const hasAllPermissions = (config: AuthorizationConfig, permissions: ReadonlyArray<Permission>): boolean =>
  permissions.every(p => hasPermission(config, p))
