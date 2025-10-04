import opbStore from "@/store/opb";
import { OpbItem } from "@/store/opb/type";
import { Add, Edit } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FormOpb from "./FormOpb";

export default function Opb() {
  const { opbList, getOpbs } = opbStore();
  const searchParams = useSearchParams();
  const filterOpr = searchParams.get("id_opr");
  const filterOpb = searchParams.get("id_opb");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<OpbItem | null>(null);
  const setFilterOpb = (id_opb: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id_opb) {
      params.set("id_opb", id_opb.toString());
    } else {
      params.delete("id_opb");
    }
    const queryString = params.toString();
    const newPath = pathname + `${queryString ? `?${queryString}` : ""}`;
    window.history.replaceState(null, "", newPath);
  };

  useEffect(() => {
    getOpbs();
  }, []);

  return (
    <Stack direction={"row"} spacing={1} alignItems="center">
      <TextField
        select
        value={filterOpb || ""}
        onChange={(e) =>
          setFilterOpb(e.target.value ? Number(e.target.value) : null)
        }
        label="Choisir un OPB"
        size="small"
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="">-- Filtrer par OPB --</MenuItem>
        {opbList
          .filter((opb) => (filterOpr ? opb.id_opr === +filterOpr : true))
          .map((opb) => (
            <MenuItem key={opb.id} value={opb.id}>
              {opb.nom}
            </MenuItem>
          ))}
      </TextField>
      {filterOpr && (
        <Stack direction={"row"}>
          <IconButton color="primary" onClick={() => setOpen(true)}>
            <Add />
          </IconButton>
          {filterOpb && (
            <IconButton
              color="warning"
              onClick={() => {
                const currentOpb = opbList.find(
                  (opb) => opb.id === Number(filterOpb)
                );
                setEdit(currentOpb || null);
              }}
            >
              <Edit />
            </IconButton>
          )}
        </Stack>
      )}
      <Dialog
        open={open || Boolean(edit)}
        onClose={() => {
          setOpen(false);
          setEdit(null);
        }}
        fullWidth
      >
        <DialogTitle>Formulaire OPB</DialogTitle>
        <DialogContent>
          <FormOpb
            setOpen={setOpen}
            setEdit={setEdit}
            edit={edit}
            id_opr={Number(filterOpr)}
          />
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
