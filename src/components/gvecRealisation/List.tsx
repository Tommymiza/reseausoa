"use client";

import MaterialTable from "@/components/table/MaterialTable";
import { canActivate } from "@/lib/canActivate";
import { GVECCycleItem } from "@/store/gvecCycle/type";
import gvecRealisationStore from "@/store/gvecRealisation";
import { yupResolver } from "@hookform/resolvers/yup";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { IconButton, Stack, styled } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

import Columns from "./table/columns";

const gvecRealisationSchema = Yup.object({
  numero: Yup.number()
    .typeError("Numéro requis")
    .min(1, "Numéro doit être supérieur à 0")
    .required("Numéro requis"),
  date: Yup.string().required("Date requise"),
  total_famangina: Yup.number()
    .typeError("Total famangina requis")
    .min(0, "Montant doit être positif")
    .required("Total famangina requis"),
  nb_novangina: Yup.number()
    .typeError("Nombre novangina requis")
    .min(0, "Nombre doit être positif")
    .required("Nombre novangina requis"),
  total_caisse_sociale: Yup.number()
    .typeError("Total caisse sociale requis")
    .min(0, "Montant doit être positif")
    .required("Total caisse sociale requis"),
  total_remboursement: Yup.number()
    .typeError("Total remboursement requis")
    .min(0, "Montant doit être positif")
    .required("Total remboursement requis"),
  total_interet: Yup.number()
    .typeError("Total intérêt requis")
    .min(0, "Montant doit être positif")
    .required("Total intérêt requis"),
  nb_remboursant: Yup.number()
    .typeError("Nombre remboursant requis")
    .min(0, "Nombre doit être positif")
    .required("Nombre remboursant requis"),
  total_credit: Yup.number()
    .typeError("Total crédit requis")
    .min(0, "Montant doit être positif")
    .required("Total crédit requis"),
  nb_octroye: Yup.number()
    .typeError("Nombre octroyé requis")
    .min(0, "Nombre doit être positif")
    .required("Nombre octroyé requis"),
  total_caisse_epargne: Yup.number()
    .typeError("Total caisse épargne requis")
    .min(0, "Montant doit être positif")
    .required("Total caisse épargne requis"),
});

