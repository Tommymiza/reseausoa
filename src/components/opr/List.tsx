"use client";
import opbStore from "@/store/opb";
import oprStore from "@/store/opr";
import producteurStore from "@/store/producteur";
import {
  DeleteRounded,
  EditRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  MenuItem,
  Select,
  Stack,
  styled,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import MaterialTable from "../table/MaterialTable";
import Columns from "./table/columns";

export default function ListOpr() {
  const {
    producteurList,
    deleteProducteur,
    getProducteurs,
    loading,
    clearList,
  } = producteurStore();
  const { getOprs, oprList } = oprStore();
  const { getOpbs, opbList } = opbStore();
  const searchParams = useSearchParams();
  const filterOpb = searchParams.get("id_opb");
  const filterOpr = searchParams.get("id_opr");

  const setFilterOpb = (id_opb: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id_opb) {
      params.set("id_opb", id_opb.toString());
    } else {
      params.delete("id_opb");
    }
    const queryString = params.toString();
    const newPath = `/opr${queryString ? `?${queryString}` : ""}`;
    window.history.replaceState(null, "", newPath);
  };

  const setFilterOpr = (id_opr: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id_opr) {
      params.set("id_opr", id_opr.toString());
    } else {
      params.delete("id_opr");
    }
    params.delete("id_opb");
    const queryString = params.toString();
    const newPath = `/opr${queryString ? `?${queryString}` : ""}`;
    window.history.replaceState(null, "", newPath);
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
  useEffect(() => {
    getOprs();
    getOpbs();
  }, []);
  return (
    <Box>
      <Stack direction={"row"} spacing={2} mb={2}>
        <Select
          value={filterOpr || ""}
          onChange={(e) => {
            setFilterOpr(e.target.value ? Number(e.target.value) : null);
          }}
          displayEmpty
        >
          <MenuItem value="">-- Filtrer par OPR --</MenuItem>
          {oprList.map((opr) => (
            <MenuItem key={opr.id} value={opr.id}>
              {opr.nom}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={filterOpb || ""}
          onChange={(e) =>
            setFilterOpb(e.target.value ? Number(e.target.value) : null)
          }
          displayEmpty
        >
          <MenuItem value="">-- Filtrer par OPB --</MenuItem>
          {opbList
            .filter((opb) => (filterOpr ? opb.id_opr === +filterOpr : true))
            .map((opb) => (
              <MenuItem key={opb.id} value={opb.id}>
                {opb.nom}
              </MenuItem>
            ))}
        </Select>
      </Stack>
      <MaterialTable
        columns={Columns()}
        data={producteurList}
        title="Liste Producteurs membres"
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
