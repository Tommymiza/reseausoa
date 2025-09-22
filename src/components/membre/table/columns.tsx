import { OprItem } from "@/store/opr/type";
import { Chip } from "@mui/material";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";

export default function Columns() {
  const col = useMemo<MRT_ColumnDef<OprItem, any>[]>(
    () => [
      {
        accessorKey: "nom",
        header: "Nom",
      },
      {
        accessorKey: "prenom",
        header: "Prénom",
      },
      {
        accessorKey: "actif",
        header: "Actif",
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue() ? "Oui" : "Non"}
            color={cell.getValue() ? "success" : "error"}
          />
        ),
        muiEditTextFieldProps: {
          type: "checkbox",
        },
      },
      {
        accessorKey: "sexe",
        header: "Genre",
      },
      {
        accessorKey: "code",
        header: "Code",
      },

      {
        accessorKey: "annee_naissance",
        header: "Année de naissance",
      },
      {
        accessorKey: "cin",
        header: "CIN",
      },
      {
        accessorKey: "date_cin",
        header: "Date CIN",
      },
      {
        accessorKey: "lieu_cin",
        header: "Lieu CIN",
      },
      {
        accessorKey: "niveau_instruction",
        header: "Niveau d'instruction",
      },
      {
        accessorKey: "tel1",
        header: "Téléphone 1",
      },
      {
        accessorKey: "tel2",
        header: "Téléphone 2",
      },
      {
        accessorKey: "date_naissance",
        header: "Date de naissance",
      },
      {
        accessorKey: "marie",
        header: "Marié(e)",
      },
      {
        accessorKey: "nom_conjoint",
        header: "Nom du conjoint",
      },
      {
        accessorKey: "nb_enfant_a_charge_m",
        header: "Nb.Enf. M",
      },
      {
        accessorKey: "nb_enfant_a_charge_f",
        header: "Nb.Enf. F",
      },
      {
        accessorKey: "nom_chef_famille",
        header: "Nom chef de famille",
      },

      {
        accessorKey: "Localisation.nom",
        header: "Localisation",
      },
      {
        accessorKey: "date_entree_opb",
        header: "Date entrée OPB",
      },
    ],
    []
  );
  return col;
}
