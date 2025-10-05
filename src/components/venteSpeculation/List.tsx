"use client";

import MaterialTable from "@/components/table/MaterialTable";
import { canActivate } from "@/lib/canActivate";
import speculationStore from "@/store/speculation";
import venteSpeculationStore from "@/store/venteSpeculation";
import { yupResolver } from "@hookform/resolvers/yup";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { IconButton, Stack, styled } from "@mui/material";
import { MRT_RowSelectionState } from "material-react-table";
import { useConfirm } from "material-ui-confirm";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

import AddSpeculationDialog from "./AddSpeculationDialog";
import EditSpeculationDialog from "./EditSpeculationDialog";
import Columns from "./table/columns";

const venteSpeculationSchema = Yup.object({
  id_speculation: Yup.number()
    .typeError("Spéculation requise")
    .min(1, "Spéculation requise")
    .required("Spéculation requise"),
  quantite: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? null : value
    )
    .required("Quantité requise")
    .min(0, "Quantité invalide")
    .typeError("Quantité invalide"),
});

export default function ListVenteSpeculation({
  selectedCommercialisation,
}: {
  selectedCommercialisation: number | null;
}) {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editSpeculationId, setEditSpeculationId] = useState<number | null>(
    null
  );
  const fieldOnChangeRef = useRef<((value: number) => void) | null>(null);

  const {
    venteSpeculationList,
    getVenteSpeculations,
    updateVenteSpeculation,
    deleteVenteSpeculation,
    createVenteSpeculation,
    loading,
    clearList,
  } = venteSpeculationStore();

  const { getSpeculations } = speculationStore();

  const {
    control,
    trigger,
    getValues,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(venteSpeculationSchema),
    mode: "onChange",
    defaultValues: {
      id_speculation: 0,
      quantite: 0,
    },
  });

  const confirm = useConfirm();

  const refreshList = useCallback(() => {
    if (selectedCommercialisation === null) {
      clearList();
      setRowSelection({});
      return;
    }

    const args: Record<string, unknown> = {
      include: {
        Speculation: true,
      },
      where: {
        id_commercialisation: selectedCommercialisation,
      },
    };

    getVenteSpeculations(args).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(
        message ?? "Impossible de récupérer les spéculations vendues"
      );
    });
  }, [
    clearList,
    selectedCommercialisation,
    getVenteSpeculations,
    setRowSelection,
  ]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  useEffect(() => {
    getSpeculations({
      orderBy: {
        nom: "asc",
      },
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de récupérer les spéculations");
    });
  }, [getSpeculations]);

  const canUpdate = canActivate("VenteSpeculation", "U");
  const canDelete = canActivate("VenteSpeculation", "D");

  const handleDelete = async (id: number) => {
    const isOk = await confirm({
      title: "Supprimer",
      description:
        "Voulez-vous vraiment supprimer cette vente de spéculation ?",
      confirmationText: "Oui",
      cancellationText: "Annuler",
    });
    if (!isOk.confirmed) return;
    try {
      await deleteVenteSpeculation(id);
      refreshList();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de supprimer la vente de spéculation");
    }
  };

  return (
    <>
      <MaterialTable
        columns={Columns({
          control,
          errors,
          onOpenAddDialog: () => setOpenAddDialog(true),
          onOpenEditDialog: (speculationId) =>
            setEditSpeculationId(speculationId),
          onFieldChange: (onChange) => {
            fieldOnChangeRef.current = onChange;
          },
        })}
        getRowId={(originalRow) => originalRow.id}
        data={venteSpeculationList}
        title="Spéculations vendues"
        enableRowSelection={false}
        onRowSelectionChange={setRowSelection}
        state={{
          isLoading: loading,
          rowSelection,
          columnPinning: { left: ["id_speculation", "quantite"] },
        }}
        onEditingRowSave={async ({ exitEditingMode, row }) => {
          try {
            const isValid = await trigger();
            if (!isValid) return;
            const values = getValues();
            const payload = {
              quantite: Number(values.quantite),
              id_speculation: Number(values.id_speculation),
            };
            await updateVenteSpeculation({
              id: row.original.id,
              venteSpeculation: payload,
            });
            refreshList();
            reset({
              id_speculation: 0,
              quantite: 0,
            });
            exitEditingMode();
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : undefined;
            toast.error(
              message ?? "Impossible de mettre à jour la vente de spéculation"
            );
          }
        }}
        onCreatingRowSave={async ({ exitCreatingMode }) => {
          try {
            const isValid = await trigger();
            if (!isValid) return;
            const values = getValues();

            if (selectedCommercialisation === null) {
              toast.error("Veuillez sélectionner une commercialisation");
              return;
            }

            const payload = {
              quantite: Number(values.quantite),
              id_speculation: Number(values.id_speculation),
              id_commercialisation: selectedCommercialisation,
            };
            await createVenteSpeculation(payload);
            refreshList();
            reset({
              id_speculation: 0,
              quantite: 0,
            });
            exitCreatingMode();
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : undefined;
            toast.error(
              message ?? "Impossible de créer la vente de spéculation"
            );
          }
        }}
        onCreatingRowCancel={({ table }) => {
          reset({
            id_speculation: 0,
            quantite: 0,
          });
          table.setCreatingRow(null);
        }}
        onEditingRowCancel={({ table }) => {
          reset({
            id_speculation: 0,
            quantite: 0,
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
                    id_speculation: row.original.id_speculation,
                    quantite: row.original.quantite,
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
      <AddSpeculationDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSpeculationAdded={(speculationId) => {
          if (fieldOnChangeRef.current) {
            fieldOnChangeRef.current(speculationId);
          }
        }}
      />
      <EditSpeculationDialog
        open={editSpeculationId !== null}
        onClose={() => setEditSpeculationId(null)}
        speculationId={editSpeculationId}
        onSpeculationUpdated={() => {
          // Refresh speculations list is already handled in the dialog
        }}
      />
    </>
  );
}

const BtnContainer = styled(Stack)(() => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 1,
}));
