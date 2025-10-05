import { TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Control, Controller } from "react-hook-form";

import { GVECRealisationItem } from "@/store/gvecRealisation/type";

export default function Columns({
  control,
  errors,
}: {
  control: Control<any>;
  errors: any;
}) {
  const columns = useMemo<MRT_ColumnDef<GVECRealisationItem>[]>(
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
        accessorKey: "total_famangina",
        header: "Total famangina",
        Cell: ({ cell }) => (
          <Typography>
            {cell.getValue<number>()?.toLocaleString() || "0"}
          </Typography>
        ),
        Edit: () => (
          <Controller
            name="total_famangina"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Total famangina"
                type="number"
                fullWidth
                error={!!errors.total_famangina}
                helperText={errors.total_famangina?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "nb_novangina",
        header: "Nb novangina",
        Cell: ({ cell }) => (
          <Typography>
            {cell.getValue<number>()?.toLocaleString() || "0"}
          </Typography>
        ),
        Edit: () => (
          <Controller
            name="nb_novangina"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nb novangina"
                type="number"
                fullWidth
                error={!!errors.nb_novangina}
                helperText={errors.nb_novangina?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "total_caisse_sociale",
        header: "Total caisse sociale",
        Cell: ({ cell }) => (
          <Typography>
            {cell.getValue<number>()?.toLocaleString() || "0"}
          </Typography>
        ),
        Edit: () => (
          <Controller
            name="total_caisse_sociale"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Total caisse sociale"
                type="number"
                fullWidth
                error={!!errors.total_caisse_sociale}
                helperText={errors.total_caisse_sociale?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "total_remboursement",
        header: "Total remboursement",
        Cell: ({ cell }) => (
          <Typography>
            {cell.getValue<number>()?.toLocaleString() || "0"}
          </Typography>
        ),
        Edit: () => (
          <Controller
            name="total_remboursement"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Total remboursement"
                type="number"
                fullWidth
                error={!!errors.total_remboursement}
                helperText={errors.total_remboursement?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "total_interet",
        header: "Total intérêt",
        Cell: ({ cell }) => (
          <Typography>
            {cell.getValue<number>()?.toLocaleString() || "0"}
          </Typography>
        ),
        Edit: () => (
          <Controller
            name="total_interet"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Total intérêt"
                type="number"
                fullWidth
                error={!!errors.total_interet}
                helperText={errors.total_interet?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "nb_remboursant",
        header: "Nb remboursant",
        Cell: ({ cell }) => (
          <Typography>
            {cell.getValue<number>()?.toLocaleString() || "0"}
          </Typography>
        ),
        Edit: () => (
          <Controller
            name="nb_remboursant"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nb remboursant"
                type="number"
                fullWidth
                error={!!errors.nb_remboursant}
                helperText={errors.nb_remboursant?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "total_credit",
        header: "Total crédit",
        Cell: ({ cell }) => (
          <Typography>
            {cell.getValue<number>()?.toLocaleString() || "0"}
          </Typography>
        ),
        Edit: () => (
          <Controller
            name="total_credit"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Total crédit"
                type="number"
                fullWidth
                error={!!errors.total_credit}
                helperText={errors.total_credit?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "nb_octroye",
        header: "Nb octroyé",
        Cell: ({ cell }) => (
          <Typography>
            {cell.getValue<number>()?.toLocaleString() || "0"}
          </Typography>
        ),
        Edit: () => (
          <Controller
            name="nb_octroye"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nb octroyé"
                type="number"
                fullWidth
                error={!!errors.nb_octroye}
                helperText={errors.nb_octroye?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "total_caisse_epargne",
        header: "Total caisse épargne",
        Cell: ({ cell }) => (
          <Typography>
            {cell.getValue<number>()?.toLocaleString() || "0"}
          </Typography>
        ),
        Edit: () => (
          <Controller
            name="total_caisse_epargne"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Total caisse épargne"
                type="number"
                fullWidth
                error={!!errors.total_caisse_epargne}
                helperText={errors.total_caisse_epargne?.message}
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
