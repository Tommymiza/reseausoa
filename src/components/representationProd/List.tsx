"use client";

import { canActivate } from "@/lib/canActivate";
import producteurStore from "@/store/producteur";
import representationProdStore from "@/store/representationProd";
import { yupResolver } from "@hookform/resolvers/yup";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { IconButton, Stack, styled } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

import { useSearchParams } from "next/navigation";
import MaterialTable from "../table/MaterialTable";
import Columns from "./table/columns";

const representationProdSchema = Yup.object({
  id_producteur: Yup.number()
    .typeError("Producteur requis")
    .min(1, "Producteur requis")
    .required("Producteur requis"),
  id_representation: Yup.number()
    .typeError("Représentation requise")
    .min(1, "Représentation requise")
    .required("Représentation requise"),
});

type ListRepresentationProdProps = {
  representationId: number;
};

export type FormValues = {
  id_producteur: number;
  id_representation: number;
};

export default function ListRepresentationProd({
  representationId,
}: ListRepresentationProdProps) {
  const {
    representationProdList,
    getRepresentationProds,
    deleteRepresentationProd,
    updateRepresentationProd,
    createRepresentationProd,
    loading,
  } = representationProdStore();

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
    resolver: yupResolver(representationProdSchema),
    mode: "onChange",
    defaultValues: {
      id_producteur: 0,
      id_representation: representationId,
    },
  });

  const refreshList = () => {
    getRepresentationProds({
      include: {
        Producteur: true,
        Representation: true,
      },
      where: {
        id_representation: representationId,
      },
      orderBy: {
        Producteur: { nom: "asc" },
      },
    });
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
  }, [filterOpr]);

  useEffect(() => {
    reset({
      id_producteur: 0,
      id_representation: representationId,
    });
  }, [representationId, reset]);

  const confirm = useConfirm();

  const canUpdate = canActivate("Membre", "U");
  const canDelete = canActivate("Membre", "D");

  const handleDelete = async (id: number) => {
    const isOk = await confirm({
      title: "Supprimer",
      description:
        "Voulez-vous vraiment supprimer ce producteur dans ce représentant ?",
      confirmationText: "Oui",
      cancellationText: "Annuler",
    });
    if (!isOk.confirmed) return;
    try {
      await deleteRepresentationProd(id);
      refreshList();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de supprimer le représentant");
    }
  };

  return (
    <MaterialTable
      columns={Columns({
        control,
        errors,
      })}
      getRowId={(originalRow) => originalRow.id}
      data={representationProdList}
      title="Liste représentants"
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
            id_representation: Number(values.id_representation),
          };
          await updateRepresentationProd({
            id: row.original.id,
            representationProd: payload,
          });
          refreshList();
          reset({
            id_producteur: 0,
            id_representation: representationId ?? 0,
          });
          exitEditingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de mettre à jour le représentant");
        }
      }}
      onCreatingRowSave={async ({ exitCreatingMode }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload = {
            id_producteur: Number(values.id_producteur),
            id_representation: Number(values.id_representation),
          };
          await createRepresentationProd(payload);
          refreshList();
          reset({
            id_producteur: 0,
            id_representation: representationId ?? 0,
          });
          exitCreatingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de créer la représentation prod");
        }
      }}
      onCreatingRowCancel={({ table }) => {
        reset({
          id_producteur: 0,
          id_representation: representationId ?? 0,
        });
        table.setCreatingRow(null);
      }}
      onEditingRowCancel={({ table }) => {
        reset({
          id_producteur: 0,
          id_representation: representationId ?? 0,
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
                  id_representation: row.original.id_representation,
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
