import {
  SPECULATION_TYPES,
  type SpeculationItem,
  type SpeculationType,
} from "@/store/speculation/type";
import { Chip, MenuItem, TextField } from "@mui/material";
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
  const columns = useMemo<MRT_ColumnDef<SpeculationItem, any>[]>(
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
                label="Nom"
                fullWidth
                variant="outlined"
                error={!!errors.nom}
                helperText={errors.nom?.message ?? ""}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        Cell: ({ cell }) => <Chip label={cell.getValue<SpeculationType>()} />,
        Edit: () => (
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Type"
                fullWidth
                variant="outlined"
                error={!!errors.type}
                helperText={errors.type?.message ?? ""}
              >
                {SPECULATION_TYPES.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        ),
      },
    ],
    [control, errors]
  );

  return columns;
}
