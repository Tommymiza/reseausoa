import oprStore from "@/store/opr";
import { OprItem } from "@/store/opr/type";
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
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FormOpr from "./FormOpr";

export default function Opr() {
  const { oprList, getOprs } = oprStore();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<OprItem | null>(null);
  const searchParams = useSearchParams();
  const filterOpr = searchParams.get("id_opr");
  const setFilterOpr = (id_opr: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id_opr) {
      params.set("id_opr", id_opr.toString());
    } else {
      params.delete("id_opr");
    }
    params.delete("id_opb");
    const queryString = params.toString();
    const newPath = `/membre${queryString ? `?${queryString}` : ""}`;
    window.history.replaceState(null, "", newPath);
  };

  useEffect(() => {
    getOprs();
  }, []);

  return (
    <Stack direction={"row"} spacing={1} alignItems="center">
      <TextField
        select
        value={filterOpr || ""}
        onChange={(e) => {
          setFilterOpr(e.target.value ? Number(e.target.value) : null);
        }}
        size="small"
        label="OPR"
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="">-- Filtrer par OPR --</MenuItem>
        {oprList.map((opr) => (
          <MenuItem key={opr.id} value={opr.id}>
            {opr.nom}
          </MenuItem>
        ))}
      </TextField>
      <Stack direction={"row"}>
        <IconButton color="primary" onClick={() => setOpen(true)}>
          <Add />
        </IconButton>
        {filterOpr && (
          <IconButton
            color="warning"
            onClick={() => {
              const currentOpr = oprList.find(
                (opr) => opr.id === Number(filterOpr)
              );
              setEdit(currentOpr || null);
            }}
          >
            <Edit />
          </IconButton>
        )}
      </Stack>
      <Dialog
        open={open || Boolean(edit)}
        onClose={() => {
          setOpen(false);
          setEdit(null);
        }}
        fullWidth
      >
        <DialogTitle>Formulaire OPR</DialogTitle>
        <DialogContent>
          <FormOpr setOpen={setOpen} setEdit={setEdit} edit={edit} />
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
