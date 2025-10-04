"use client";

import MaterialTable from "@/components/table/MaterialTable";
import { canActivate } from "@/lib/canActivate";
import speculationStore from "@/store/speculation";
import {
  SPECULATION_TYPES,
  type SpeculationItem,
  type SpeculationType,
} from "@/store/speculation/type";
import { yupResolver } from "@hookform/resolvers/yup";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { IconButton, Stack, styled } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useConfirm } from "material-ui-confirm";
import { toast } from "sonner";
import * as Yup from "yup";

import Columns from "./table/columns";

const schema = Yup.object({
  nom: Yup.string().trim().required("Nom requis"),
  type: Yup.mixed<SpeculationType>()
    .oneOf(SPECULATION_TYPES, "Type invalide")
    .required("Type requis"),
});

const DEFAULT_VALUES = {
  nom: "",
  type: SPECULATION_TYPES[0] as SpeculationType,
};

export default function ListSpeculation() {
  const {
    speculationList,
    getSpeculations,
    createSpeculation,
    updateSpeculation,
    deleteSpeculation,
    loading,
  } = speculationStore();

  const {
    control,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });

  const confirm = useConfirm();

  const canCreate = canActivate("Speculation", "C");
  const canUpdate = canActivate("Speculation", "U");
  const canDelete = canActivate("Speculation", "D");

  const refreshList = () => {
    getSpeculations({
      orderBy: {
        nom: "asc",
      },
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de récupérer les spéculations");
    });
  };

  useEffect(() => {
    refreshList();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const { confirmed } = await confirm({
        title: "Supprimer",
        description: "Voulez-vous vraiment supprimer cette spéculation ?",
        confirmationText: "Supprimer",
        cancellationText: "Annuler",
      });
      if (!confirmed) return;
      await deleteSpeculation(id);
      refreshList();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <MaterialTable
      title="Liste des spéculations"
      columns={Columns({ control, errors })}
      data={speculationList}
      state={{
        isLoading: loading,
      }}
      canCreate={canCreate}
      enableRowActions
      createDisplayMode="modal"
      editDisplayMode="modal"
      onCreatingRowSave={async ({ exitCreatingMode }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload: Partial<SpeculationItem> = {
            nom: values.nom?.trim() ?? "",
            type: values.type,
          };
          await createSpeculation(payload);
          refreshList();
          reset(DEFAULT_VALUES);
          exitCreatingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de créer la spéculation");
        }
      }}
      onEditingRowSave={async ({ exitEditingMode, row }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload: Partial<SpeculationItem> = {
            nom: values.nom?.trim() ?? "",
            type: values.type,
          };
          await updateSpeculation({ id: row.original.id, speculation: payload });
          refreshList();
          reset(DEFAULT_VALUES);
          exitEditingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de mettre à jour la spéculation");
        }
      }}
      onCreatingRowCancel={({ table }) => {
        reset(DEFAULT_VALUES);
        table.setCreatingRow(null);
      }}
      onEditingRowCancel={({ table }) => {
        reset(DEFAULT_VALUES);
        table.setEditingRow(null);
      }}
      renderRowActions={({ row, table }) => {
        if (!canUpdate && !canDelete) return null;
        return (
          <ActionContainer>
            {canUpdate && (
              <IconButton
                color="warning"
                onClick={() => {
                  reset({
                    nom: row.original.nom,
                    type: row.original.type,
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
          </ActionContainer>
        );
      }}
    />
  );
}

const ActionContainer = styled(Stack)(() => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 1,
}));
