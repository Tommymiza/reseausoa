import { TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Control, Controller } from "react-hook-form";

import { GVECCycleItem } from "@/store/gvecCycle/type";

export default function Columns({
  control,
  errors,
}: {
  control: Control<any>;
  errors: any;
}) {
  const columns = useMemo<MRT_ColumnDef<GVECCycleItem>[]>(
    () => [
      {
        accessorKey: "numero",
        header: "Numéro",
        Cell: ({ cell }) => (
          <Typography>{cell.getValue<number>() || "Non renseigné"}</Typography>
        ),
        Edit: () => (
          <Controller
            name="numero"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Numéro"
                type="number"
                fullWidth
                error={!!errors.numero}
                helperText={errors.numero?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "date_debut",
        header: "Date début",
        Cell: ({ cell }) =>
          cell.getValue<string>()
            ? new Date(cell.getValue<string>()).toLocaleDateString()
            : "",
        Edit: () => (
          <Controller
            name="date_debut"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Date début"
                value={field.value ? new Date(field.value) : null}
                onChange={(newValue) =>
                  field.onChange(newValue ? newValue.toISOString() : "")
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.date_debut,
                    helperText: errors.date_debut?.message,
                  },
                }}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "date_fin",
        header: "Date fin",
        Cell: ({ cell }) =>
          cell.getValue<string>()
            ? new Date(cell.getValue<string>()).toLocaleDateString()
            : "",
        Edit: () => (
          <Controller
            name="date_fin"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Date fin"
                value={field.value ? new Date(field.value) : null}
                onChange={(newValue) =>
                  field.onChange(newValue ? newValue.toISOString() : "")
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.date_fin,
                    helperText: errors.date_fin?.message,
                  },
                }}
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
                error={!!errors.montant_part}
                helperText={errors.montant_part?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "montant_cotisation",
        header: "Montant cotisation",
        Cell: ({ cell }) => (
          <Typography>
            {cell.getValue<number>()?.toLocaleString() || "0"}
          </Typography>
        ),
        Edit: () => (
          <Controller
            name="montant_cotisation"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Montant cotisation"
                type="number"
                fullWidth
                error={!!errors.montant_cotisation}
                helperText={errors.montant_cotisation?.message}
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
