import { Autocomplete, MenuItem, TextField, Typography } from "@mui/material";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Control, Controller } from "react-hook-form";

import { GVECFinCycleItem } from "@/store/gvecFinCycle/type";
import producteurStore from "@/store/producteur";
import { ProducteurItem } from "@/store/producteur/type";

const FONCTION_OPTIONS = [
  { value: "FILOHA", label: "FILOHA" },
  { value: "SEKRETERA", label: "SEKRETERA" },
  { value: "TRESORIER", label: "TRESORIER" },
  { value: "MPANISA_VOLA_1", label: "MPANISA VOLA 1" },
  { value: "MPANISA_VOLA_2", label: "MPANISA VOLA 2" },
  { value: "MPIKAMBANA", label: "MPIKAMBANA" },
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

  const columns = useMemo<MRT_ColumnDef<GVECFinCycleItem>[]>(
    () => [
      {
        accessorKey: "id_producteur",
        header: "Producteur",
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
        accessorKey: "fonction",
        header: "Fonction",
        Cell: ({ cell }) => {
          const val = cell.getValue<string>();
          const found = FONCTION_OPTIONS.find((opt) => opt.value === val);
          return (
            <Typography>{found?.label || val || "Non renseigné"}</Typography>
          );
        },
        Edit: () => (
          <Controller
            name="fonction"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Fonction"
                fullWidth
                error={!!errors.fonction}
                helperText={errors.fonction?.message}
              >
                {FONCTION_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        ),
      },
      {
        accessorKey: "nb_part",
        header: "Nb part",
        Cell: ({ cell }) => (
          <Typography>
            {cell.getValue<number>()?.toLocaleString() || "0"}
          </Typography>
        ),
        Edit: () => (
          <Controller
            name="nb_part"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nb part"
                type="number"
                fullWidth
                error={!!errors.nb_part}
                helperText={errors.nb_part?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "montant_part",
        header: "Montant part",
        Cell: ({ cell }) => (
          <Typography>
            {cell.getValue<number>()?.toLocaleString() || "0"}
          </Typography>
        ),
        Edit: () => (
          <Controller
            name="montant_part"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Montant part"
                type="number"
                fullWidth
                disabled
                error={!!errors.montant_part}
                helperText={errors.montant_part?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "montant_interet",
        header: "Montant intérêt",
        Cell: ({ cell }) => (
          <Typography>
            {cell.getValue<number>()?.toLocaleString() || "0"}
          </Typography>
        ),
        Edit: () => (
          <Controller
            name="montant_interet"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Montant intérêt"
                type="number"
                fullWidth
                error={!!errors.montant_interet}
                helperText={errors.montant_interet?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "montant_total",
        header: "Montant total",
        Cell: ({ cell }) => (
          <Typography>
            {cell.getValue<number>()?.toLocaleString() || "0"}
          </Typography>
        ),
        Edit: () => (
          <Controller
            name="montant_total"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Montant total"
                type="number"
                disabled
                fullWidth
                error={!!errors.montant_total}
                helperText={errors.montant_total?.message}
              />
            )}
          />
        ),
      },
    ],
    [control, errors, producteurList]
  );

  return columns;
}
