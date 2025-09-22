"use client";
import producteurStore from "@/store/producteur";
import { ProducteurItem } from "@/store/producteur/type";
import {
  DeleteRounded,
  EditRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import { Box, IconButton, Stack, styled } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import MaterialTable from "../table/MaterialTable";
import Opb from "./modal/Opb";
import Opr from "./modal/Opr";
import Columns from "./table/columns";

export default function ListOpr() {
  const {
    producteurList,
    deleteProducteur,
    getProducteurs,
    loading,
    clearList,
  } = producteurStore();
  const searchParams = useSearchParams();
  const filterOpb = searchParams.get("id_opb");

  const isJeune = (producteur: ProducteurItem) => {
    if (!producteur.date_naissance) return false;
    const dateTimeNow = new Date().getTime();
    const dateNaissance = new Date(producteur.date_naissance).getTime();
    const age = (dateTimeNow - dateNaissance) / (1000 * 60 * 60 * 24 * 365.25);
    return age < 35;
  };

  const confirm = useConfirm();
  const handleDelete = (id: number) => {
    confirm({
      title: "Supprimer",
      description: "Voulez-vous vraiment supprimer cet OPR ?",
      confirmationText: "Oui",
      cancellationText: "Annuler",
    }).then(async () => {
      await deleteProducteur(id);
      getList();
    });
  };

  const getList = () => {
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
      });
      return;
    }
    clearList();
  };

  useEffect(() => {
    getList();
  }, [filterOpb]);

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
            <p style={{ fontWeight: "bold" }}>
              Total: <u>{producteurList.length}</u>
            </p>
            <Stack direction={"column"}>
              <p>
                Actif: <u>{producteurList.filter((p) => p.actif).length}</u>
              </p>
              <p>
                Non actif:{" "}
                <u>{producteurList.filter((p) => !p.actif).length}</u>
              </p>
            </Stack>
            <Stack direction={"column"}>
              <p>
                Homme:{" "}
                <u>{producteurList.filter((p) => p.sexe === "homme").length}</u>
              </p>
              <p>
                Femme:{" "}
                <u>{producteurList.filter((p) => p.sexe === "femme").length}</u>
              </p>
              <p>
                Jeune: <u>{producteurList.filter(isJeune).length}</u>
              </p>
            </Stack>
          </Stack>
        )}
      </Stack>
      <MaterialTable
        columns={Columns()}
        data={producteurList}
        title="Liste membres"
        state={{
          isLoading: loading,
          columnPinning: { left: ["nom", "prenom"] },
        }}
        enableColumnPinning={true}
        enableRowActions={true}
        renderRowActions={({ row }) => (
          <BtnContainer>
            <Link href={`/opr/personnel/${row.original.id}`}>
              <IconButton color="info">
                <VisibilityRounded />
              </IconButton>
            </Link>
            <Link href={`/opr/personnel/${row.original.id}/edit`}>
              <IconButton color="warning">
                <EditRounded />
              </IconButton>
            </Link>
            <IconButton
              color="error"
              onClick={() => handleDelete(row.original.id)}
            >
              <DeleteRounded />
            </IconButton>
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
