import { TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Control, Controller } from "react-hook-form";

import { CommercialisationItem } from "@/store/commercialisation/type";

export default function Columns({
  control,
  errors,
  showOprColumn = true,
}: {
  control: Control<any>;
  errors: any;
  showOprColumn?: boolean;
}) {
  const columns = useMemo<MRT_ColumnDef<CommercialisationItem>[]>(
    () =>
      (
        [
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
            accessorKey: "partenaire",
            header: "Partenaire",
            Cell: ({ cell }) => (
              <Typography>
                {cell.getValue<string>() || "Non renseigné"}
              </Typography>
            ),
            Edit: () => (
              <Controller
                name="partenaire"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Partenaire"
                    fullWidth
                    error={!!errors.partenaire}
                    helperText={errors.partenaire?.message}
                  />
                )}
              />
            ),
          },
          {
            accessorKey: "id_opr",
            header: "OPR",
            Cell: ({ row }) => (
              <Typography>
                {row.original.OPR?.nom ||
                  row.original.id_opr ||
                  "Non renseigné"}
              </Typography>
            ),
          },
        ] as MRT_ColumnDef<CommercialisationItem>[]
      ).filter((col) => {
        // Masquer la colonne OPR si showOprColumn est false
        if (!showOprColumn && col.accessorKey === "id_opr") {
          return false;
        }
        return true;
      }),
    [control, errors, showOprColumn]
  );

  return columns;
}
