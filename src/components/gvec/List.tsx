"use client";

import MaterialTable from "@/components/table/MaterialTable";
import { canActivate } from "@/lib/canActivate";
import gvecStore from "@/store/gvec";
import { GVECItem } from "@/store/gvec/type";
import { yupResolver } from "@hookform/resolvers/yup";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { IconButton, Stack, styled, Typography } from "@mui/material";
import { MRT_RowSelectionState } from "material-react-table";
import { useConfirm } from "material-ui-confirm";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

import Columns from "./table/columns";

const gvecSchema = Yup.object({
  nom: Yup.string().required("Nom requis"),
  date: Yup.string().required("Date requise"),
  id_localisation: Yup.number()
    .typeError("Localisation requise")
    .min(1, "Localisation requise")
    .required("Localisation requise"),
});

export default function ListGVEC({
  setSelected,
  selected,
}: {
  setSelected: (item: GVECItem | null) => void;
  selected: GVECItem | null;
}) {
  const searchParams = useSearchParams();
  const filterOpr = searchParams.get("id_opr");
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const filterOprId = useMemo(() => {
    if (!filterOpr) return undefined;
    const parsed = Number(filterOpr);
    return Number.isNaN(parsed) ? undefined : parsed;
  }, [filterOpr]);

  const {
    gvecList,
    getGVECs,
    updateGVEC,
    deleteGVEC,
    createGVEC,
    loading,
    clearList,
  } = gvecStore();

  const {
    control,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(gvecSchema),
    mode: "onChange",
    defaultValues: {
      nom: "",
      date: new Date().toISOString().substring(0, 10),
      id_localisation: 0,
    },
  });

  const confirm = useConfirm();

  const refreshList = useCallback(() => {
    if (filterOprId === undefined) {
      clearList();
      setRowSelection({});
      return;
    }

    getGVECs({
      include: {
        Localisation: true,
      },
      orderBy: {
        date: "desc",
      },
      where: {
        id_opr: filterOprId,
      },
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de récupérer les GVEC");
    });
  }, [clearList, filterOprId, getGVECs]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const canUpdate = canActivate("GVEC", "U");
  const canDelete = canActivate("GVEC", "D");

  const handleDelete = async (id: number) => {
    const isOk = await confirm({
      title: "Supprimer",
      description: "Voulez-vous vraiment supprimer ce GVEC ?",
      confirmationText: "Oui",
      cancellationText: "Annuler",
    });
    if (!isOk.confirmed) return;
    try {
      await deleteGVEC(id);
      if (id === selected?.id) {
        setRowSelection({});
      }
      refreshList();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de supprimer le GVEC");
    }
  };

  useEffect(() => {
    const selectedIds = Object.keys(rowSelection).map((key) => Number(key));
    if (selectedIds.length === 0) {
      setSelected(null);
      return;
    }
    const selectedId = selectedIds[0];
    const found = gvecList.find((item) => item.id === selectedId);
    if (!found) {
      setSelected(null);
      return;
    }
    setSelected(found);
  }, [rowSelection, gvecList, setSelected]);

  if (filterOprId === undefined) {
    return (
      <MaterialTable
        columns={Columns({ control, errors })}
        getRowId={(originalRow) => originalRow.id}
        data={[]}
        title="GVEC"
        state={{ isLoading: false }}
        renderEmptyRowsFallback={() => (
          <Stack p={4} alignItems="center">
            <Typography variant="h6" color="text.secondary">
              Veuillez sélectionner une OPR pour voir et gérer les GVEC
            </Typography>
          </Stack>
        )}
      />
    );
  }

  return (
    <MaterialTable
      columns={Columns({ control, errors })}
      getRowId={(originalRow) => originalRow.id}
      data={gvecList}
      title="GVEC"
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
        columnPinning: { left: ["mrt-row-select", "nom", "date"] },
      }}
      onEditingRowSave={async ({ exitEditingMode, row }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload = {
            nom: values.nom?.trim(),
            date: new Date(values.date).toISOString(),
            id_localisation: Number(values.id_localisation),
          };
          await updateGVEC({
            id: row.original.id,
            gvec: payload,
          });
          refreshList();
          reset({
            nom: "",
            date: new Date().toISOString().substring(0, 10),
            id_localisation: 0,
          });
          exitEditingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de mettre à jour le GVEC");
        }
      }}
      onCreatingRowSave={async ({ exitCreatingMode }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          if (filterOprId === undefined) {
            toast.error("Veuillez sélectionner une OPR");
            return;
          }
          const payload = {
            nom: values.nom?.trim(),
            date: new Date(values.date).toISOString(),
            id_localisation: Number(values.id_localisation),
            id_opr: filterOprId,
          };
          await createGVEC(payload);
          refreshList();
          reset({
            nom: "",
            date: new Date().toISOString().substring(0, 10),
            id_localisation: 0,
          });
          exitCreatingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de créer le GVEC");
        }
      }}
      onCreatingRowCancel={({ table }) => {
        reset({
          nom: "",
          date: new Date().toISOString().substring(0, 10),
          id_localisation: 0,
        });
        table.setCreatingRow(null);
      }}
      onEditingRowCancel={({ table }) => {
        reset({
          nom: "",
          date: new Date().toISOString().substring(0, 10),
          id_localisation: 0,
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
                  nom: row.original.nom,
                  date: row.original.date,
                  id_localisation: row.original.id_localisation,
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
