import oprStore from "@/store/opr";
import { UtilisateurItem } from "@/store/utilisateur/type";
import {
  Autocomplete,
  Chip,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
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
  const { oprList } = oprStore();
  const col = useMemo<MRT_ColumnDef<UtilisateurItem, any>[]>(
    () => [
      {
        accessorKey: "nom",
        header: "Nom",
        Edit: ({ table, cell }) => {
          return (
            <Controller
              name="nom"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="nom"
                  fullWidth
                  variant="outlined"
                  label="Nom"
                  error={!!errors.nom}
                  helperText={errors.nom ? errors.nom.message : ""}
                />
              )}
            />
          );
        },
      },
      {
        accessorKey: "prenom",
        header: "Prénom",
        Edit: ({ table, cell }) => {
          return (
            <Controller
              name="prenom"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="prenom"
                  fullWidth
                  variant="outlined"
                  label="Prénom"
                  error={!!errors.prenom}
                  helperText={errors.prenom ? errors.prenom.message : ""}
                />
              )}
            />
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        Edit: ({ table, cell }) => {
          return (
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="email"
                  fullWidth
                  variant="outlined"
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                />
              )}
            />
          );
        },
      },
      {
        accessorKey: "role",
        header: "Rôle",
        Cell: ({ cell }) => {
          return <Chip label={cell.getValue<string>()} />;
        },
        Edit: ({ table, cell }) => {
          return (
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  variant="outlined"
                  label="Rôle"
                  error={!!errors.role}
                  helperText={errors.role ? errors.role.message : ""}
                >
                  {["ADMIN", "USER"].map((role) => (
                    <MenuItem value={role} key={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          );
        },
      },
      {
        accessorKey: "password",
        header: "Mot de passe",
        accessorFn: () => "",
        Edit: ({ table, cell }) => {
          return (
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  fullWidth
                  variant="outlined"
                  label="Mot de passe"
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ""}
                />
              )}
            />
          );
        },
      },
      {
        accessorKey: "telephone",
        header: "Téléphone",
        Edit: ({ table, cell }) => {
          return (
            <Controller
              name="telephone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  fullWidth
                  variant="outlined"
                  label="Téléphone"
                  error={!!errors.telephone}
                  helperText={errors.telephone ? errors.telephone.message : ""}
                />
              )}
            />
          );
        },
      },
      {
        accessorKey: "opr_id",
        header: "OPR",
        Cell: ({ cell, row }) => (
          <Typography variant="body1">{row.original.Opr?.nom}</Typography>
        ),
        Edit: ({ table, cell }) => {
          return (
            <Controller
              name="opr_id"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  disablePortal
                  options={[{ id: null, nom: "Aucun" }, ...oprList]}
                  value={oprList.find((opr) => opr.id === field.value) || null}
                  isOptionEqualToValue={(option, value) =>
                    Number(option.id) === Number(value.id)
                  }
                  onChange={(_, newValue) =>
                    field.onChange(newValue ? Number(newValue.id) : undefined)
                  }
                  getOptionLabel={(option) => `${option.nom}`}
                  getOptionKey={(option) => option.nom?.toString()}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Opr"
                      error={!!errors.id_localisation}
                      helperText={errors.id_localisation?.message}
                    />
                  )}
                />
              )}
            />
          );
        },
      },
    ],
    [oprList, control, errors]
  );
  return col;
}
