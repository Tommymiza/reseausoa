import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Control, Controller, useWatch } from "react-hook-form";

import { AccompagnementItem } from "@/store/accompagnement/type";
import categoryThemeStore from "@/store/categoryTheme";

const typeOptions = [
  { value: "ACCOMPAGNEMENT_SUIVI", label: "Accompagnement suivi" },
  { value: "VISITE_ECHANGE", label: "Visite échange" },
  { value: "FORMATION", label: "Formation" },
  { value: "ANIMATION_SENSIBILISATION", label: "Animation sensibilisation" },
];

// Fonction pour calculer l'âge à partir de la date de naissance
const calculateAge = (dateNaissance: string | null): number => {
  if (!dateNaissance) return 0;
  const today = new Date();
  const birthDate = new Date(dateNaissance);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

// Fonction pour compter les participants par catégorie
const countParticipants = (accompagnement: AccompagnementItem) => {
  if (
    !accompagnement.AccompagnementProd ||
    accompagnement.AccompagnementProd.length === 0
  ) {
    return { nbHommes: 0, nbFemmes: 0, nbJeunes: 0 };
  }

  let nbHommes = 0;
  let nbFemmes = 0;
  let nbJeunes = 0;

  accompagnement.AccompagnementProd.forEach((accompProd) => {
    const producteur = accompProd.Producteur;
    if (!producteur) return;

    const age = calculateAge(producteur.date_naissance);
    const isJeune = age > 0 && age <= 35; // Considérer comme jeune si <= 35 ans

    if (producteur.sexe === "homme") {
      nbHommes++;
    } else if (producteur.sexe === "femme") {
      nbFemmes++;
    }

    if (isJeune) {
      nbJeunes++;
    }
  });

  return { nbHommes, nbFemmes, nbJeunes };
};

export default function Columns({
  control,
  errors,
}: {
  control: Control<any>;
  errors: any;
}) {
  const { categoryThemeList } = categoryThemeStore();
  const activiteDeMasse = useWatch({ control, name: "activite_de_masse" });
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
        accessorKey: "existant",
        header: "Existant",
        Edit: () => (
          <Controller
            name="existant"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
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
        accessorKey: "solution",
        header: "Solution",
        Edit: () => (
          <Controller
            name="solution"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
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
                value={field.value ?? ""}
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
      {
        accessorKey: "activite_de_masse",
        header: "Activité de masse",
        Cell: ({ cell }) => (cell.getValue() ? "Oui" : "Non"),
        Edit: () => (
          <Controller
            name="activite_de_masse"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value ?? false}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Activité de masse"
              />
            )}
          />
        ),
      },
      {
        accessorKey: "nb_hommes",
        header: "Nb Hommes",
        enableHiding: true,
        columnVisibility: activiteDeMasse,
        Cell: ({ row }) => {
          const accompagnement = row.original;
          if (accompagnement.activite_de_masse) {
            return accompagnement.nb_hommes ?? 0;
          }
          const { nbHommes } = countParticipants(accompagnement);
          return nbHommes;
        },
        Edit: () =>
          activiteDeMasse ? (
            <Controller
              name="nb_hommes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  type="number"
                  fullWidth
                  variant="outlined"
                  label="Nombre d'hommes"
                  error={!!errors.nb_hommes}
                  helperText={errors.nb_hommes?.message}
                />
              )}
            />
          ) : null,
      },
      {
        accessorKey: "nb_femmes",
        header: "Nb Femmes",
        enableHiding: true,
        columnVisibility: activiteDeMasse,
        Cell: ({ row }) => {
          const accompagnement = row.original;
          if (accompagnement.activite_de_masse) {
            return accompagnement.nb_femmes ?? 0;
          }
          const { nbFemmes } = countParticipants(accompagnement);
          return nbFemmes;
        },
        Edit: () =>
          activiteDeMasse ? (
            <Controller
              name="nb_femmes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  type="number"
                  fullWidth
                  variant="outlined"
                  label="Nombre de femmes"
                  error={!!errors.nb_femmes}
                  helperText={errors.nb_femmes?.message}
                />
              )}
            />
          ) : null,
      },
      {
        accessorKey: "nb_jeunes",
        header: "Nb Jeunes",
        enableHiding: true,
        columnVisibility: activiteDeMasse,
        Cell: ({ row }) => {
          const accompagnement = row.original;
          if (accompagnement.activite_de_masse) {
            return accompagnement.nb_jeunes ?? 0;
          }
          const { nbJeunes } = countParticipants(accompagnement);
          return nbJeunes;
        },
        Edit: () =>
          activiteDeMasse ? (
            <Controller
              name="nb_jeunes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  type="number"
                  fullWidth
                  variant="outlined"
                  label="Nombre de jeunes"
                  error={!!errors.nb_jeunes}
                  helperText={errors.nb_jeunes?.message}
                />
              )}
            />
          ) : null,
      },
    ],
    [control, errors, categoryThemeList, activiteDeMasse]
  );

  return col;
}
