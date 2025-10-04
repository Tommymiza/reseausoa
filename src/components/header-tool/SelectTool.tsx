import { Stack } from "@mui/material";
import Opr from "../membre/modal/Opr";

export default function SelectTool() {
  return (
    <Stack
      direction={"row"}
      alignItems="center"
      justifyContent={"space-between"}
      paddingX={4}
      minHeight={100}
    >
      <Stack direction={"row"} spacing={4}>
        <Opr />
      </Stack>
    </Stack>
  );
}
