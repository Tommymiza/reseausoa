import authStore from "@/store/auth";
import permissionStore from "@/store/permission";
import { PermissionItem, TypePermission } from "@/store/permission/type";
import { UtilisateurItem } from "@/store/utilisateur/type";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function PermissionEdit({
  permissionEdit,
  setPermissionEdit,
  refreshList,
}: {
  permissionEdit: UtilisateurItem | null;
  setPermissionEdit: (user: UtilisateurItem | null) => void;
  refreshList: () => void;
}) {
  const { permissionList, updateUserPermissions } = permissionStore();
  const { getMe } = authStore();
  const [selectedPermissions, setSelectedPermissions] = useState<
    {
      permission_id: number;
      type: TypePermission;
    }[]
  >([]);
  const typePermissions: TypePermission[] = ["C", "R", "U", "D"];

  const onChecked = (
    permission: PermissionItem,
    type: TypePermission,
    c: boolean
  ) => {
    if (c) {
      setSelectedPermissions((prev) => [
        ...prev,
        { permission_id: permission.id, type: type as any },
      ]);
    } else {
      setSelectedPermissions((prev) =>
        prev.filter(
          (p) => !(p.permission_id === permission.id && p.type === type)
        )
      );
    }
  };

  const handleSave = async () => {
    try {
      if (!permissionEdit) return;
      await updateUserPermissions({
        id: permissionEdit.id,
        permissions: selectedPermissions,
      });
      await getMe();
      setPermissionEdit(null);
      refreshList();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (permissionEdit) {
      const perms = permissionEdit.Permissions.map((p) => ({
        permission_id: p.Permission.id,
        type: p.type,
      }));
      setSelectedPermissions(perms);
    }
  }, [permissionEdit]);
  return (
    <Dialog
      open={Boolean(permissionEdit)}
      onClose={() => setPermissionEdit(null)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Modifier les permissions</DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
          <Box sx={{ border: "1px solid #ccc", borderRadius: 1 }} padding={2}>
            {permissionList.map((permission) => (
              <Box
                key={permission.id}
                display="flex"
                alignItems="center"
                mb={2}
              >
                <Box flexGrow={1}>{permission.nom}</Box>
                {typePermissions.map((type) => (
                  <Box key={type} mx={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Boolean(
                            selectedPermissions.find(
                              (p) =>
                                p.permission_id === permission.id &&
                                p.type === type
                            )
                          )}
                          onChange={(e, c) => onChecked(permission, type, c)}
                        />
                      }
                      label={type}
                    />
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={() => setPermissionEdit(null)}>Annuler</Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Enregistrer
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
