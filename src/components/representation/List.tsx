"use client";
import { canActivate } from "@/lib/canActivate";
import representationStore from "@/store/representation";
import { RepresentationItem } from "@/store/representation/type";
import { yupResolver } from "@hookform/resolvers/yup";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { IconButton, Stack, styled } from "@mui/material";
import { MRT_RowSelectionState } from "material-react-table";
import { useConfirm } from "material-ui-confirm";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";
import MaterialTable from "../table/MaterialTable";
import Columns from "./table/columns";

const representationSchema = Yup.object({
  date: Yup.string().required("Date requise"),
  duree: Yup.number().nullable().min(0, "Durée invalide"),
  theme: Yup.string().required("Thème requis"),
  problematique: Yup.string().nullable(),
  positionnement: Yup.string().nullable(),
  resultat: Yup.string().nullable(),
  suite_a_donner: Yup.string().nullable(),
  id_opr: Yup.number().required("OPR requis"),
});

export default function ListRepresentation({
  setSelected,
  selected,
}: {
  setSelected: (item: RepresentationItem | null) => void;
  selected: RepresentationItem | null;
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
    representationList,
    getRepresentations,
    updateRepresentation,
    deleteRepresentation,
    createRepresentation,
    clearList,
    loading,
  } = representationStore();

  const {
    control,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(representationSchema),
    mode: "onChange",
    defaultValues: {
      date: new Date().toISOString().substring(0, 10),
      duree: 0,
      theme: "",
      problematique: "",
      positionnement: "",
      resultat: "",
      suite_a_donner: "",
      id_opr: filterOprId ?? 0,
    },
  });

  useEffect(() => {
    reset({
      date: new Date().toISOString().substring(0, 10),
      duree: 0,
      theme: "",
      problematique: "",
      positionnement: "",
      resultat: "",
      suite_a_donner: "",
      id_opr: filterOprId ?? 0,
    });
  }, [filterOprId, reset]);

  const confirm = useConfirm();

  const refreshList = useCallback(() => {
    if (filterOprId === undefined) {
      // Ne pas charger les données si aucun OPR n'est sélectionné
      return;
    }

    const args: Record<string, unknown> = {
      include: {
        RepresentationProd: {
          include: {
            Producteur: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      where: { id_opr: filterOprId },
    };

    getRepresentations(args).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de récupérer les représentations");
    });
  }, [filterOprId, getRepresentations]);

  useEffect(() => {
    if (filterOprId === undefined) {
      clearList();
    } else {
      refreshList();
    }
  }, [filterOprId, refreshList, clearList]);

  const canUpdate = canActivate("Membre", "U");
  const canDelete = canActivate("Membre", "D");

  const handleDelete = async (id: number) => {
    const isOk = await confirm({
      title: "Supprimer",
      description: "Voulez-vous vraiment supprimer cette représentation ?",
      confirmationText: "Oui",
      cancellationText: "Annuler",
    });
    if (!isOk.confirmed) return;
    try {
      await deleteRepresentation(id);
      if (id === selected?.id) {
        setRowSelection({});
      }
      refreshList();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de supprimer la représentation");
    }
  };

  useEffect(() => {
    const selectedIds = Object.keys(rowSelection).map((key) => Number(key));
    if (selectedIds.length === 0) {
      setSelected(null);
      return;
    }
    const selectedId = selectedIds[0];
    const selected = representationList.find((item) => item.id === selectedId);
    if (!selected) {
      setSelected(null);
      return;
    }
    setSelected(selected);
  }, [rowSelection]);

  return (
    <MaterialTable
      columns={Columns({ control, errors })}
      getRowId={(originalRow) => originalRow.id}
      data={representationList}
      title="Représentations"
      enableRowSelection={true}
      enableBatchRowSelection={true}
      createDisplayMode={"row"}
      enableRowActions={filterOprId !== undefined}
      positionToolbarAlertBanner="bottom"
      renderTopToolbarCustomActions={({ table }) =>
        filterOprId === undefined ? (
          <Stack sx={{ p: 2, bgcolor: "warning.light", borderRadius: 1 }}>
            Veuillez sélectionner un OPR pour créer une représentation
          </Stack>
        ) : null
      }
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
        columnPinning: { left: ["mrt-row-select", "date", "theme"] },
      }}
      onEditingRowSave={async ({ exitEditingMode, row }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload = {
            ...values,
            date: new Date(values.date).toISOString(),
            duree: values.duree === null ? null : Number(values.duree),
            id_opr: Number(values.id_opr),
          };
          await updateRepresentation({
            id: row.original.id,
            representation: payload,
          });
          refreshList();
          reset();
          exitEditingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(
            message ?? "Impossible de mettre à jour la représentation"
          );
        }
      }}
      onCreatingRowSave={async ({ exitCreatingMode }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload = {
            ...values,
            date: new Date(values.date).toISOString(),
            duree: values.duree === null ? null : Number(values.duree),
            id_opr: Number(values.id_opr),
          };
          await createRepresentation(payload);
          refreshList();
          reset();
          exitCreatingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de créer la représentation");
        }
      }}
      onCreatingRowCancel={({ table }) => {
        reset({
          date: new Date().toISOString().substring(0, 10),
          duree: 0,
          theme: "",
          problematique: "",
          positionnement: "",
          resultat: "",
          suite_a_donner: "",
          id_opr: filterOprId ?? 0,
        });
        table.setCreatingRow(null);
      }}
      onEditingRowCancel={({ table }) => {
        reset({
          date: new Date().toISOString().substring(0, 10),
          duree: 0,
          theme: "",
          problematique: "",
          positionnement: "",
          resultat: "",
          suite_a_donner: "",
          id_opr: filterOprId ?? 0,
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
                  duree: row.original.duree,
                  theme: row.original.theme,
                  problematique: row.original.problematique ?? "",
                  positionnement: row.original.positionnement ?? "",
                  resultat: row.original.resultat ?? "",
                  suite_a_donner: row.original.suite_a_donner ?? "",
                  id_opr: row.original.id_opr,
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
