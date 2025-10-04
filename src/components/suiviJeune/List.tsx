"use client";

import MaterialTable from "@/components/table/MaterialTable";
import { canActivate } from "@/lib/canActivate";
import suiviJeuneStore from "@/store/suiviJeune";
import { yupResolver } from "@hookform/resolvers/yup";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { IconButton, Stack, styled } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

import Columns from "./table/columns";

type FormValues = {
  date: string;
  deroulement: string;
  id_jeune: number;
  type_accompagnateur: string;
};

const suiviJeuneSchema = Yup.object({
  date: Yup.string().required("Date requise"),
  deroulement: Yup.string().required("Déroulement requis"),
  id_jeune: Yup.number().min(1).required(),
  type_accompagnateur: Yup.string().required("Type d'accompagnateur requis"),
});

type ListSuiviJeuneProps = {
  jeuneId: number;
};

export type { FormValues };

export default function ListSuiviJeune({ jeuneId }: ListSuiviJeuneProps) {
  const {
    suiviJeuneList,
    getSuiviJeunes,
    deleteSuiviJeune,
    updateSuiviJeune,
    createSuiviJeune,
    loading,
  } = suiviJeuneStore();

  const {
    control,
    trigger,
    getValues,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(suiviJeuneSchema),
    mode: "onChange",
    defaultValues: {
      date: new Date().toISOString().substring(0, 10),
      deroulement: "",
      id_jeune: jeuneId,
      type_accompagnateur: "Technicien",
    },
  });

  useEffect(() => {
    setValue("id_jeune", jeuneId);
  }, [jeuneId, setValue]);

  const refreshList = useCallback(() => {
    getSuiviJeunes({
      where: {
        id_jeune: jeuneId,
      },
      orderBy: {
        date: "desc",
      },
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de récupérer les suivis du jeune");
    });
  }, [getSuiviJeunes, jeuneId]);

  useEffect(() => {
    refreshList();
  }, [jeuneId, refreshList]);

  const confirm = useConfirm();
  const canUpdate = canActivate("SuiviJeune", "U");
  const canDelete = canActivate("SuiviJeune", "D");

  const handleDelete = (id: number) => {
    confirm({
      title: "Supprimer",
      description: "Voulez-vous vraiment supprimer ce suivi ?",
      confirmationText: "Oui",
      cancellationText: "Annuler",
    })
      .then(async () => {
        try {
          await deleteSuiviJeune(id);
          refreshList();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de supprimer le suivi");
        }
      })
      .catch(() => null);
  };

  return (
    <MaterialTable
      columns={Columns({ control, errors })}
      getRowId={(originalRow) => originalRow.id}
      data={suiviJeuneList}
      title="Suivi du jeune"
      state={{
        isLoading: loading,
        columnPinning: { left: ["date"] },
      }}
      onEditingRowSave={async ({ exitEditingMode, row }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload = {
            date: new Date(values.date).toISOString(),
            deroulement: values.deroulement,
            id_jeune: jeuneId,
            type_accompagnateur:
              values.type_accompagnateur === null
                ? "Technicien"
                : values.type_accompagnateur,
          };
          await updateSuiviJeune({
            id: row.original.id,
            suiviJeune: payload,
          });
          refreshList();
          reset({
            date: new Date().toISOString().substring(0, 10),
            deroulement: "",
            id_jeune: jeuneId,
            type_accompagnateur: "Technicien",
          });
          exitEditingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de mettre à jour le suivi");
        }
      }}
      onCreatingRowSave={async ({ exitCreatingMode }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload = {
            date: new Date(values.date).toISOString(),
            deroulement: values.deroulement,
            id_jeune: jeuneId,
            type_accompagnateur:
              values.type_accompagnateur === null
                ? null
                : values.type_accompagnateur,
          };
          await createSuiviJeune(payload);
          refreshList();
          reset({
            date: new Date().toISOString().substring(0, 10),
            deroulement: "",
            id_jeune: jeuneId,
            type_accompagnateur: "Technicien",
          });
          exitCreatingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de créer le suivi");
        }
      }}
      onCreatingRowCancel={({ table }) => {
        reset({
          date: new Date().toISOString().substring(0, 10),
          deroulement: "",
          id_jeune: jeuneId,
          type_accompagnateur: "Technicien",
        });
        table.setCreatingRow(null);
      }}
      onEditingRowCancel={({ table }) => {
        reset({
          date: new Date().toISOString().substring(0, 10),
          deroulement: "",
          id_jeune: jeuneId,
          type_accompagnateur: "Technicien",
        });
        table.setEditingRow(null);
      }}
      renderRowActions={({ row, table }) => (
        <BtnContainer>
          {canUpdate && (
            <IconButton
              color="warning"
              onClick={() => {
                reset({
                  date: row.original.date,
                  deroulement: row.original.deroulement,
                  id_jeune: jeuneId,
                  type_accompagnateur: row.original.type_accompagnateur ?? null,
                });
                table.setEditingRow(row);
              }}
            >
              <EditRounded />
            </IconButton>
          )}
          {canDelete && (
            <IconButton
              color="error"
              onClick={() => handleDelete(row.original.id)}
            >
              <DeleteRounded />
            </IconButton>
          )}
        </BtnContainer>
      )}
    />
  );
}

const BtnContainer = styled(Stack)(() => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 1,
}));
