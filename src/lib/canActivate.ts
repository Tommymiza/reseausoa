import authStore from "@/store/auth";
import { TypePermission } from "@/store/permission/type";

export function canActivate(permission: string, type: TypePermission) {
  const { auth } = authStore();
  if (!auth) return false;
  if (auth.role === "ADMIN") return true;
  if (!auth.Permissions) return false;
  return auth.Permissions.some(
    (p) => p.Permission.nom === permission && p.type === type
  );
}

export function isAdmin() {
  const { auth } = authStore();
  if (!auth) return false;
  return auth.role === "ADMIN";
}
