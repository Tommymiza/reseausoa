"use client";
import { canActivate } from "@/lib/canActivate";
import producteurStore from "@/store/producteur";
import { ProducteurItem } from "@/store/producteur/type";
import { yupResolver } from "@hookform/resolvers/yup";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { Box, IconButton, Stack, styled } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";
import MaterialTable from "../table/MaterialTable";
import Opb from "./modal/Opb";
import Opr from "./modal/Opr";
import Columns from "./table/columns";

const schema = Yup.object().shape({
  nom: Yup.string().required("Nom requis"),
  prenom: Yup.string().nullable(),
  sexe: Yup.string()
    .oneOf(["homme", "femme"], "Sexe invalide")
    .required("Sexe requis"),
  annee_naissance: Yup.number()
    .required("Année de naissance requis")
    .min(1900, "Année invalide")
    .max(new Date().getFullYear(), "Année invalide"),
  cin: Yup.string()
    .nullable()
    .matches(/^[0-9]{12}$/, "CIN doit contenir 12 chiffres"),
  date_cin: Yup.date().nullable().typeError("Date CIN invalide"),
  niveau_instruction: Yup.string().nullable(),
  lieu_cin: Yup.string().nullable(),
  tel1: Yup.string().nullable().length(10, "Téléphone invalide"),
  tel2: Yup.string().nullable(),
  date_naissance: Yup.string().required("Date de naissance requise"),
  marie: Yup.boolean().required("Statut marital requis"),
  nom_conjoint: Yup.string().when("marie", {
    is: true,
    then: (schema) => schema.required("Nom du conjoint requis"),
    otherwise: (schema) => schema.nullable().optional(),
  }),
  nb_enfant_a_charge_m: Yup.number().nullable().min(0, "Nombre invalide"),
  nb_enfant_a_charge_f: Yup.number().nullable().min(0, "Nombre invalide"),
  nom_chef_famille: Yup.string().nullable(),
  actif: Yup.boolean().required("Actif requis"),
  date_entree_opb: Yup.string().required("Date d'entrée requise"),
  id_localisation: Yup.number().required("Localisation requise"),
  id_opb: Yup.number().required("OPB requis"),
});

const numericFields = [
  "annee_naissance",
  "nb_enfant_a_charge_m",
  "nb_enfant_a_charge_f",
  "id_localisation",
  "id_opb",
] as const;

const parseNumber = (value: unknown) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const normaliseNumericFields = (values: Record<string, unknown>) => {
  const result = { ...values } as Record<string, unknown>;
  numericFields.forEach((field) => {
    result[field] = parseNumber(values[field]);
  });
  return result;
};

