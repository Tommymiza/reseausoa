import { Autocomplete, MenuItem, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Control, Controller } from "react-hook-form";

import producteurStore from "@/store/producteur";
import { ProducteurItem } from "@/store/producteur/type";
import { SanteAnimaleItem } from "@/store/santeAnimale/type";

const typeOptions = [
  { value: "Vaccination", label: "Vaccination" },
  { value: "Soin", label: "Soin" },
  { value: "Déparasitage", label: "Déparasitage" },
  { value: "Vitamine", label: "Vitamine" },
];

function getProducteurLabel(producteur?: ProducteurItem | null) {
  if (!producteur) return "";
  const parts = [producteur.nom, producteur.prenom].filter(Boolean);
  return parts.join(" ");
}

export default function Columns({
  control,
  errors,
}: {
  control: Control<any>;
  errors: any;
}) {
  const { producteurList } = producteurStore();

  const col = useMemo<MRT_ColumnDef<SanteAnimaleItem>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        Cell: ({ cell }) =>
          cell.getValue<string>()
            ? new Date(cell.getValue<string>()).toLocaleDateString()
            : "",
        Edit: () => (
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Date"
                value={field.value ? new Date(field.value) : null}
                onChange={(newValue) =>
                  field.onChange(newValue ? newValue.toISOString() : "")
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.date,
                    helperText: errors.date?.message,
                  },
                }}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        Cell: ({ cell }) => {
          const found = typeOptions.find(
            (option) => option.value === cell.getValue<string>()
          );
          return (
            <Typography>
              {found ? found.label : cell.getValue<string>()}
            </Typography>
          );
        },
        Edit: () => (
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                variant="outlined"
                label="Type"
                error={!!errors.type}
                helperText={errors.type?.message}
              >
                {typeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        ),
      },
      {
        accessorKey: "id_producteur",
        header: "Producteur",
        Cell: ({ row }) => {
          const producteur = row.original.Producteur;
          const label = getProducteurLabel(producteur ?? null);
          return (
            <Typography>
              {label || row.original.id_producteur || "Non renseigné"}
            </Typography>
          );
        },
        Edit: () => (
          <Controller
            name="id_producteur"
            control={control}
            render={({ field }) => (
              <Autocomplete
                disablePortal={false}
                options={producteurList}
                value={producteurList.find((l) => l.id === field.value) || null}
                isOptionEqualToValue={(opt, val) =>
                  Number(opt.id) === Number(val.id)
                }
                onChange={(_, newVal) =>
                  field.onChange(newVal ? Number(newVal.id) : undefined)
                }
                getOptionKey={(opt) => String(opt.id)}
                getOptionLabel={(option) => `${option.nom} ${option.prenom}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Producteur"
                    error={!!errors.id_producteur}
                    helperText={errors.id_producteur?.message}
                  />
                )}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "type_animale",
        header: "Type d'animal",
        Edit: () => (
          <Controller
            name="type_animale"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Type d'animal"
                error={!!errors.type_animale}
                helperText={errors.type_animale?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "nb_animaux",
        header: "Nb animaux",
        Edit: () => (
          <Controller
            name="nb_animaux"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                fullWidth
                variant="outlined"
                label="Nombre d'animaux"
                error={!!errors.nb_animaux}
                helperText={errors.nb_animaux?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "medicament_utilise",
        header: "Médicament",
        Edit: () => (
          <Controller
            name="medicament_utilise"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                fullWidth
                variant="outlined"
                label="Médicament utilisé"
                error={!!errors.medicament_utilise}
                helperText={errors.medicament_utilise?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "origine_medicament",
        header: "Origine",
        Edit: () => (
          <Controller
            name="origine_medicament"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                fullWidth
                variant="outlined"
                label="Origine médicament"
                error={!!errors.origine_medicament}
                helperText={errors.origine_medicament?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "lot",
        header: "Lot",
        Edit: () => (
          <Controller
            name="lot"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                fullWidth
                variant="outlined"
                label="Lot"
                error={!!errors.lot}
                helperText={errors.lot?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "dose_utilisee",
        header: "Dose",
        Edit: () => (
          <Controller
            name="dose_utilisee"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                fullWidth
                variant="outlined"
                label="Dose utilisée"
                error={!!errors.dose_utilisee}
                helperText={errors.dose_utilisee?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "pu_dose",
        header: "PU dose",
        Edit: () => (
          <Controller
            name="pu_dose"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                fullWidth
                variant="outlined"
                label="Prix unitaire dose"
                error={!!errors.pu_dose}
                helperText={errors.pu_dose?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "id_veternaire",
        header: "Vétérinaire",
        Cell: ({ row }) => {
          const veterinaire = row.original.Veterinaire;
          const label = getProducteurLabel(veterinaire ?? null);
          return <Typography>{label || "Non renseigné"}</Typography>;
        },
        Edit: () => (
          <Controller
            name="id_veternaire"
            control={control}
            render={({ field }) => (
              <Autocomplete
                disablePortal={false}
                options={producteurList}
                value={producteurList.find((l) => l.id === field.value) || null}
                isOptionEqualToValue={(opt, val) =>
                  Number(opt.id) === Number(val.id)
                }
                onChange={(_, newVal) =>
                  field.onChange(newVal ? Number(newVal.id) : null)
                }
                getOptionKey={(opt) => String(opt.id)}
                getOptionLabel={(option) => `${option.nom} ${option.prenom}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Vétérinaire (optionnel)"
                    error={!!errors.id_veternaire}
                    helperText={errors.id_veternaire?.message}
                  />
                )}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "autre",
        header: "Autre",
        Edit: () => (
          <Controller
            name="autre"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                fullWidth
                multiline
                variant="outlined"
                label="Autre information"
                error={!!errors.autre}
                helperText={errors.autre?.message}
              />
            )}
          />
        ),
      },
    ],
    [control, errors, producteurList]
  );

  return col;
}
