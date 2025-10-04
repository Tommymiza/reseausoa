import { Autocomplete, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Control, Controller } from "react-hook-form";

import { JeuneItem } from "@/store/jeune/type";
import producteurStore from "@/store/producteur";
import { ProducteurItem } from "@/store/producteur/type";
import speculationStore from "@/store/speculation";
import { SpeculationItem } from "@/store/speculation/type";

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
  const { speculationList } = speculationStore();

  const columns = useMemo<MRT_ColumnDef<JeuneItem>[]>(
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
        accessorKey: "id_producteur",
        header: "Jeune",
        Cell: ({ row }) => {
          const label = getProducteurLabel(row.original.Producteur ?? null);
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
                options={producteurList}
                value={
                  producteurList.find((prod) => prod.id === field.value) || null
                }
                onChange={(_, newVal) =>
                  field.onChange(newVal ? Number(newVal.id) : 0)
                }
                isOptionEqualToValue={(opt, val) =>
                  Number(opt.id) === Number(val.id)
                }
                getOptionLabel={(option) => getProducteurLabel(option)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Jeune"
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
        accessorKey: "id_parrain",
        header: "Parrain",
        Cell: ({ row }) => {
          const label = getProducteurLabel(row.original.Parrain ?? null);
          return (
            <Typography>
              {label || row.original.id_parrain || "Non renseigné"}
            </Typography>
          );
        },
        Edit: () => (
          <Controller
            name="id_parrain"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={producteurList}
                value={
                  producteurList.find((prod) => prod.id === field.value) || null
                }
                onChange={(_, newVal) =>
                  field.onChange(newVal ? Number(newVal.id) : null)
                }
                isOptionEqualToValue={(opt, val) =>
                  Number(opt.id) === Number(val.id)
                }
                getOptionLabel={(option) => getProducteurLabel(option)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Parrain"
                    error={!!errors.id_parrain}
                    helperText={errors.id_parrain?.message}
                  />
                )}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "titre_projet",
        header: "Titre du projet",
        Cell: ({ cell }) => (
          <Typography>{cell.getValue<string>() ?? ""}</Typography>
        ),
        Edit: () => (
          <Controller
            name="titre_projet"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Titre du projet"
                error={!!errors.titre_projet}
                helperText={errors.titre_projet?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "montant_apport",
        header: "Montant apport",
        Cell: ({ cell }) => {
          const value = cell.getValue<number | null>();
          return (
            <Typography>
              {value === null || value === undefined
                ? ""
                : value.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
            </Typography>
          );
        },
        Edit: () => (
          <Controller
            name="montant_apport"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                value={field.value ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  field.onChange(value === "" ? null : Number(value));
                }}
                fullWidth
                variant="outlined"
                label="Montant apport"
                error={!!errors.montant_apport}
                helperText={errors.montant_apport?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "montant_subvention",
        header: "Montant subvention",
        Cell: ({ cell }) => {
          const value = cell.getValue<number | null>();
          return (
            <Typography>
              {value === null || value === undefined
                ? ""
                : value.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
            </Typography>
          );
        },
        Edit: () => (
          <Controller
            name="montant_subvention"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                value={field.value ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  field.onChange(value === "" ? null : Number(value));
                }}
                fullWidth
                variant="outlined"
                label="Montant subvention"
                error={!!errors.montant_subvention}
                helperText={errors.montant_subvention?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "id_speculation",
        header: "Spéculation",
        Cell: ({ row }) => (
          <Typography>
            {row.original.Speculation?.nom ??
              speculationList.find(
                (item) => item.id === row.original.id_speculation
              )?.nom ??
              row.original.id_speculation ??
              ""}
          </Typography>
        ),
        Edit: () => (
          <Controller
            name="id_speculation"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={speculationList}
                value={
                  speculationList.find(
                    (speculation) => speculation.id === field.value
                  ) || null
                }
                onChange={(_, newValue) =>
                  field.onChange(newValue ? Number(newValue.id) : null)
                }
                isOptionEqualToValue={(option, value) =>
                  Number(option.id) === Number(value.id)
                }
                getOptionLabel={(option: SpeculationItem) => option.nom}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Spéculation"
                    error={!!errors.id_speculation}
                    helperText={errors.id_speculation?.message}
                  />
                )}
              />
            )}
          />
        ),
      },
    ],
    [control, errors, producteurList, speculationList]
  );

  return columns;
}
