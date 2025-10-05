"use client";

import MaterialTable from "@/components/table/MaterialTable";
import { canActivate } from "@/lib/canActivate";
import { GVECCycleItem } from "@/store/gvecCycle/type";
import gvecFinCycleStore from "@/store/gvecFinCycle";
import producteurStore from "@/store/producteur";
import { yupResolver } from "@hookform/resolvers/yup";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { IconButton, Stack, styled } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

import { useSearchParams } from "next/navigation";
import Columns from "./table/columns";

const gvecFinCycleSchema = Yup.object({
  id_producteur: Yup.number()
    .typeError("Producteur requis")
    .min(1, "Producteur requis")
    .required("Producteur requis"),
  fonction: Yup.mixed<
    | "FILOHA"
    | "SEKRETERA"
    | "TRESORIER"
    | "MPANISA_VOLA_1"
    | "MPANISA_VOLA_2"
    | "MPIKAMBANA"
  >()
    .oneOf(
      [
        "FILOHA",
        "SEKRETERA",
        "TRESORIER",
        "MPANISA_VOLA_1",
        "MPANISA_VOLA_2",
        "MPIKAMBANA",
      ],
      "Fonction invalide"
    )
    .required("Fonction requise"),
  nb_part: Yup.number()
    .typeError("Nombre de parts requis")
    .min(0, "Nombre doit être positif")
    .required("Nombre de parts requis"),
  montant_part: Yup.number()
    .typeError("Montant part requis")
    .min(0, "Montant doit être positif")
    .required("Montant part requis"),
  montant_interet: Yup.number()
    .typeError("Montant intérêt requis")
    .min(0, "Montant doit être positif")
    .required("Montant intérêt requis"),
  montant_total: Yup.number()
    .typeError("Montant total requis")
    .min(0, "Montant doit être positif")
    .required("Montant total requis"),
});

