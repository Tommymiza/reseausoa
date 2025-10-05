import { Autocomplete, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Control, Controller } from "react-hook-form";

import { GVECItem } from "@/store/gvec/type";
import localisationStore from "@/store/localisation";

export default function Columns({
  control,
  errors,
}: {
  control: Control<any>;
  errors: any;
}) {
  const { localisationList } = localisationStore();

  const columns = useMemo<MRT_ColumnDef<GVECItem>[]>(
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
        accessorKey: "id_localisation",
        header: "Localisation",
        Cell: ({ row }) => (
          <Typography variant="body1">
            {row.original.Localisation?.nom}
          </Typography>
        ),
        Edit: () => (
          <Controller
            name="id_localisation"
            control={control}
            render={({ field }) => (
              <Autocomplete
                disablePortal={false}
                options={localisationList}
                value={
                  localisationList.find((l) => l.id === field.value) || null
                }
                isOptionEqualToValue={(opt, val) =>
                  Number(opt.id) === Number(val.id)
                }
                onChange={(_, newVal) =>
                  field.onChange(newVal ? Number(newVal.id) : undefined)
                }
                getOptionKey={(opt) => String(opt.id)}
                getOptionLabel={(option) =>
                  `${option.nom} - ${option.fokontany.commune.nom} (${option.fokontany.commune.district.region.nom})`
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Localisation"
                    error={!!errors.id_localisation}
                    helperText={errors.id_localisation?.message}
                  />
                )}
              />
            )}
          />
        ),
      },
    ],
    [control, errors, localisationList]
  );

  return columns;
}
