import { MenuItem, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";

import { SuiviJeuneItem } from "@/store/suiviJeune/type";
import type { FormValues } from "../List";

const typeAccompagnateurOptions = [
  { value: "Technicien", label: "Technicien" },
  { value: "Parrain", label: "Parrain" },
] as const;

export default function Columns({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
}) {
  const columns = useMemo<MRT_ColumnDef<SuiviJeuneItem>[]>(
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
        accessorKey: "type_accompagnateur",
        header: "Type d'accompagnateur",
        Cell: ({ cell }) => (
          <Typography>{cell.getValue<string>() ?? ""}</Typography>
        ),
        Edit: () => (
          <Controller
            name="type_accompagnateur"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                variant="outlined"
                label="Type d'accompagnateur"
                value={field.value ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  field.onChange(value === "" ? null : value);
                }}
                error={!!errors.type_accompagnateur}
                helperText={errors.type_accompagnateur?.message}
              >
                <MenuItem value="">Non défini</MenuItem>
                {typeAccompagnateurOptions.map((option) => (
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
        accessorKey: "deroulement",
        header: "Déroulement",
        Edit: () => (
          <Controller
            name="deroulement"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                variant="outlined"
                label="Déroulement"
                error={!!errors.deroulement}
                helperText={errors.deroulement?.message}
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
