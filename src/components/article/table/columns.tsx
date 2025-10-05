import { TextField, Typography } from "@mui/material";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Control, Controller } from "react-hook-form";

import { ArticleItem } from "@/store/article/type";

export default function Columns({
  control,
  errors,
}: {
  control: Control<any>;
  errors: any;
}) {
  const columns = useMemo<MRT_ColumnDef<ArticleItem>[]>(
    () => [
      {
        accessorKey: "nom",
        header: "Nom",
        Cell: ({ cell }) => (
          <Typography>{cell.getValue<string>() || "Non renseigné"}</Typography>
        ),
        Edit: () => (
          <Controller
            name="nom"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nom"
                fullWidth
                error={!!errors.nom}
                helperText={errors.nom?.message}
              />
            )}
          />
        ),
      },
    ],
    [control, errors]
  );

  return columns;
}
