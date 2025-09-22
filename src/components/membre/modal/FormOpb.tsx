import localisationStore from "@/store/localisation";
import opbStore from "@/store/opb";
import { OpbItem } from "@/store/opb/type";
import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Button, Grid, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  nom: yup.string().required("Le nom est requis"),
  code: yup.string().required("Le code est requis"),
  lieu_siege: yup.string().required("Lieu siège est requis"),
  recepisse: yup.string().optional(),
  date_recepisse: yup.string().optional(),
  date_creation: yup.string().required("Date de création est requis"),
  date_entree_opr: yup.string().required("Date d'entrée à l'OPR est requis"),
  objet_opb: yup.string().optional(),
  recu_opr: yup.string().optional(),
  montant_opr: yup.number().optional(),
  id_opr: yup.number().required("L'OPR est requis"),
  id_localisation: yup.number().required("La localisation est requise"),
});
type FormValues = yup.InferType<typeof schema>;

export default function FormOpb({
  setOpen,
  setEdit,
  edit,
  id_opr,
}: {
  setOpen: (open: boolean) => void;
  setEdit: (edit: OpbItem | null) => void;
  edit: OpbItem | null;
  id_opr: number;
}) {
  const { createOpb, updateOpb } = opbStore();
  const { getLocalisations, localisationList } = localisationStore();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nom: "",
      code: "",
      lieu_siege: "",
      recepisse: "",
      date_creation: "",
      date_recepisse: "",
      id_opr: id_opr,
      objet_opb: "",
      date_entree_opr: "",
      recu_opr: "",
      montant_opr: undefined,
      id_localisation: undefined,
    },
  });

  const handleClose = () => {
    setOpen(false);
    setEdit(null);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      if (edit) {
        await updateOpb({ id: edit.id, opb: data });
        handleClose();
        return;
      }
      await createOpb(data);
      handleClose();
    } catch (error) {
      console.error("Erreur lors de la création :", error);
    }
  };

  useEffect(() => {
    getLocalisations();
  }, []);

  useEffect(() => {
    if (edit) {
      reset({
        nom: edit.nom ?? "",
        code: edit.code ?? "",
        lieu_siege: edit.lieu_siege ?? "",
        recepisse: edit.recepisse ?? "",
        date_creation: edit.date_creation ?? "",
        date_recepisse: edit.date_recepisse ?? "",
        id_localisation: edit.id_localisation ?? undefined,
        id_opr: edit.id_opr,
        objet_opb: edit.objet_opb ?? "",
        date_entree_opr: edit.date_entree_opr ?? "",
        recu_opr: edit.recu_opr ?? "",
        montant_opr: edit.montant_opr ?? undefined,
      });
    }
  }, [edit]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} paddingY={4}>
        <Controller
          name="nom"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nom"
              error={!!errors.nom}
              helperText={errors.nom?.message}
            />
          )}
        />
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Code"
              error={!!errors.code}
              helperText={errors.code?.message}
            />
          )}
        />
        <Controller
          name="lieu_siege"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Lieu siège"
              error={!!errors.lieu_siege}
              helperText={errors.lieu_siege?.message}
            />
          )}
        />
        <Controller
          name="date_creation"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Date de création"
              value={field.value ? new Date(field.value) : null}
              onChange={(newValue) =>
                field.onChange(newValue ? newValue.toISOString() : "")
              }
              slotProps={{
                textField: {
                  error: !!errors.date_creation,
                  helperText: errors.date_creation?.message,
                },
              }}
            />
          )}
        />
        <Grid container spacing={2}>
          <Grid size={6}>
            <Controller
              name="recepisse"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Récepissé"
                  fullWidth
                  error={!!errors.recepisse}
                  helperText={errors.recepisse?.message}
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              name="date_recepisse"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Date de récépissé"
                  value={field.value ? new Date(field.value) : null}
                  onChange={(newValue) =>
                    field.onChange(newValue ? newValue.toISOString() : "")
                  }
                  sx={{ width: "100%" }}
                  slotProps={{
                    textField: {
                      error: !!errors.date_recepisse,
                      helperText: errors.date_recepisse?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Controller
              name="montant_opr"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Montant OPR"
                  fullWidth
                  type="number"
                  error={!!errors.montant_opr}
                  helperText={errors.montant_opr?.message}
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              name="date_entree_opr"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Date d'entrée à l'OPR"
                  value={field.value ? new Date(field.value) : null}
                  onChange={(newValue) =>
                    field.onChange(newValue ? newValue.toISOString() : "")
                  }
                  sx={{ width: "100%" }}
                  slotProps={{
                    textField: {
                      error: !!errors.date_entree_opr,
                      helperText: errors.date_entree_opr?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
        <Controller
          name="objet_opb"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Objet OPB"
              error={!!errors.objet_opb}
              helperText={errors.objet_opb?.message}
            />
          )}
        />

        <Controller
          name="id_localisation"
          control={control}
          render={({ field }) => (
            <Autocomplete
              disablePortal
              options={localisationList}
              value={
                localisationList.find((loc) => loc.id === field.value) || null
              }
              isOptionEqualToValue={(option, value) =>
                Number(option.id) === Number(value.id)
              }
              onChange={(_, newValue) =>
                field.onChange(newValue ? Number(newValue.id) : undefined)
              }
              getOptionLabel={(option) => option.nom}
              getOptionKey={(option) => option.id.toString()}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Localisation"
                  error={!!errors.id_localisation}
                  helperText={errors.id_localisation?.message}
                />
              )}
            />
          )}
        />

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button type="submit" variant="contained">
            {edit ? "Modifier" : "Créer"}
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Annuler
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
