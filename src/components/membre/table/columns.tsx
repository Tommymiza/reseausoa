import localisationStore from "@/store/localisation";
import opbStore from "@/store/opb";
import {
  Autocomplete,
  Checkbox,
  Chip,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Control, Controller } from "react-hook-form";

export default function Columns({
  control,
  errors,
}: {
  control: Control<any, any>;
  errors: any;
}) {
  const { localisationList } = localisationStore();
  const { opbList } = opbStore();
  const col = useMemo<MRT_ColumnDef<any, any>[]>(
    () => [
      {
        accessorKey: "nom",
        header: "Nom",
        Edit: () => (
          <Controller
            name="nom"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Nom"
                error={!!errors.nom}
                helperText={errors.nom?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "prenom",
        header: "Prénom",
        Edit: () => (
          <Controller
            name="prenom"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Prénom"
                error={!!errors.prenom}
                helperText={errors.prenom?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "actif",
        header: "Actif",
        Cell: ({ cell }) => <Checkbox checked={!!cell.getValue<boolean>()} />,
        Edit: () => (
          <Controller
            name="actif"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Actif"
              />
            )}
          />
        ),
      },
      {
        accessorKey: "id_localisation",
        header: "Localisation",
        Cell: ({ row }) => (
          <Typography variant="body1">
            {row.original.Localisation?.nom}
          </Typography>
        ),
        Edit: () => (
          <Controller
            name="id_localisation"
            control={control}
            render={({ field }) => (
              <Autocomplete
                disablePortal={false}
                options={localisationList}
                value={
                  localisationList.find((l) => l.id === field.value) || null
                }
                isOptionEqualToValue={(opt, val) =>
                  Number(opt.id) === Number(val.id)
                }
                onChange={(_, newVal) =>
                  field.onChange(newVal ? Number(newVal.id) : undefined)
                }
                getOptionKey={(opt) => String(opt.id)}
                getOptionLabel={(option) =>
                  `${option.nom} - ${option.fokontany.commune.nom} (${option.fokontany.commune.district.region.nom})`
                }
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
        ),
      },
      {
        accessorKey: "sexe",
        header: "Sexe",
        Cell: ({ cell }) => <Chip label={cell.getValue<string>()} />,
        Edit: () => (
          <Controller
            name="sexe"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                variant="outlined"
                label="Sexe"
                error={!!errors.sexe}
                helperText={errors.sexe?.message}
              >
                {["homme", "femme"].map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        ),
      },
      {
        accessorKey: "cin",
        header: "CIN",
        Edit: () => (
          <Controller
            name="cin"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="CIN"
                error={!!errors.cin}
                helperText={errors.cin?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "date_cin",
        header: "Date CIN",
        Cell: ({ cell }) =>
          cell.getValue<string>()
            ? new Date(cell.getValue<string>()).toLocaleDateString()
            : "",
        Edit: () => (
          <Controller
            name="date_cin"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Date CIN"
                value={field.value ? new Date(field.value) : null}
                onChange={(newValue) =>
                  field.onChange(newValue ? newValue.toISOString() : "")
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.date_cin,
                    helperText: errors.date_cin?.message,
                  },
                }}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "lieu_cin",
        header: "Lieu CIN",
        Edit: () => (
          <Controller
            name="lieu_cin"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Lieu CIN"
                error={!!errors.lieu_cin}
                helperText={errors.lieu_cin?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "date_naissance",
        header: "Date de naissance",
        Cell: ({ cell }) =>
          cell.getValue<string>()
            ? new Date(cell.getValue<string>()).toLocaleDateString()
            : "",
        Edit: () => (
          <Controller
            name="date_naissance"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Date de naissance"
                value={field.value ? new Date(field.value) : null}
                onChange={(newValue) =>
                  field.onChange(newValue ? newValue.toISOString() : "")
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.date_naissance,
                    helperText: errors.date_naissance?.message,
                  },
                }}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "annee_naissance",
        header: "Année de naissance",
        Edit: () => (
          <Controller
            name="annee_naissance"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                fullWidth
                variant="outlined"
                label="Année de naissance"
                disabled
                error={!!errors.annee_naissance}
                helperText={errors.annee_naissance?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "niveau_instruction",
        header: "Niveau d'instruction",
        Edit: () => (
          <Controller
            name="niveau_instruction"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Niveau d'instruction"
                error={!!errors.niveau_instruction}
                helperText={errors.niveau_instruction?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "tel1",
        header: "Téléphone 1",
        Edit: () => (
          <Controller
            name="tel1"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Téléphone 1"
                error={!!errors.tel1}
                helperText={errors.tel1?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "tel2",
        header: "Téléphone 2",
        Edit: () => (
          <Controller
            name="tel2"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Téléphone 2"
                error={!!errors.tel2}
                helperText={errors.tel2?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "marie",
        header: "Marié(e)",
        Cell: ({ cell }) => <Checkbox checked={!!cell.getValue<boolean>()} />,
        Edit: () => (
          <Controller
            name="marie"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Marié(e)"
              />
            )}
          />
        ),
      },
      {
        accessorKey: "nom_conjoint",
        header: "Nom du conjoint",
        Edit: () => (
          <Controller
            name="nom_conjoint"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Nom du conjoint"
                error={!!errors.nom_conjoint}
                helperText={errors.nom_conjoint?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "nb_enfant_a_charge_m",
        header: "Enfants à charge (M)",
        Edit: () => (
          <Controller
            name="nb_enfant_a_charge_m"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                fullWidth
                variant="outlined"
                label="Nb enfants garçons"
                error={!!errors.nb_enfant_a_charge_m}
                helperText={errors.nb_enfant_a_charge_m?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "nb_enfant_a_charge_f",
        header: "Enfants à charge (F)",
        Edit: () => (
          <Controller
            name="nb_enfant_a_charge_f"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                fullWidth
                variant="outlined"
                label="Nb enfants filles"
                error={!!errors.nb_enfant_a_charge_f}
                helperText={errors.nb_enfant_a_charge_f?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "nom_chef_famille",
        header: "Chef de famille",
        Edit: () => (
          <Controller
            name="nom_chef_famille"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Nom chef famille"
                error={!!errors.nom_chef_famille}
                helperText={errors.nom_chef_famille?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "date_entree_opb",
        header: "Date d'entrée OPB",
        Cell: ({ cell }) =>
          cell.getValue<string>()
            ? new Date(cell.getValue<string>()).toLocaleDateString()
            : "",
        Edit: () => (
          <Controller
            name="date_entree_opb"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Date d'entrée OPB"
                value={field.value ? new Date(field.value) : null}
                onChange={(newValue) =>
                  field.onChange(newValue ? newValue.toISOString() : "")
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.date_entree_opb,
                    helperText: errors.date_entree_opb?.message,
                  },
                }}
              />
            )}
          />
        ),
      },
    ],
    [control, errors, localisationList, opbList]
  );

  return col;
}
