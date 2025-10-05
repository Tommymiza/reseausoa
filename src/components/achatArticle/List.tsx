"use client";

import MaterialTable from "@/components/table/MaterialTable";
import { canActivate } from "@/lib/canActivate";
import achatArticleStore from "@/store/achatArticle";
import articleStore from "@/store/article";
import { yupResolver } from "@hookform/resolvers/yup";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { IconButton, Stack, styled } from "@mui/material";
import { MRT_RowSelectionState } from "material-react-table";
import { useConfirm } from "material-ui-confirm";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

import AddArticleDialog from "./AddArticleDialog";
import EditArticleDialog from "./EditArticleDialog";
import Columns from "./table/columns";

const achatArticleSchema = Yup.object({
  id_article: Yup.number()
    .typeError("Article requis")
    .min(1, "Article requis")
    .required("Article requis"),
  quantite: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? null : value
    )
    .required("Quantité requise")
    .min(0, "Quantité invalide")
    .typeError("Quantité invalide"),
});

export default function ListAchatArticle({
  selectedAchat,
}: {
  selectedAchat: number | null;
}) {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editArticleId, setEditArticleId] = useState<number | null>(null);
  const fieldOnChangeRef = useRef<((value: number) => void) | null>(null);

  const {
    achatArticleList,
    getAchatArticles,
    updateAchatArticle,
    deleteAchatArticle,
    createAchatArticle,
    loading,
    clearList,
  } = achatArticleStore();

  const { getArticles } = articleStore();

  const {
    control,
    trigger,
    getValues,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(achatArticleSchema),
    mode: "onChange",
    defaultValues: {
      id_article: 0,
      quantite: 0,
    },
  });

  const confirm = useConfirm();

  const refreshList = useCallback(() => {
    if (selectedAchat === null) {
      clearList();
      setRowSelection({});
      return;
    }

    const args: Record<string, unknown> = {
      include: {
        Article: true,
      },
      where: {
        id_achat: selectedAchat,
      },
    };

    getAchatArticles(args).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de récupérer les articles d'achat");
    });
  }, [clearList, selectedAchat, getAchatArticles, setRowSelection]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  useEffect(() => {
    getArticles({
      orderBy: {
        nom: "asc",
      },
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de récupérer les articles");
    });
  }, [getArticles]);

  const canUpdate = canActivate("AchatArticle", "U");
  const canDelete = canActivate("AchatArticle", "D");

  const handleDelete = async (id: number) => {
    const isOk = await confirm({
      title: "Supprimer",
      description: "Voulez-vous vraiment supprimer cet article d'achat ?",
      confirmationText: "Oui",
      cancellationText: "Annuler",
    });
    if (!isOk.confirmed) return;
    try {
      await deleteAchatArticle(id);
      refreshList();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de supprimer l'article d'achat");
    }
  };

  return (
    <>
      <MaterialTable
        columns={Columns({
          control,
          errors,
          onOpenAddDialog: () => setOpenAddDialog(true),
          onOpenEditDialog: (articleId) => setEditArticleId(articleId),
          onFieldChange: (onChange) => {
            fieldOnChangeRef.current = onChange;
          },
        })}
        getRowId={(originalRow) => originalRow.id}
        data={achatArticleList}
        title="Articles achetés"
        enableRowSelection={false}
        onRowSelectionChange={setRowSelection}
        state={{
          isLoading: loading,
          rowSelection,
          columnPinning: { left: ["id_article", "quantite"] },
        }}
        onEditingRowSave={async ({ exitEditingMode, row }) => {
          try {
            const isValid = await trigger();
            if (!isValid) return;
            const values = getValues();
            const payload = {
              quantite: Number(values.quantite),
              id_article: Number(values.id_article),
            };
            await updateAchatArticle({
              id: row.original.id,
              achatArticle: payload,
            });
            refreshList();
            reset({
              id_article: 0,
              quantite: 0,
            });
            exitEditingMode();
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : undefined;
            toast.error(
              message ?? "Impossible de mettre à jour l'article d'achat"
            );
          }
        }}
        onCreatingRowSave={async ({ exitCreatingMode }) => {
          try {
            const isValid = await trigger();
            if (!isValid) return;
            const values = getValues();

            if (selectedAchat === null) {
              toast.error("Veuillez sélectionner un achat");
              return;
            }

            const payload = {
              quantite: Number(values.quantite),
              id_article: Number(values.id_article),
              id_achat: selectedAchat,
            };
            await createAchatArticle(payload);
            refreshList();
            reset({
              id_article: 0,
              quantite: 0,
            });
            exitCreatingMode();
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : undefined;
            toast.error(message ?? "Impossible de créer l'article d'achat");
          }
        }}
        onCreatingRowCancel={({ table }) => {
          reset({
            id_article: 0,
            quantite: 0,
          });
          table.setCreatingRow(null);
        }}
        onEditingRowCancel={({ table }) => {
          reset({
            id_article: 0,
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
                    id_article: row.original.id_article,
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
      <AddArticleDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onArticleAdded={(articleId) => {
          if (fieldOnChangeRef.current) {
            fieldOnChangeRef.current(articleId);
          }
        }}
      />
      <EditArticleDialog
        open={editArticleId !== null}
        onClose={() => setEditArticleId(null)}
        articleId={editArticleId}
        onArticleUpdated={() => {
          // Refresh articles list is already handled in the dialog
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