export default function ListGVECRealisation({
  selectedGVECCycle,
}: {
  selectedGVECCycle: GVECCycleItem | null;
}) {
  const {
    gvecRealisationList,
    getGVECRealisations,
    updateGVECRealisation,
    deleteGVECRealisation,
    createGVECRealisation,
    loading,
    clearList,
  } = gvecRealisationStore();

  const {
    control,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(gvecRealisationSchema),
    mode: "onChange",
    defaultValues: {
      numero: 0,
      date: new Date().toISOString().substring(0, 10),
      total_famangina: 0,
      nb_novangina: 0,
      total_caisse_sociale: 0,
      total_remboursement: 0,
      total_interet: 0,
      nb_remboursant: 0,
      total_credit: 0,
      nb_octroye: 0,
      total_caisse_epargne: 0,
    },
  });

  const confirm = useConfirm();

  const refreshList = useCallback(() => {
    if (!selectedGVECCycle) {
      clearList();
      return;
    }

    getGVECRealisations({
      where: {
        id_gvec_cycle: selectedGVECCycle.id,
      },
      orderBy: {
        numero: "asc",
      },
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de récupérer les réalisations GVEC");
    });
  }, [getGVECRealisations, clearList, selectedGVECCycle]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const canUpdate = canActivate("GVEC_REALISATION", "U");
  const canDelete = canActivate("GVEC_REALISATION", "D");

  const handleDelete = async (id: number) => {
    const isOk = await confirm({
      title: "Supprimer",
      description: "Voulez-vous vraiment supprimer cette réalisation GVEC ?",
      confirmationText: "Oui",
      cancellationText: "Annuler",
    });
    if (!isOk.confirmed) return;
    try {
      await deleteGVECRealisation(id);
      refreshList();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de supprimer la réalisation GVEC");
    }
  };

  if (!selectedGVECCycle) {
    return null;
  }

  return (
    <MaterialTable
      columns={Columns({ control, errors })}
      getRowId={(originalRow) => originalRow.id}
      data={gvecRealisationList}
      title={`Réalisations - Cycle ${selectedGVECCycle.numero}`}
      state={{
        isLoading: loading,
        columnPinning: { left: ["numero", "date"] },
      }}
      onEditingRowSave={async ({ exitEditingMode, row }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload = {
            numero: Number(values.numero),
            date: new Date(values.date).toISOString(),
            total_famangina: Number(values.total_famangina),
            nb_novangina: Number(values.nb_novangina),
            total_caisse_sociale: Number(values.total_caisse_sociale),
            total_remboursement: Number(values.total_remboursement),
            total_interet: Number(values.total_interet),
            nb_remboursant: Number(values.nb_remboursant),
            total_credit: Number(values.total_credit),
            nb_octroye: Number(values.nb_octroye),
            total_caisse_epargne: Number(values.total_caisse_epargne),
          };
          await updateGVECRealisation({
            id: row.original.id,
            gvecRealisation: payload,
          });
          refreshList();
          reset({
            numero: 0,
            date: new Date().toISOString().substring(0, 10),
            total_famangina: 0,
            nb_novangina: 0,
            total_caisse_sociale: 0,
            total_remboursement: 0,
            total_interet: 0,
            nb_remboursant: 0,
            total_credit: 0,
            nb_octroye: 0,
            total_caisse_epargne: 0,
          });
          exitEditingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(
            message ?? "Impossible de mettre à jour la réalisation GVEC"
          );
        }
      }}
      onCreatingRowSave={async ({ exitCreatingMode }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload = {
            numero: Number(values.numero),
            date: new Date(values.date).toISOString(),
            total_famangina: Number(values.total_famangina),
            nb_novangina: Number(values.nb_novangina),
            total_caisse_sociale: Number(values.total_caisse_sociale),
            total_remboursement: Number(values.total_remboursement),
            total_interet: Number(values.total_interet),
            nb_remboursant: Number(values.nb_remboursant),
            total_credit: Number(values.total_credit),
            nb_octroye: Number(values.nb_octroye),
            total_caisse_epargne: Number(values.total_caisse_epargne),
            id_gvec_cycle: selectedGVECCycle.id,
          };
          await createGVECRealisation(payload);
          refreshList();
          reset({
            numero: 0,
            date: new Date().toISOString().substring(0, 10),
            total_famangina: 0,
            nb_novangina: 0,
            total_caisse_sociale: 0,
            total_remboursement: 0,
            total_interet: 0,
            nb_remboursant: 0,
            total_credit: 0,
            nb_octroye: 0,
            total_caisse_epargne: 0,
          });
          exitCreatingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de créer la réalisation GVEC");
        }
      }}
      onCreatingRowCancel={({ table }) => {
        reset({
          numero: 0,
          date: new Date().toISOString().substring(0, 10),
          total_famangina: 0,
          nb_novangina: 0,
          total_caisse_sociale: 0,
          total_remboursement: 0,
          total_interet: 0,
          nb_remboursant: 0,
          total_credit: 0,
          nb_octroye: 0,
          total_caisse_epargne: 0,
        });
        table.setCreatingRow(null);
      }}
      onEditingRowCancel={({ table }) => {
        reset({
          numero: 0,
          date: new Date().toISOString().substring(0, 10),
          total_famangina: 0,
          nb_novangina: 0,
          total_caisse_sociale: 0,
          total_remboursement: 0,
          total_interet: 0,
          nb_remboursant: 0,
          total_credit: 0,
          nb_octroye: 0,
          total_caisse_epargne: 0,
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
                  date: row.original.date,
                  total_famangina: row.original.total_famangina,
                  nb_novangina: row.original.nb_novangina,
                  total_caisse_sociale: row.original.total_caisse_sociale,
                  total_remboursement: row.original.total_remboursement,
                  total_interet: row.original.total_interet,
                  nb_remboursant: row.original.nb_remboursant,
                  total_credit: row.original.total_credit,
                  nb_octroye: row.original.nb_octroye,
                  total_caisse_epargne: row.original.total_caisse_epargne,
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
