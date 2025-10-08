"use client";

import MaterialTable from "@/components/table/MaterialTable";
import { canActivate } from "@/lib/canActivate";
import commercialisationStore from "@/store/commercialisation";
import { CommercialisationItem } from "@/store/commercialisation/type";
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

const commercialisationSchema = Yup.object({
  date: Yup.string().required("Date requise"),
  partenaire: Yup.string().required("Partenaire requis"),
});

export default function ListCommercialisation({
  setSelected,
  selected,
}: {
  setSelected: (item: CommercialisationItem | null) => void;
  selected: CommercialisationItem | null;
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
    commercialisationList,
    getCommercialisations,
    updateCommercialisation,
    deleteCommercialisation,
    createCommercialisation,
    loading,
    clearList,
  } = commercialisationStore();

  const {
    control,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(commercialisationSchema),
    mode: "onChange",
    defaultValues: {
      date: new Date().toISOString().substring(0, 10),
      partenaire: "",
    },
  });

  const confirm = useConfirm();

  const refreshList = useCallback(() => {
    if (filterOprId === undefined) {
      clearList();
      setRowSelection({});
      return;
    }

    const args: Record<string, unknown> = {
      include: {
        OPR: true,
      },
      orderBy: {
        date: "desc",
      },
      where: {
        id_opr: filterOprId,
      },
    };

    getCommercialisations(args).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de récupérer les commercialisations");
    });
  }, [clearList, filterOprId, getCommercialisations, setRowSelection]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const canUpdate = canActivate("Commercialisation", "U");
  const canDelete = canActivate("Commercialisation", "D");

  const handleDelete = async (id: number) => {
    const isOk = await confirm({
      title: "Supprimer",
      description: "Voulez-vous vraiment supprimer cette commercialisation ?",
      confirmationText: "Oui",
      cancellationText: "Annuler",
    });
    if (!isOk.confirmed) return;
    try {
      await deleteCommercialisation(id);
      if (id === selected?.id) {
        setRowSelection({});
      }
      refreshList();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de supprimer la commercialisation");
    }
  };

  useEffect(() => {
    const selectedIds = Object.keys(rowSelection).map((key) => Number(key));
    if (selectedIds.length === 0) {
      setSelected(null);
      return;
    }
    const selectedId = selectedIds[0];
    const found = commercialisationList.find((item) => item.id === selectedId);
    if (!found) {
      setSelected(null);
      return;
    }
    setSelected(found);
  }, [rowSelection, commercialisationList, setSelected]);

  if (filterOprId === undefined) {
    return (
      <MaterialTable
        columns={Columns({ control, errors, showOprColumn: false })}
        getRowId={(originalRow) => originalRow.id}
        data={[]}
        title="Commercialisations"
        state={{ isLoading: false }}
        renderEmptyRowsFallback={() => (
          <Stack p={4} alignItems="center">
            <Typography variant="h6" color="text.secondary">
              Veuillez sélectionner une OPR pour voir et gérer les
              commercialisations
            </Typography>
          </Stack>
        )}
      />
    );
  }

  return (
    <MaterialTable
      columns={Columns({ control, errors, showOprColumn: false })}
      getRowId={(originalRow) => originalRow.id}
      data={commercialisationList}
      title="Commercialisations"
      enableRowSelection
      enableBatchRowSelection
      enableRowActions={filterOprId !== undefined}
      createDisplayMode={filterOprId !== undefined ? "row" : undefined}
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
        columnPinning: { left: ["mrt-row-select", "date", "partenaire"] },
      }}
      onEditingRowSave={async ({ exitEditingMode, row }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload = {
            date: new Date(values.date).toISOString(),
            partenaire: values.partenaire?.trim(),
          };
          await updateCommercialisation({
            id: row.original.id,
            commercialisation: payload,
          });
          refreshList();
          reset({
            date: new Date().toISOString().substring(0, 10),
            partenaire: "",
          });
          exitEditingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(
            message ?? "Impossible de mettre à jour la commercialisation"
          );
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
            date: new Date(values.date).toISOString(),
            partenaire: values.partenaire?.trim(),
            id_opr: filterOprId,
          };
          await createCommercialisation(payload);
          refreshList();
          reset({
            date: new Date().toISOString().substring(0, 10),
            partenaire: "",
          });
          exitCreatingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de créer la commercialisation");
        }
      }}
      onCreatingRowCancel={({ table }) => {
        reset({
          date: new Date().toISOString().substring(0, 10),
          partenaire: "",
        });
        table.setCreatingRow(null);
      }}
      onEditingRowCancel={({ table }) => {
        reset({
          date: new Date().toISOString().substring(0, 10),
          partenaire: "",
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
                  partenaire: row.original.partenaire,
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
