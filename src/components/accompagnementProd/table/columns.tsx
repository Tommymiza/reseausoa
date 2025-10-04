import { Autocomplete, TextField, Typography } from "@mui/material";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";

import { AccompagnementProdItem } from "@/store/accompagnementProd/type";
import producteurStore from "@/store/producteur";
import { ProducteurItem } from "@/store/producteur/type";
import type { FormValues } from "../List";

function getProducteurLabel(producteur?: ProducteurItem | null) {
  if (!producteur) return "";
  const parts = [producteur.nom, producteur.prenom].filter(Boolean);
  return parts.join(" ");
}

export default function Columns({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
}) {
  const { producteurList } = producteurStore();
  const columns = useMemo<MRT_ColumnDef<AccompagnementProdItem>[]>(
    () => [
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
    ],
    [control, errors, producteurList]
  );

  return columns;
}
