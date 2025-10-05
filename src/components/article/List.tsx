"use client";

import MaterialTable from "@/components/table/MaterialTable";
import { canActivate } from "@/lib/canActivate";
import articleStore from "@/store/article";
import { ArticleItem } from "@/store/article/type";
import { yupResolver } from "@hookform/resolvers/yup";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { IconButton, Stack, styled } from "@mui/material";
import { MRT_RowSelectionState } from "material-react-table";
import { useConfirm } from "material-ui-confirm";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

import Columns from "./table/columns";

const articleSchema = Yup.object({
  nom: Yup.string().required("Nom requis"),
});

export default function ListArticle({
  setSelected,
  selected,
}: {
  setSelected: (item: ArticleItem | null) => void;
  selected: ArticleItem | null;
}) {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const {
    articleList,
    getArticles,
    updateArticle,
    deleteArticle,
    createArticle,
    loading,
    clearList,
  } = articleStore();

  const {
    control,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(articleSchema),
    mode: "onChange",
    defaultValues: {
      nom: "",
    },
  });

  const confirm = useConfirm();

  const refreshList = useCallback(() => {
    getArticles({
      orderBy: {
        nom: "asc",
      },
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de récupérer les articles");
    });
  }, [getArticles]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const canUpdate = canActivate("Article", "U");
  const canDelete = canActivate("Article", "D");

  const handleDelete = async (id: number) => {
    const isOk = await confirm({
      title: "Supprimer",
      description: "Voulez-vous vraiment supprimer cet article ?",
      confirmationText: "Oui",
      cancellationText: "Annuler",
    });
    if (!isOk.confirmed) return;
    try {
      await deleteArticle(id);
      if (id === selected?.id) {
        setRowSelection({});
      }
      refreshList();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de supprimer l'article");
    }
  };

  useEffect(() => {
    const selectedIds = Object.keys(rowSelection).map((key) => Number(key));
    if (selectedIds.length === 0) {
      setSelected(null);
      return;
    }
    const selectedId = selectedIds[0];
    const found = articleList.find((item) => item.id === selectedId);
    if (!found) {
      setSelected(null);
      return;
    }
    setSelected(found);
  }, [rowSelection, articleList, setSelected]);

  return (
    <MaterialTable
      columns={Columns({ control, errors })}
      getRowId={(originalRow) => originalRow.id}
      data={articleList}
      title="Liste des articles"
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
        columnPinning: { left: ["mrt-row-select", "nom"] },
      }}
      onEditingRowSave={async ({ exitEditingMode, row }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload = {
            nom: values.nom?.trim(),
          };
          await updateArticle({
            id: row.original.id,
            article: payload,
          });
          refreshList();
          reset({
            nom: "",
          });
          exitEditingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de mettre à jour l'article");
        }
      }}
      onCreatingRowSave={async ({ exitCreatingMode }) => {
        try {
          const isValid = await trigger();
          if (!isValid) return;
          const values = getValues();
          const payload = {
            nom: values.nom?.trim(),
          };
          await createArticle(payload);
          refreshList();
          reset({
            nom: "",
          });
          exitCreatingMode();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : undefined;
          toast.error(message ?? "Impossible de créer l'article");
        }
      }}
      onCreatingRowCancel={({ table }) => {
        reset({
          nom: "",
        });
        table.setCreatingRow(null);
      }}
      onEditingRowCancel={({ table }) => {
        reset({
          nom: "",
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
                  nom: row.original.nom,
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
