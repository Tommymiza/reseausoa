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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

const articleSchema = Yup.object({
  nom: Yup.string().required("Nom requis"),
});

interface AddArticleDialogProps {
  open: boolean;
  onClose: () => void;
  onArticleAdded: (articleId: number) => void;
}

export default function AddArticleDialog({
  open,
  onClose,
  onArticleAdded,
}: AddArticleDialogProps) {
  const { createArticle, getArticles } = articleStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(articleSchema),
    defaultValues: {
      nom: "",
    },
  });

  const onSubmit = async (data: { nom: string }) => {
    try {
      const newArticle = await createArticle({ nom: data.nom.trim() });
      // Rafraîchir la liste des articles
      await getArticles({
        orderBy: {
          nom: "asc",
        },
      });
      toast.success("Article créé avec succès");
      onArticleAdded(newArticle.id);
      reset();
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de créer l'article");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Ajouter un article</DialogTitle>
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
            Créer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
