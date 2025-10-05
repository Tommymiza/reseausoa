"use client";

import { canActivate } from "@/lib/canActivate";
import accompagnementProdStore from "@/store/accompagnementProd";
import producteurStore from "@/store/producteur";
import { yupResolver } from "@hookform/resolvers/yup";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { IconButton, Stack, styled } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

import accompagnementStore from "@/store/accompagnement";
import { useSearchParams } from "next/navigation";
import MaterialTable from "../table/MaterialTable";
import Columns from "./table/columns";

const accompagnementProdSchema = Yup.object({
  id_producteur: Yup.number()
    .typeError("Producteur requis")
    .min(1, "Producteur requis")
    .required("Producteur requis"),
  id_type_accompagnement: Yup.number()
    .typeError("Accompagnement requis")
    .min(1, "Accompagnement requis")
    .required("Accompagnement requis"),
});

type ListAccompagnementProdProps = {
  accompagnementId: number;
};

export type FormValues = {
  id_producteur: number;
  id_type_accompagnement: number;
};

export default function ListAccompagnementProd({
  accompagnementId,
}: ListAccompagnementProdProps) {
  const {
    accompagnementProdList,
    getAccompagnementProds,
    deleteAccompagnementProd,
    updateAccompagnementProd,
    createAccompagnementProd,
    loading,
  } = accompagnementProdStore();

  const { getAccompagnements } = accompagnementStore();

  const searchParams = useSearchParams();
  const filterOpr = searchParams.get("id_opr");

  const { getProducteurs } = producteurStore();

  const {
    control,
    trigger,
    getValues,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(accompagnementProdSchema),
    mode: "onChange",
    defaultValues: {
      id_producteur: 0,
      id_type_accompagnement: accompagnementId,
    },
  });
  const filterOprId = useMemo(() => {
    if (!filterOpr) return undefined;
    const parsed = Number(filterOpr);
    return Number.isNaN(parsed) ? undefined : parsed;
  }, [filterOpr]);
  const refreshListAccompagnement = useCallback(() => {
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

  const refreshList = () => {
    getAccompagnementProds({
      include: {
        Producteur: true,
        AccompagnementOpr: true,
      },
      where: {
        id_type_accompagnement: accompagnementId,
      },
      orderBy: {
        Producteur: { nom: "asc" },
      },
    });
    refreshListAccompagnement();
  };

  useEffect(() => {
    getProducteurs({
      where: {
        AND: [
          {
            OPB: {
              id_opr: Number(filterOpr),
            },
          },
          {
            actif: true,
          },
        ],
      },
      include: {
        OPB: true,
      },
    });
    refreshList();
  }, []);

  const confirm = useConfirm();

  const canUpdate = canActivate("Membre", "U");
  const canDelete = canActivate("Membre", "D");

  const handleDelete = async (id: number) => {
    const isOk = await confirm({
      title: "Supprimer",
      description:
        "Voulez-vous vraiment supprimer ce producteur dans cet accompagnement ?",
      confirmationText: "Oui",
      cancellationText: "Annuler",
    });
    if (!isOk.confirmed) return;
    try {
      await deleteAccompagnementProd(id);
      refreshList();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de supprimer l'accompagnement prod");
    }
  };

  return (
    <MaterialTable
      columns={Columns({
        control,
        errors,
      })}
      getRowId={(originalRow) => originalRow.id}
      data={accompagnementProdList}
      title="Liste producteurs"
      state={{
        isLoading: loading,
        columnPinning: { left: ["mrt-row-select", "id_producteur"] },
      }}
      onEditingRowSave={async ({ exitEditingMode, row }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload = {
            id_producteur: Number(values.id_producteur),
            id_type_accompagnement: Number(values.id_type_accompagnement),
          };
          await updateAccompagnementProd({
            id: row.original.id,
            accompagnementProd: payload,
          });
          refreshList();
          reset({
            id_producteur: 0,
            id_type_accompagnement: accompagnementId ?? 0,
          });
          exitEditingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(
            message ?? "Impossible de mettre à jour l'accompagnement prod"
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
            id_type_accompagnement: Number(values.id_type_accompagnement),
          };
          await createAccompagnementProd(payload);
          refreshList();
          reset({
            id_producteur: 0,
            id_type_accompagnement: accompagnementId ?? 0,
          });
          exitCreatingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de créer l'accompagnement prod");
        }
      }}
      onCreatingRowCancel={({ table }) => {
        reset({
          id_producteur: 0,
          id_type_accompagnement: accompagnementId ?? 0,
        });
        table.setCreatingRow(null);
      }}
      onEditingRowCancel={({ table }) => {
        reset({
          id_producteur: 0,
          id_type_accompagnement: accompagnementId ?? 0,
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
                  id_type_accompagnement: row.original.id_type_accompagnement,
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
