import articleStore from "@/store/article";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

const articleSchema = Yup.object({
  nom: Yup.string().required("Nom requis"),
});

interface EditArticleDialogProps {
  open: boolean;
  onClose: () => void;
  articleId: number | null;
  onArticleUpdated: () => void;
}

export default function EditArticleDialog({
  open,
  onClose,
  articleId,
  onArticleUpdated,
}: EditArticleDialogProps) {
  const { updateArticle, getArticles, articleList } = articleStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(articleSchema),
    defaultValues: {
      nom: "",
    },
  });

  useEffect(() => {
    if (open && articleId) {
      const article = articleList.find((art) => art.id === articleId);
      if (article) {
        setValue("nom", article.nom);
      }
    }
  }, [open, articleId, articleList, setValue]);

  const onSubmit = async (data: { nom: string }) => {
    if (!articleId) return;

    try {
      await updateArticle({
        id: articleId,
        article: { nom: data.nom.trim() },
      });
      // Rafraîchir la liste des articles
      await getArticles({
        orderBy: {
          nom: "asc",
        },
      });
      toast.success("Article modifié avec succès");
      onArticleUpdated();
      reset();
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de modifier l'article");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Modifier l'article</DialogTitle>
        <DialogContent>
          <TextField
            {...register("nom")}
            label="Nom de l'article"
            fullWidth
            margin="normal"
            error={!!errors.nom}
            helperText={errors.nom?.message}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Modifier
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