export default function ListGVECFinCycle({
  selectedGVECCycle,
}: {
  selectedGVECCycle: GVECCycleItem | null;
}) {
  const {
    gvecFinCycleList,
    getGVECFinCycles,
    updateGVECFinCycle,
    deleteGVECFinCycle,
    createGVECFinCycle,
    loading,
    clearList,
  } = gvecFinCycleStore();
  const searchParams = useSearchParams();
  const filterOpr = searchParams.get("id_opr");
  const filterOprId = filterOpr ? parseInt(filterOpr) : undefined;

  const { getProducteurs } = producteurStore();

  const {
    control,
    trigger,
    getValues,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm<{
    id_producteur: number;
    fonction:
      | "FILOHA"
      | "SEKRETERA"
      | "TRESORIER"
      | "MPANISA_VOLA_1"
      | "MPANISA_VOLA_2"
      | "MPIKAMBANA";
    nb_part: number;
    montant_part: number;
    montant_interet: number;
    montant_total: number;
  }>({
    resolver: yupResolver(gvecFinCycleSchema),
    mode: "onChange",
    defaultValues: {
      id_producteur: 0,
      fonction: "MPIKAMBANA",
      nb_part: 0,
      montant_part: 0,
      montant_interet: 0,
      montant_total: 0,
    },
  });
  const nb_part = watch("nb_part");
  const montant_part = watch("montant_part");
  const montant_interet = watch("montant_interet");

  useEffect(() => {
    const montant = (nb_part || 0) * (selectedGVECCycle?.montant_part || 0);
    setValue("montant_part", montant);
  }, [selectedGVECCycle, nb_part]);

  useEffect(() => {
    const montant_total = Number(montant_part) + Number(montant_interet);
    setValue("montant_total", montant_total);
  }, [montant_part, montant_interet]);

  const confirm = useConfirm();

  const refreshList = useCallback(() => {
    if (!selectedGVECCycle) {
      clearList();
      return;
    }

    getGVECFinCycles({
      where: {
        id_gvec_cycle: selectedGVECCycle.id,
      },
      include: {
        Producteur: true,
      },
      orderBy: {
        fonction: "asc",
      },
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de récupérer les fins de cycle GVEC");
    });
  }, [getGVECFinCycles, clearList, selectedGVECCycle]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

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

  const canUpdate = canActivate("GVEC_FIN_CYCLE", "U");
  const canDelete = canActivate("GVEC_FIN_CYCLE", "D");

  const handleDelete = async (id: number) => {
    const isOk = await confirm({
      title: "Supprimer",
      description: "Voulez-vous vraiment supprimer cette fin de cycle GVEC ?",
      confirmationText: "Oui",
      cancellationText: "Annuler",
    });
    if (!isOk.confirmed) return;
    try {
      await deleteGVECFinCycle(id);
      refreshList();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de supprimer la fin de cycle GVEC");
    }
  };

  if (!selectedGVECCycle) {
    return null;
  }

  return (
    <MaterialTable
      columns={Columns({ control, errors })}
      getRowId={(originalRow) => originalRow.id}
      data={gvecFinCycleList}
      title={`Fin de cycle - Cycle ${selectedGVECCycle.numero}`}
      state={{
        isLoading: loading,
        columnPinning: { left: ["id_producteur", "fonction"] },
      }}
      onEditingRowSave={async ({ exitEditingMode, row }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload = {
            id_producteur: Number(values.id_producteur),
            fonction: values.fonction as
              | "FILOHA"
              | "SEKRETERA"
              | "TRESORIER"
              | "MPANISA_VOLA_1"
              | "MPANISA_VOLA_2"
              | "MPIKAMBANA",
            nb_part: Number(values.nb_part),
            montant_part: Number(values.montant_part),
            montant_interet: Number(values.montant_interet),
            montant_total: Number(values.montant_total),
          };
          await updateGVECFinCycle({
            id: row.original.id,
            gvecFinCycle: payload,
          });
          refreshList();
          reset({
            id_producteur: 0,
            fonction: "MPIKAMBANA",
            nb_part: 0,
            montant_part: 0,
            montant_interet: 0,
            montant_total: 0,
          });
          exitEditingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(
            message ?? "Impossible de mettre à jour la fin de cycle GVEC"
          );
        }
      }}
      onCreatingRowSave={async ({ exitCreatingMode }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload = {
            id_producteur: Number(values.id_producteur),
            fonction: values.fonction as
              | "FILOHA"
              | "SEKRETERA"
              | "TRESORIER"
              | "MPANISA_VOLA_1"
              | "MPANISA_VOLA_2"
              | "MPIKAMBANA",
            nb_part: Number(values.nb_part),
            montant_part: Number(values.montant_part),
            montant_interet: Number(values.montant_interet),
            montant_total: Number(values.montant_total),
            id_gvec_cycle: selectedGVECCycle.id,
          };
          await createGVECFinCycle(payload);
          refreshList();
          reset({
            id_producteur: 0,
            fonction: "MPIKAMBANA",
            nb_part: 0,
            montant_part: 0,
            montant_interet: 0,
            montant_total: 0,
          });
          exitCreatingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de créer la fin de cycle GVEC");
        }
      }}
      onCreatingRowCancel={({ table }) => {
        reset({
          id_producteur: 0,
          fonction: "MPIKAMBANA",
          nb_part: 0,
          montant_part: 0,
          montant_interet: 0,
          montant_total: 0,
        });
        table.setCreatingRow(null);
      }}
      onEditingRowCancel={({ table }) => {
        reset({
          id_producteur: 0,
          fonction: "MPIKAMBANA",
          nb_part: 0,
          montant_part: 0,
          montant_interet: 0,
          montant_total: 0,
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
                  id_producteur: row.original.id_producteur,
                  fonction: row.original.fonction,
                  nb_part: row.original.nb_part,
                  montant_part: row.original.montant_part,
                  montant_interet: row.original.montant_interet,
                  montant_total: row.original.montant_total,
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
