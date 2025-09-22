import { Add, Delete, Edit, Search } from "@mui/icons-material";
import {
  Box,
  IconButton,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_TableInstance,
  type MRT_TableOptions,
  MRT_ToggleFullScreenButton,
  useMaterialReactTable,
} from "material-react-table";

import { MRT_Localization_FR } from "material-react-table/locales/fr";

export default function MaterialTable({
  title,
  columns,
  data,
  createFn,
  updateFn,
  deleteFn,
  ...props
}: MRT_TableOptions<any> & {
  data: any[];
  columns: MRT_ColumnDef<any>[];
  title: string;
  topToolbar?: ({
    table,
  }: {
    table: MRT_TableInstance<any>;
  }) => React.ReactElement;
  createFn?: (data: any) => Promise<void>;
  updateFn?: (data: any) => Promise<void>;
  deleteFn?: (data: any) => Promise<void>;
}) {
  const table = useMaterialReactTable({
    ...props,
    columns,
    data,
    localization: MRT_Localization_FR,
    enableEditing: true,
    onCreatingRowSave: async ({ exitCreatingMode, row, values }) => {},
    onEditingRowSave: async ({ exitEditingMode, row, values }) => {},
    editDisplayMode: "row",
    createDisplayMode: "row",
    muiTableHeadRowProps: {
      sx: {
        boxShadow: "none",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        "& .Mui-TableHeadCell-Content-Wrapper": {
          whiteSpace: "nowrap",
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        borderBottom: "none",
      },
    },
    muiCircularProgressProps: {
      sx: {
        display: "none",
      },
    },
    muiTablePaperProps: {
      sx: {
        background: "white",
        borderRadius: 2,
        boxShadow: "0 0 35px 0 rgba(0,0,0,0.01)",
        width: "100%",
        padding: 4,
      },
      elevation: 0,
    },
    initialState: {
      showGlobalFilter: true,
      density: "compact",
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
    renderRowActionMenuItems: ({ row }) => {
      return [
        <MenuItem key="edit" onClick={() => console.info("Edit")}>
          Edit
        </MenuItem>,
        <MenuItem key="delete" onClick={() => console.info("Delete")}>
          Delete
        </MenuItem>,
      ];
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => {}}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    positionActionsColumn: "last",
    renderTopToolbar: ({ table }) => (
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        marginBottom={2}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        <Stack direction={"row"} alignItems={"center"} gap={1}>
          <MRT_GlobalFilterTextField
            slotProps={{
              input: {
                startAdornment: <Search sx={{ color: "gray" }} />,
                endAdornment: null,
              },
            }}
            table={table}
          />
          <IconButton onClick={() => table.setCreatingRow(true)}>
            <Add />
          </IconButton>
          <MRT_ToggleFullScreenButton table={table} />
          {props.topToolbar && props.topToolbar({ table })}
        </Stack>
      </Stack>
    ),
  });

  return <MaterialReactTable table={table} />;
}
