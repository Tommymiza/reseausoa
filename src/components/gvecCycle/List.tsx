"use client";

import MaterialTable from "@/components/table/MaterialTable";
import { canActivate } from "@/lib/canActivate";
import { GVECItem } from "@/store/gvec/type";
import gvecCycleStore from "@/store/gvecCycle";
import { GVECCycleItem } from "@/store/gvecCycle/type";
import { yupResolver } from "@hookform/resolvers/yup";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { IconButton, Stack, styled } from "@mui/material";
import { MRT_RowSelectionState } from "material-react-table";
import { useConfirm } from "material-ui-confirm";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

import Columns from "./table/columns";

const gvecCycleSchema = Yup.object({
  numero: Yup.number()
    .typeError("Numéro requis")
    .min(1, "Numéro doit être supérieur à 0")
    .required("Numéro requis"),
  date_debut: Yup.string().required("Date début requise"),
  date_fin: Yup.string().required("Date fin requise"),
  montant_part: Yup.number()
    .min(0, "Montant doit être positif")
    .required("Montant part requis"),
  montant_cotisation: Yup.number()
    .min(0, "Montant doit être positif")
    .required("Montant cotisation requis"),
});

export default function ListGVECCycle({
  selectedGVEC,
  setSelected,
  selected,
}: {
  selectedGVEC: GVECItem | null;
  setSelected: (item: GVECCycleItem | null) => void;
  selected: GVECCycleItem | null;
}) {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const {
    gvecCycleList,
    getGVECCycles,
    updateGVECCycle,
    deleteGVECCycle,
    createGVECCycle,
    loading,
    clearList,
  } = gvecCycleStore();

  const {
    control,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(gvecCycleSchema),
    mode: "onChange",
    defaultValues: {
      numero: 0,
      date_debut: new Date().toISOString().substring(0, 10),
      date_fin: new Date().toISOString().substring(0, 10),
      montant_part: 0,
      montant_cotisation: 0,
    },
  });

  const confirm = useConfirm();

  const refreshList = useCallback(() => {
    if (!selectedGVEC) {
      clearList();
      return;
    }

    getGVECCycles({
      where: {
        id_gvec: selectedGVEC.id,
      },
      orderBy: {
        numero: "desc",
      },
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de récupérer les cycles GVEC");
    });
  }, [getGVECCycles, clearList, selectedGVEC]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const canUpdate = canActivate("GVEC_CYCLE", "U");
  const canDelete = canActivate("GVEC_CYCLE", "D");

  const handleDelete = async (id: number) => {
    const isOk = await confirm({
      title: "Supprimer",
      description: "Voulez-vous vraiment supprimer ce cycle GVEC ?",
      confirmationText: "Oui",
      cancellationText: "Annuler",
    });
    if (!isOk.confirmed) return;
    try {
      await deleteGVECCycle(id);
      if (id === selected?.id) {
        setRowSelection({});
      }
      refreshList();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de supprimer le cycle GVEC");
    }
  };

  useEffect(() => {
    const selectedIds = Object.keys(rowSelection).map((key) => Number(key));
    if (selectedIds.length === 0) {
      setSelected(null);
      return;
    }
    const selectedId = selectedIds[0];
    const found = gvecCycleList.find((item) => item.id === selectedId);
    if (!found) {
      setSelected(null);
      return;
    }
    setSelected(found);
  }, [rowSelection, gvecCycleList, setSelected]);

  if (!selectedGVEC) {
    return null;
  }

  return (
    <MaterialTable
      columns={Columns({ control, errors })}
      getRowId={(originalRow) => originalRow.id}
      data={gvecCycleList}
      title={`Cycles GVEC - ${selectedGVEC.nom}`}
      enableRowSelection
      enableBatchRowSelection
      onRowSelectionChange={(updater) => {
        if (typeof updater !== "function") return;
        const newSelection = updater(rowSelection);
        const lastSelectedIds = Object.keys(rowSelection);
        const selectedIds = Object.keys(newSelection).filter(
          (id) => !lastSelectedIds.includes(id)
        );
        if (selectedIds.length > 0) {
          const newSelectedId = selectedIds[selectedIds.length - 1];
          setRowSelection({ [newSelectedId]: true });
        } else {
          setRowSelection({});
        }
      }}
      state={{
        isLoading: loading,
        rowSelection,
        columnPinning: { left: ["mrt-row-select", "numero", "date_debut"] },
      }}
      onEditingRowSave={async ({ exitEditingMode, row }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload = {
            numero: Number(values.numero),
            date_debut: new Date(values.date_debut).toISOString(),
            date_fin: new Date(values.date_fin).toISOString(),
            montant_part: Number(values.montant_part),
            montant_cotisation: Number(values.montant_cotisation),
          };
          await updateGVECCycle({
            id: row.original.id,
            gvecCycle: payload,
          });
          refreshList();
          reset({
            numero: 0,
            date_debut: new Date().toISOString().substring(0, 10),
            date_fin: new Date().toISOString().substring(0, 10),
            montant_part: 0,
            montant_cotisation: 0,
          });
          exitEditingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de mettre à jour le cycle GVEC");
        }
      }}
      onCreatingRowSave={async ({ exitCreatingMode }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload = {
            numero: Number(values.numero),
            date_debut: new Date(values.date_debut).toISOString(),
            date_fin: new Date(values.date_fin).toISOString(),
            montant_part: Number(values.montant_part),
            montant_cotisation: Number(values.montant_cotisation),
            id_gvec: selectedGVEC.id,
          };
          await createGVECCycle(payload);
          refreshList();
          reset({
            numero: 0,
            date_debut: new Date().toISOString().substring(0, 10),
            date_fin: new Date().toISOString().substring(0, 10),
            montant_part: 0,
            montant_cotisation: 0,
          });
          exitCreatingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de créer le cycle GVEC");
        }
      }}
      onCreatingRowCancel={({ table }) => {
        reset({
          numero: 0,
          date_debut: new Date().toISOString().substring(0, 10),
          date_fin: new Date().toISOString().substring(0, 10),
          montant_part: 0,
          montant_cotisation: 0,
        });
        table.setCreatingRow(null);
      }}
      onEditingRowCancel={({ table }) => {
        reset({
          numero: 0,
          date_debut: new Date().toISOString().substring(0, 10),
          date_fin: new Date().toISOString().substring(0, 10),
          montant_part: 0,
          montant_cotisation: 0,
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
                  numero: row.original.numero,
                  date_debut: row.original.date_debut,
                  date_fin: row.original.date_fin,
                  montant_part: row.original.montant_part,
                  montant_cotisation: row.original.montant_cotisation,
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
