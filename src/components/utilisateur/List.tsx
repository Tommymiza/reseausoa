"use client";
import authStore from "@/store/auth";
import oprStore from "@/store/opr";
import permissionStore from "@/store/permission";
import utilisateurStore from "@/store/utilisateur";
import { UtilisateurItem } from "@/store/utilisateur/type";
import { yupResolver } from "@hookform/resolvers/yup";
import { Delete, Edit, Lock } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";
import MaterialTable from "../table/MaterialTable";
import PermissionEdit from "./modal/PermissionEdit";
import Columns from "./table/columns";

const schema = Yup.object().shape({
  nom: Yup.string().required("Nom requis"),
  prenom: Yup.string().optional(),
  email: Yup.string().email("Email invalide").required("Email requis"),
  role: Yup.mixed().oneOf(["USER", "ADMIN"]).required("Role requis"),
  password: Yup.string()
    .min(8, "Minimum 8 caractères")
    .required("Mot de passe requis"),
  telephone: Yup.string().length(10, "De format: 03XXXXXXXX"),
  opr_id: Yup.number().optional(),
});

type FormValues = Yup.InferType<typeof schema>;

export default function ListUser() {
  const {
    utilisateurList,
    deleteUtilisateur,
    getUtilisateurs,
    createUtilisateur,
    updateUtilisateur,
    loading,
  } = utilisateurStore();

  const { getMe } = authStore();

  const { getOprs } = oprStore();
  const { getPermissions } = permissionStore();
  const {
    control,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      password: "",
      telephone: "",
      role: "USER",
    },
  });

  const [permissionEdit, setPermissionEdit] = useState<UtilisateurItem | null>(
    null
  );

  const confirm = useConfirm();

  const handleDelete = async (id: number) => {
    const { confirmed } = await confirm({
      title: "Supprimer",
      description: "Voulez-vous vraiment supprimer cet Utilisateur ?",
      confirmationText: "Oui",
      cancellationText: "Annuler",
    });
    if (confirmed) {
      await deleteUtilisateur(id);
      refreshList();
    }
  };

  const refreshList = () => {
    getUtilisateurs({
      include: {
        Opr: true,
        Permissions: {
          include: {
            Permission: true,
          },
        },
      },
    });
    getOprs();
    getPermissions();
  };

  useEffect(() => {
    refreshList();
  }, []);

  return (
    <Box>
      <PermissionEdit
        permissionEdit={permissionEdit}
        setPermissionEdit={setPermissionEdit}
        refreshList={refreshList}
      />
      <MaterialTable
        columns={Columns({ control, errors })}
        data={utilisateurList}
        title="Liste utilisateur"
        state={{
          isLoading: loading,
          columnPinning: { left: ["nom", "prenom"] },
          columnVisibility: {
            password: false,
          },
        }}
        onEditingRowSave={async ({ exitEditingMode, row }) => {
          try {
            const isValid = await trigger();
            if (!isValid) return;
            const values = getValues();
            const payload: Partial<UtilisateurItem> = {
              ...values,
              opr_id: Boolean(values.opr_id) ? values.opr_id : null,
              role: values.role as "USER" | "ADMIN",
            };
            await updateUtilisateur({
              id: row.original.id,
              utilisateur: payload,
            });
            await getMe();
            refreshList();
            reset();
            exitEditingMode();
          } catch (error: any) {
            toast.error(error.message);
          }
        }}
        onCreatingRowSave={async ({ exitCreatingMode }) => {
          try {
            const isValid = await trigger();
            if (!isValid) return;
            const values = getValues();
            const payload: Partial<UtilisateurItem> = {
              ...values,
              opr_id: Boolean(values.opr_id) ? values.opr_id : null,
              role: values.role as "USER" | "ADMIN",
            };
            await createUtilisateur(payload);
            refreshList();
            reset();
            exitCreatingMode();
          } catch (error: any) {
            toast.error(error.message);
          }
        }}
        onCreatingRowCancel={({ table }) => {
          reset();
          table.setCreatingRow(null);
        }}
        onEditingRowCancel={({ table }) => {
          reset();
          table.setEditingRow(null);
        }}
        enableColumnPinning={true}
        enableRowActions={true}
        createDisplayMode="modal"
        editDisplayMode="modal"
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <IconButton
              onClick={() => {
                const { password, id, Opr, Permissions, ...rest } =
                  row.original;
                reset({
                  ...rest,
                  password: "",
                });
                table.setEditingRow(row);
              }}
              color="secondary"
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => handleDelete(row.original.id)}
              color="error"
            >
              <Delete />
            </IconButton>
            <IconButton
              onClick={() => {
                setPermissionEdit(row.original);
              }}
              color="info"
            >
              <Lock />
            </IconButton>
          </Box>
        )}
      />
    </Box>
  );
}
