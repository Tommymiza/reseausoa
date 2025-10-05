"use client";
import { canActivate } from "@/lib/canActivate";
import accompagnementStore from "@/store/accompagnement";
import { AccompagnementItem } from "@/store/accompagnement/type";
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

const accompagnementSchema = Yup.object({
  date: Yup.string().required("Date requise"),
  duree: Yup.number().nullable().min(0, "Durée invalide"),
  theme: Yup.string().required("Thème requis"),
  existant: Yup.string().nullable(),
  problematique: Yup.string().nullable(),
  solution: Yup.string().nullable(),
  remarque: Yup.string().nullable(),
  activite_de_masse: Yup.boolean(),
  nb_hommes: Yup.number().nullable().min(0, "Nombre invalide"),
  nb_femmes: Yup.number().nullable().min(0, "Nombre invalide"),
  nb_jeunes: Yup.number().nullable().min(0, "Nombre invalide"),
  type: Yup.string()
    .oneOf(
      [
        "ACCOMPAGNEMENT_SUIVI",
        "VISITE_ECHANGE",
        "FORMATION",
        "ANIMATION_SENSIBILISATION",
      ],
      "Type invalide"
    )
    .required("Type requis"),
  id_category_theme: Yup.number().required("Catégorie requise"),
  id_opr: Yup.number().required("OPR requis"),
});

export default function ListAccompagnement({
  setSelected,
  selected,
}: {
  setSelected: (item: AccompagnementItem | null) => void;
  selected: AccompagnementItem | null;
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
    accompagnementList,
    getAccompagnements,
    updateAccompagnement,
    deleteAccompagnement,
    createAccompagnement,
    loading,
  } = accompagnementStore();

  const {
    control,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(accompagnementSchema),
    mode: "onChange",
    defaultValues: {
      date: new Date().toISOString().substring(0, 10),
      duree: 0,
      theme: "",
      existant: "",
      problematique: "",
      solution: "",
      remarque: "",
      activite_de_masse: false,
      nb_hommes: null,
      nb_femmes: null,
      nb_jeunes: null,
      type: "ACCOMPAGNEMENT_SUIVI",
      id_category_theme: 0,
      id_opr: filterOprId ?? 0,
    },
  });
  useEffect(() => {}, []);

  const confirm = useConfirm();

  const refreshList = useCallback(() => {
    const args: Record<string, unknown> = {
      include: {
        CategoryThemeAccompagnement: true,
        AccompagnementProd: {
          include: {
            Producteur: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    };

    if (filterOprId !== undefined) {
      args.where = { id_opr: filterOprId };
    }

    getAccompagnements(args).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de récupérer les accompagnements");
    });
  }, [filterOprId, getAccompagnements]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const canUpdate = canActivate("Membre", "U");
  const canDelete = canActivate("Membre", "D");

  const handleDelete = async (id: number) => {
    const isOk = await confirm({
      title: "Supprimer",
      description: "Voulez-vous vraiment supprimer cet accompagnement ?",
      confirmationText: "Oui",
      cancellationText: "Annuler",
    });
    if (!isOk.confirmed) return;
    try {
      await deleteAccompagnement(id);
      if (id === selected?.id) {
        setRowSelection({});
      }
      refreshList();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de supprimer l'accompagnement");
    }
  };

  useEffect(() => {
    const selectedIds = Object.keys(rowSelection).map((key) => Number(key));
    if (selectedIds.length === 0) {
      setSelected(null);
      return;
    }
    const selectedId = selectedIds[0];
    const selected = accompagnementList.find((item) => item.id === selectedId);
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
      data={accompagnementList}
      title="Liste accompagnements"
      enableRowSelection={true}
      enableBatchRowSelection={true}
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
        columnPinning: { left: ["mrt-row-select", "date", "type"] },
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
            nb_hommes:
              values.nb_hommes === null ? null : Number(values.nb_hommes),
            nb_femmes:
              values.nb_femmes === null ? null : Number(values.nb_femmes),
            nb_jeunes:
              values.nb_jeunes === null ? null : Number(values.nb_jeunes),
            id_opr: Number(values.id_opr),
            id_category_theme: Number(values.id_category_theme),
          };
          await updateAccompagnement({
            id: row.original.id,
            accompagnement: payload,
          });
          refreshList();
          reset();
          exitEditingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(
            message ?? "Impossible de mettre à jour l'accompagnement"
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
            nb_hommes:
              values.nb_hommes === null ? null : Number(values.nb_hommes),
            nb_femmes:
              values.nb_femmes === null ? null : Number(values.nb_femmes),
            nb_jeunes:
              values.nb_jeunes === null ? null : Number(values.nb_jeunes),
            id_opr: Number(values.id_opr),
            id_category_theme: Number(values.id_category_theme),
          };
          await createAccompagnement(payload);
          refreshList();
          reset();
          exitCreatingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de créer l'accompagnement");
        }
      }}
      onCreatingRowCancel={({ table }) => {
        reset({
          date: new Date().toISOString().substring(0, 10),
          duree: 0,
          theme: "",
          existant: "",
          problematique: "",
          solution: "",
          remarque: "",
          activite_de_masse: false,
          nb_hommes: null,
          nb_femmes: null,
          nb_jeunes: null,
          type: "ACCOMPAGNEMENT_SUIVI",
          id_category_theme: 0,
          id_opr: filterOprId ?? 0,
        });
        table.setCreatingRow(null);
      }}
      onEditingRowCancel={({ table }) => {
        reset({
          date: new Date().toISOString().substring(0, 10),
          duree: 0,
          theme: "",
          existant: "",
          problematique: "",
          solution: "",
          remarque: "",
          activite_de_masse: false,
          nb_hommes: null,
          nb_femmes: null,
          nb_jeunes: null,
          type: "ACCOMPAGNEMENT_SUIVI",
          id_category_theme: 0,
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
                  existant: row.original.existant ?? "",
                  problematique: row.original.problematique ?? "",
                  solution: row.original.solution ?? "",
                  remarque: row.original.remarque ?? "",
                  activite_de_masse: row.original.activite_de_masse ?? false,
                  nb_hommes: row.original.nb_hommes,
                  nb_femmes: row.original.nb_femmes,
                  nb_jeunes: row.original.nb_jeunes,
                  type: row.original.type,
                  id_category_theme: row.original.id_category_theme,
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
