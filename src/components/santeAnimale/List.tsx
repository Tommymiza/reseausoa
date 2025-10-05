"use client";
import { canActivate } from "@/lib/canActivate";
import producteurStore from "@/store/producteur";
import santeAnimaleStore from "@/store/santeAnimale";
import { yupResolver } from "@hookform/resolvers/yup";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { IconButton, Stack, styled } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";
import MaterialTable from "../table/MaterialTable";
import Columns from "./table/columns";

const santeAnimaleSchema = Yup.object({
  date: Yup.string().required("Date requise"),
  type: Yup.string()
    .oneOf(["Vaccination", "Soin", "Déparasitage", "Vitamine"], "Type invalide")
    .required("Type requis"),
  type_animale: Yup.string().required("Type d'animale requis"),
  medicament_utilise: Yup.string().nullable(),
  origine_medicament: Yup.string().nullable(),
  lot: Yup.string().nullable(),
  nb_animaux: Yup.number()
    .required("Nombre d'animaux requis")
    .min(1, "Minimum 1 animal"),
  dose_utilisee: Yup.string().nullable(),
  pu_dose: Yup.number()
    .required("Prix unitaire requis")
    .min(0, "Prix invalide"),
  id_producteur: Yup.number().required("Producteur requis"),
  id_opr: Yup.number().required("OPR requis"),
  id_veternaire: Yup.number().nullable(),
  autre: Yup.string().nullable(),
});

export default function ListSanteAnimale() {
  const searchParams = useSearchParams();
  const filterOpr = searchParams.get("id_opr");
  const filterOprId = useMemo(() => {
    if (!filterOpr) return undefined;
    const parsed = Number(filterOpr);
    return Number.isNaN(parsed) ? undefined : parsed;
  }, [filterOpr]);

  const { getProducteurs } = producteurStore();

  const {
    santeAnimaleList,
    getSanteAnimales,
    updateSanteAnimale,
    deleteSanteAnimale,
    createSanteAnimale,
    clearList,
    loading,
  } = santeAnimaleStore();

  const {
    control,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(santeAnimaleSchema),
    mode: "onChange",
    defaultValues: {
      date: new Date().toISOString().substring(0, 10),
      type: "Vaccination" as const,
      type_animale: "",
      medicament_utilise: "",
      origine_medicament: "",
      lot: "",
      nb_animaux: 1,
      dose_utilisee: "",
      pu_dose: 0,
      id_producteur: 0,
      id_opr: filterOprId ?? 0,
      id_veternaire: null,
      autre: "",
    },
  });

  useEffect(() => {
    reset({
      date: new Date().toISOString().substring(0, 10),
      type: "Vaccination" as const,
      type_animale: "",
      medicament_utilise: "",
      origine_medicament: "",
      lot: "",
      nb_animaux: 1,
      dose_utilisee: "",
      pu_dose: 0,
      id_producteur: 0,
      id_opr: filterOprId ?? 0,
      id_veternaire: null,
      autre: "",
    });

    getProducteurs({
      include: {
        OPB: true,
      },
      where: {
        OPB: {
          id_opr: filterOprId,
        },
        actif: true,
      },
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
        Producteur: true,
        Veterinaire: true,
      },
      orderBy: {
        date: "desc",
      },
      where: { id_opr: filterOprId },
    };

    getSanteAnimales(args).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de récupérer les santés animales");
    });
  }, [filterOprId, getSanteAnimales]);

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
      description: "Voulez-vous vraiment supprimer cette santé animale ?",
      confirmationText: "Oui",
      cancellationText: "Annuler",
    });
    if (!isOk.confirmed) return;
    try {
      await deleteSanteAnimale(id);
      refreshList();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de supprimer la santé animale");
    }
  };

  return (
    <MaterialTable
      columns={Columns({ control, errors })}
      getRowId={(originalRow) => originalRow.id}
      data={santeAnimaleList}
      title="Liste santé animale"
      createDisplayMode={"row"}
      enableRowActions={filterOprId !== undefined}
      positionToolbarAlertBanner="bottom"
      renderTopToolbarCustomActions={({ table }) =>
        filterOprId === undefined ? (
          <Stack sx={{ p: 2, bgcolor: "warning.light", borderRadius: 1 }}>
            Veuillez sélectionner un OPR pour créer une santé animale
          </Stack>
        ) : null
      }
      state={{
        isLoading: loading,
        columnPinning: { left: ["date", "type"] },
      }}
      onEditingRowSave={async ({ exitEditingMode, row }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload = {
            ...values,
            date: new Date(values.date).toISOString(),
            nb_animaux: Number(values.nb_animaux),
            pu_dose: Number(values.pu_dose),
            id_producteur: Number(values.id_producteur),
            id_opr: Number(values.id_opr),
            id_veternaire: values.id_veternaire
              ? Number(values.id_veternaire)
              : null,
          };
          await updateSanteAnimale({
            id: row.original.id,
            santeAnimale: payload,
          });
          refreshList();
          reset();
          exitEditingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(
            message ?? "Impossible de mettre à jour la santé animale"
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
            nb_animaux: Number(values.nb_animaux),
            pu_dose: Number(values.pu_dose),
            id_producteur: Number(values.id_producteur),
            id_opr: Number(values.id_opr),
            id_veternaire: values.id_veternaire
              ? Number(values.id_veternaire)
              : null,
          };
          await createSanteAnimale(payload);
          refreshList();
          reset();
          exitCreatingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de créer la santé animale");
        }
      }}
      onCreatingRowCancel={({ table }) => {
        reset({
          date: new Date().toISOString().substring(0, 10),
          type: "Vaccination" as const,
          type_animale: "",
          medicament_utilise: "",
          origine_medicament: "",
          lot: "",
          nb_animaux: 1,
          dose_utilisee: "",
          pu_dose: 0,
          id_producteur: 0,
          id_opr: filterOprId ?? 0,
          id_veternaire: null,
          autre: "",
        });
        table.setCreatingRow(null);
      }}
      onEditingRowCancel={({ table }) => {
        reset({
          date: new Date().toISOString().substring(0, 10),
          type: "Vaccination" as const,
          type_animale: "",
          medicament_utilise: "",
          origine_medicament: "",
          lot: "",
          nb_animaux: 1,
          dose_utilisee: "",
          pu_dose: 0,
          id_producteur: 0,
          id_opr: filterOprId ?? 0,
          id_veternaire: null,
          autre: "",
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
                  type: row.original.type,
                  type_animale: row.original.type_animale,
                  medicament_utilise: row.original.medicament_utilise ?? "",
                  origine_medicament: row.original.origine_medicament ?? "",
                  lot: row.original.lot ?? "",
                  nb_animaux: row.original.nb_animaux,
                  dose_utilisee: row.original.dose_utilisee ?? "",
                  pu_dose: row.original.pu_dose,
                  id_producteur: row.original.id_producteur,
                  id_opr: row.original.id_opr,
                  id_veternaire: row.original.id_veternaire,
                  autre: row.original.autre ?? "",
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
