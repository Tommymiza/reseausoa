import { MenuItem, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Control, Controller } from "react-hook-form";

import { AccompagnementItem } from "@/store/accompagnement/type";
import categoryThemeStore from "@/store/categoryTheme";

const typeOptions = [
  { value: "ACCOMPAGNEMENT_SUIVI", label: "Accompagnement suivi" },
  { value: "VISITE_ECHANGE", label: "Visite échange" },
  { value: "FORMATION", label: "Formation" },
];

export default function Columns({
  control,
  errors,
}: {
  control: Control<any>;
  errors: any;
}) {
  const { categoryThemeList } = categoryThemeStore();
  const col = useMemo<MRT_ColumnDef<AccompagnementItem>[]>(
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
        accessorKey: "type",
        header: "Type",
        Cell: ({ cell }) => {
          const found = typeOptions.find(
            (option) => option.value === cell.getValue<string>()
          );
          return (
            <Typography>
              {found ? found.label : cell.getValue<string>()}
            </Typography>
          );
        },
        Edit: () => (
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                variant="outlined"
                label="Type"
                error={!!errors.type}
                helperText={errors.type?.message}
              >
                {typeOptions.map((option) => (
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
        accessorKey: "id_category_theme",
        header: "Catégorie",
        Cell: ({ row }) => (
          <Typography>
            {row.original.CategoryThemeAccompagnement?.nom ??
              row.original.id_category_theme}
          </Typography>
        ),
        Edit: () => (
          <Controller
            name="id_category_theme"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                type="number"
                fullWidth
                variant="outlined"
                label="Catégorie (ID)"
                error={!!errors.id_category_theme}
                helperText={errors.id_category_theme?.message}
              >
                {categoryThemeList.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.nom}
                  </MenuItem>
                ))}
              </TextField>
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
        accessorKey: "existant",
        header: "Existant",
        Edit: () => (
          <Controller
            name="existant"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                variant="outlined"
                label="Existant"
                error={!!errors.existant}
                helperText={errors.existant?.message}
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
        accessorKey: "solution",
        header: "Solution",
        Edit: () => (
          <Controller
            name="solution"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                variant="outlined"
                label="Solution"
                error={!!errors.solution}
                helperText={errors.solution?.message}
              />
            )}
          />
        ),
      },
      {
        accessorKey: "remarque",
        header: "Remarque",
        Edit: () => (
          <Controller
            name="remarque"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                variant="outlined"
                label="Remarque"
                error={!!errors.remarque}
                helperText={errors.remarque?.message}
              />
            )}
          />
        ),
      },
    ],
    [control, errors, categoryThemeList]
  );

  return col;
}