export default function ListOpr() {
  const searchParams = useSearchParams();
  const filterOpb = searchParams.get("id_opb");

  const {
    producteurList,
    deleteProducteur,
    getProducteurs,
    createProducteur,
    updateProducteur,
    loading,
    clearList,
  } = producteurStore();

  const {
    control,
    trigger,
    watch,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      nom: "",
      prenom: "",
      sexe: "homme",
      annee_naissance: undefined,
      cin: "",
      date_cin: undefined,
      niveau_instruction: "",
      lieu_cin: "",
      tel1: "",
      tel2: "",
      date_naissance: "",
      marie: false,
      nom_conjoint: "",
      nb_enfant_a_charge_m: 0,
      nb_enfant_a_charge_f: 0,
      nom_chef_famille: "",
      actif: true,
      date_entree_opb: "",
      id_localisation: undefined,
      id_opb: filterOpb ? Number(filterOpb) : undefined,
    },
  });

  const isJeune = (producteur: ProducteurItem) => {
    if (!producteur.date_naissance) return false;
    const dateTimeNow = new Date().getTime();
    const dateNaissance = new Date(producteur.date_naissance).getTime();
    const age = (dateTimeNow - dateNaissance) / (1000 * 60 * 60 * 24 * 365.25);
    return age < 35;
  };
  console.log(errors);

  const confirm = useConfirm();
  const handleDelete = async (id: number) => {
    const isOk = await confirm({
      title: "Supprimer",
      description: "Voulez-vous vraiment supprimer ce membre ?",
      confirmationText: "Oui",
      cancellationText: "Annuler",
    });
    if (!isOk.confirmed) return;
    try {
      await deleteProducteur(id);
      refreshList();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Impossible de supprimer le membre");
    }
  };

  const refreshList = () => {
    if (filterOpb) {
      getProducteurs({
        include: {
          OPB: {
            include: {
              opr: true,
            },
          },
          Localisation: true,
        },
        where: {
          id_opb: +filterOpb,
        },
        orderBy: {
          id: "asc",
        },
      });
      return;
    }
    clearList();
  };

  const dateNaissance = watch("date_naissance");

  useEffect(() => {
    if (dateNaissance) {
      setValue("annee_naissance", new Date(dateNaissance).getFullYear());
    }
  }, [dateNaissance]);

  useEffect(() => {
    refreshList();
  }, [filterOpb]);

  const canUpdate = canActivate("Membre", "U");
  const canDelete = canActivate("Membre", "D");

  return (
    <Box>
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent={"space-between"}
        paddingX={4}
        minHeight={100}
      >
        <Stack direction={"row"} spacing={4}>
          <Opr />
          <Opb />
        </Stack>
        {filterOpb && (
          <Stack direction={"row"} spacing={4}>
            <p className="font-bold">
              Total: <u>{producteurList.length}</u>
            </p>
            <Stack direction={"column"}>
              <p className="font-bold">
                Actif: <u>{producteurList.filter((p) => p.actif).length}</u>
              </p>
              <p>
                Non actif:{" "}
                <u>{producteurList.filter((p) => !p.actif).length}</u>
              </p>
            </Stack>
            <Stack direction={"column"}>
              <p className="font-bold">
                Homme actif:{" "}
                <u>
                  {
                    producteurList.filter((p) => p.sexe === "homme" && p.actif)
                      .length
                  }
                </u>
              </p>
              <p className="font-bold">
                Femme active:{" "}
                <u>
                  {
                    producteurList.filter((p) => p.sexe === "femme" && p.actif)
                      .length
                  }
                </u>
              </p>
              <p className="font-bold">
                Jeune actif:{" "}
                <u>
                  {producteurList.filter(isJeune).filter((p) => p.actif).length}
                </u>
              </p>
            </Stack>
          </Stack>
        )}
      </Stack>
      <MaterialTable
        columns={Columns({ control, errors })}
        data={producteurList}
        title="Liste membres"
        state={{
          isLoading: loading,
          columnPinning: { left: ["nom", "prenom"] },
        }}
        onEditingRowSave={async ({ exitEditingMode, row }) => {
          try {
            const isValid = await trigger();
            if (!isValid) return;
            const values = getValues();
            const payload = normaliseNumericFields(
              values
            ) as Partial<ProducteurItem>;
            await updateProducteur({
              id: row.original.id,
              producteur: payload,
            });
            refreshList();
            reset();
            exitEditingMode();
          } catch (error: any) {
            toast.error(error.message);
          }
        }}
        onCreatingRowSave={async ({ exitCreatingMode }) => {
          try {
            const isValid = await trigger();
            if (!isValid) return;
            const values = getValues();
            const payload = normaliseNumericFields(
              values
            ) as Partial<ProducteurItem>;
            await createProducteur(payload);
            refreshList();
            reset();
            exitCreatingMode();
          } catch (error: any) {
            toast.error(error.message);
          }
        }}
        onCreatingRowCancel={({ table }) => {
          reset();
          table.setCreatingRow(null);
        }}
        onEditingRowCancel={({ table }) => {
          reset();
          table.setEditingRow(null);
        }}
        renderRowActions={({ row, table }) => (
          <BtnContainer>
            {canUpdate && (
              <IconButton
                color="warning"
                onClick={() => {
                  const values = { ...row.original };
                  const currentFormValues = getValues();
                  // normalise null values to empty string or zero based on form field type
                  Object.keys(values).forEach((key) => {
                    if (values[key] === null) {
                      const formValue = (
                        currentFormValues as Record<string, unknown>
                      )[key];
                      values[key] = typeof formValue === "number" ? 0 : "";
                    }
                  });
                  const {
                    id,
                    date_cin,
                    date_entree_opb,
                    date_naissance,
                    OPB,
                    Localisation,
                    ...rest
                  } = values;
                  reset({
                    ...rest,
                    date_cin: date_cin,
                    date_entree_opb: date_entree_opb,
                    date_naissance: date_naissance,
                    id_localisation: row.original.id_localisation ?? "",
                    id_opb: Number(filterOpb),
                  });
                  table.setEditingRow(row);
                }}
              >
                <EditRounded />
              </IconButton>
            )}
            {canDelete && (
              <IconButton
                color="error"
                onClick={() => handleDelete(row.original.id)}
              >
                <DeleteRounded />
              </IconButton>
            )}
          </BtnContainer>
        )}
      />
    </Box>
  );
}

const BtnContainer = styled(Stack)(() => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 1,
}));
