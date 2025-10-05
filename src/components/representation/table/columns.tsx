import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Control, Controller } from "react-hook-form";

import { RepresentationItem } from "@/store/representation/type";

export default function Columns({
  control,
  errors,
}: {
  control: Control<any>;
  errors: any;
}) {
  const col = useMemo<MRT_ColumnDef<RepresentationItem>[]>(
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
        accessorKey: "duree",
        header: "Durée (j)",
        Edit: () => (
          <Controller
            name="duree"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                type="number"
                fullWidth
                variant="outlined"
                label="Durée (jour)"
                error={!!errors.duree}
                helperText={errors.duree?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "theme",
        header: "Thème",
        Edit: () => (
          <Controller
            name="theme"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Thème"
                error={!!errors.theme}
                helperText={errors.theme?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "problematique",
        header: "Problématique",
        Edit: () => (
          <Controller
            name="problematique"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                fullWidth
                multiline
                variant="outlined"
                label="Problématique"
                error={!!errors.problematique}
                helperText={errors.problematique?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "positionnement",
        header: "Positionnement",
        Edit: () => (
          <Controller
            name="positionnement"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                fullWidth
                multiline
                variant="outlined"
                label="Positionnement"
                error={!!errors.positionnement}
                helperText={errors.positionnement?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "resultat",
        header: "Résultat",
        Edit: () => (
          <Controller
            name="resultat"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                fullWidth
                multiline
                variant="outlined"
                label="Résultat"
                error={!!errors.resultat}
                helperText={errors.resultat?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "suite_a_donner",
        header: "Suite à donner",
        Edit: () => (
          <Controller
            name="suite_a_donner"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                fullWidth
                multiline
                variant="outlined"
                label="Suite à donner"
                error={!!errors.suite_a_donner}
                helperText={errors.suite_a_donner?.message}
              />
            )}
          />
        ),
      },
    ],
    [control, errors]
  );

  return col;
}
