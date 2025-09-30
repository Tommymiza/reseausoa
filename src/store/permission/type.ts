export type PermissionItem = {
  id: number;
  nom: string;
};

export type TypePermission = "C" | "R" | "U" | "D";

export type PermissionStore = {
  permission: PermissionItem | null;
  permissionList: PermissionItem[];
  loading: boolean;
  createPermission: (
    permission: Partial<PermissionItem>
  ) => Promise<PermissionItem>;
  updatePermission: ({
    id,
    permission,
  }: {
    id: number;
    permission: Partial<PermissionItem>;
  }) => Promise<PermissionItem>;
  deletePermission: (id: number) => Promise<PermissionItem>;
  getPermission: ({
    id,
    args,
  }: {
    id: number;
    args?: any;
  }) => Promise<PermissionItem>;
  getPermissions: (args?: any) => Promise<PermissionItem[]>;
  editPermission: (id: number) => Promise<any>;
  updateUserPermissions: (allPermissions: {
    id: number;
    permissions: {
      permission_id: number;
      type: TypePermission;
    }[];
  }) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
