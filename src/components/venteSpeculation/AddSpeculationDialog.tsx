import speculationStore from "@/store/speculation";
import { SpeculationType } from "@/store/speculation/type";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

const speculationSchema = Yup.object({
  nom: Yup.string().required("Nom requis"),
  type: Yup.string().required("Type requis"),
});

interface AddSpeculationDialogProps {
  open: boolean;
  onClose: () => void;
  onSpeculationAdded: (speculationId: number) => void;
}

export default function AddSpeculationDialog({
  open,
  onClose,
  onSpeculationAdded,
}: AddSpeculationDialogProps) {
  const { createSpeculation, getSpeculations } = speculationStore();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(speculationSchema),
    defaultValues: {
      nom: "",
      type: "",
    },
  });

  const onSubmit = async (data: { nom: string; type: string }) => {
    try {
      const newSpeculation = await createSpeculation({
        nom: data.nom.trim(),
        type: data.type as SpeculationType,
      });
      // Rafraîchir la liste des spéculations
      await getSpeculations({
        orderBy: {
          nom: "asc",
        },
      });
      toast.success("Spéculation créée avec succès");
      onSpeculationAdded(newSpeculation.id);
      reset();
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de créer la spéculation");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Ajouter une spéculation</DialogTitle>
        <DialogContent>
          <TextField
            {...register("nom")}
            label="Nom de la spéculation"
            fullWidth
            margin="normal"
            error={!!errors.nom}
            helperText={errors.nom?.message}
            autoFocus
          />
          <FormControl fullWidth margin="normal" error={!!errors.type}>
            <InputLabel>Type</InputLabel>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Type">
                  <MenuItem value="Agriculture">Agriculture</MenuItem>
                  <MenuItem value="Elevage">Élevage</MenuItem>
                  <MenuItem value="Artisanal">Artisanal</MenuItem>
                </Select>
              )}
            />
            {errors.type && (
              <FormHelperText>{errors.type.message}</FormHelperText>
            )}
          </FormControl>
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
