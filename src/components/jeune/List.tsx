"use client";

import MaterialTable from "@/components/table/MaterialTable";
import { canActivate } from "@/lib/canActivate";
import jeuneStore from "@/store/jeune";
import { JeuneItem } from "@/store/jeune/type";
import producteurStore from "@/store/producteur";
import speculationStore from "@/store/speculation";
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

import Columns from "./table/columns";

const jeuneSchema = Yup.object({
  date: Yup.string().required("Date requise"),
  id_producteur: Yup.number()
    .typeError("Producteur requis")
    .min(1, "Producteur requis")
    .required("Producteur requis"),
  id_parrain: Yup.number().nullable().optional(),
  titre_projet: Yup.string().required("Titre du projet requis"),
  montant_apport: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? null : value
    )
    .required()
    .min(0, "Montant invalide")
    .typeError("Montant invalide"),
  montant_subvention: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? null : value
    )
    .required()
    .min(0, "Montant invalide")
    .typeError("Montant invalide"),
  id_speculation: Yup.number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? null : value
    )
    .typeError("Spéculation invalide")
    .min(1, "Spéculation invalide")
    .required("Spéculation invalide"),
});

export default function ListJeune({
  setSelected,
  selected,
}: {
  setSelected: (item: JeuneItem | null) => void;
  selected: JeuneItem | null;
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
    jeuneList,
    getJeunes,
    updateJeune,
    deleteJeune,
    createJeune,
    loading,
    clearList,
  } = jeuneStore();

  const { getProducteurs } = producteurStore();
  const { getSpeculations } = speculationStore();

  const {
    control,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(jeuneSchema),
    mode: "onChange",
    defaultValues: {
      date: new Date().toISOString().substring(0, 10),
      id_producteur: 0,
      titre_projet: "",
      montant_apport: 0,
      montant_subvention: 0,
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
        Producteur: true,
        Parrain: true,
        Speculation: true,
      },
      orderBy: {
        date: "desc",
      },
      where: {
        Producteur: {
          OPB: {
            id_opr: filterOprId,
          },
        },
      },
    };

    getJeunes(args).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de récupérer les jeunes");
    });
  }, [clearList, filterOprId, getJeunes, setRowSelection]);

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

  useEffect(() => {
    const where: Record<string, unknown> = {
      actif: true,
    };
    if (filterOprId !== undefined) {
      where.OPB = {
        id_opr: filterOprId,
      };
    }
    getProducteurs({
      where,
      include: {
        OPB: true,
      },
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de récupérer les producteurs");
    });
  }, [filterOprId, getProducteurs]);

  const canUpdate = canActivate("Jeune", "U");
  const canDelete = canActivate("Jeune", "D");

  const handleDelete = async (id: number) => {
    const isOk = await confirm({
      title: "Supprimer",
      description: "Voulez-vous vraiment supprimer ce jeune ?",
      confirmationText: "Oui",
      cancellationText: "Annuler",
    });
    if (!isOk.confirmed) return;
    try {
      await deleteJeune(id);
      if (id === selected?.id) {
        setRowSelection({});
      }
      refreshList();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de supprimer le jeune");
    }
  };

  useEffect(() => {
    const selectedIds = Object.keys(rowSelection).map((key) => Number(key));
    if (selectedIds.length === 0) {
      setSelected(null);
      return;
    }
    const selectedId = selectedIds[0];
    const found = jeuneList.find((item) => item.id === selectedId);
    if (!found) {
      setSelected(null);
      return;
    }
    setSelected(found);
  }, [rowSelection, jeuneList, setSelected]);

  return (
    <MaterialTable
      columns={Columns({ control, errors })}
      getRowId={(originalRow) => originalRow.id}
      data={jeuneList}
      title="Jeunes installés"
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
        columnPinning: { left: ["mrt-row-select", "date", "id_producteur"] },
      }}
      onEditingRowSave={async ({ exitEditingMode, row }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload = {
            date: new Date(values.date).toISOString(),
            id_producteur: Number(values.id_producteur),
            id_parrain:
              values.id_parrain === null || values.id_parrain === undefined
                ? null
                : Number(values.id_parrain),
            titre_projet:
              values.titre_projet?.trim().length === 0
                ? null
                : values.titre_projet?.trim(),
            montant_apport:
              values.montant_apport === null ||
              values.montant_apport === undefined
                ? null
                : Number(values.montant_apport),
            montant_subvention:
              values.montant_subvention === null ||
              values.montant_subvention === undefined
                ? null
                : Number(values.montant_subvention),
            id_speculation:
              values.id_speculation === null ||
              values.id_speculation === undefined
                ? null
                : Number(values.id_speculation),
          };
          await updateJeune({
            id: row.original.id,
            jeune: payload,
          });
          refreshList();
          reset({
            date: new Date().toISOString().substring(0, 10),
            id_producteur: 0,
            id_parrain: null,
            titre_projet: "",
            montant_apport: 0,
            montant_subvention: 0,
          });
          exitEditingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de mettre à jour le jeune");
        }
      }}
      onCreatingRowSave={async ({ exitCreatingMode }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload = {
            date: new Date(values.date).toISOString(),
            id_producteur: Number(values.id_producteur),
            id_parrain:
              values.id_parrain === null || values.id_parrain === undefined
                ? null
                : Number(values.id_parrain),
            titre_projet:
              values.titre_projet?.trim().length === 0
                ? null
                : values.titre_projet?.trim(),
            montant_apport:
              values.montant_apport === null ||
              values.montant_apport === undefined
                ? null
                : Number(values.montant_apport),
            montant_subvention:
              values.montant_subvention === null ||
              values.montant_subvention === undefined
                ? null
                : Number(values.montant_subvention),
            id_speculation:
              values.id_speculation === null ||
              values.id_speculation === undefined
                ? null
                : Number(values.id_speculation),
          };
          await createJeune(payload);
          refreshList();
          reset({
            date: new Date().toISOString().substring(0, 10),
            id_producteur: 0,
            id_parrain: null,
            titre_projet: "",
            montant_apport: 0,
            montant_subvention: 0,
          });
          exitCreatingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de créer le jeune");
        }
      }}
      onCreatingRowCancel={({ table }) => {
        reset({
          date: new Date().toISOString().substring(0, 10),
          id_producteur: 0,
          id_parrain: null,
          titre_projet: "",
          montant_apport: 0,
          montant_subvention: 0,
        });
        table.setCreatingRow(null);
      }}
      onEditingRowCancel={({ table }) => {
        reset({
          date: new Date().toISOString().substring(0, 10),
          id_producteur: 0,
          id_parrain: null,
          titre_projet: "",
          montant_apport: 0,
          montant_subvention: 0,
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
                  id_producteur: row.original.id_producteur,
                  id_parrain: row.original.id_parrain ?? null,
                  titre_projet: row.original.titre_projet ?? "",
                  montant_apport: row.original.montant_apport ?? null,
                  montant_subvention: row.original.montant_subvention ?? null,
                  id_speculation: row.original.id_speculation ?? null,
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
