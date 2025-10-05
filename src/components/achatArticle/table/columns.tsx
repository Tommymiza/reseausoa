import { Add, Edit } from "@mui/icons-material";
import {
  Autocomplete,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Control, Controller } from "react-hook-form";

import { AchatArticleItem } from "@/store/achatArticle/type";
import articleStore from "@/store/article";

export default function Columns({
  control,
  errors,
  onOpenAddDialog,
  onOpenEditDialog,
  onFieldChange,
}: {
  control: Control<any>;
  errors: any;
  onOpenAddDialog: () => void;
  onOpenEditDialog: (articleId: number) => void;
  onFieldChange: (onChange: (value: number) => void) => void;
}) {
  const { articleList } = articleStore();

  const columns = useMemo<MRT_ColumnDef<AchatArticleItem>[]>(
    () => [
      {
        accessorKey: "id_article",
        header: "Article",
        Cell: ({ row }) => (
          <Typography>
            {row.original.Article?.nom ||
              row.original.id_article ||
              "Non renseigné"}
          </Typography>
        ),
        Edit: () => (
          <Controller
            name="id_article"
            control={control}
            render={({ field }) => {
              // Notifier le parent de la fonction onChange
              onFieldChange(field.onChange);

              return (
                <Autocomplete
                  options={articleList}
                  value={
                    articleList.find((art) => art.id === field.value) || null
                  }
                  onChange={(_, newVal) =>
                    field.onChange(newVal ? Number(newVal.id) : 0)
                  }
                  isOptionEqualToValue={(opt, val) =>
                    Number(opt.id) === Number(val.id)
                  }
                  getOptionLabel={(option) => option.nom}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Article"
                      error={!!errors.id_article}
                      helperText={errors.id_article?.message}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {params.InputProps.endAdornment}
                            <InputAdornment position="end">
                              {field.value && field.value > 0 && (
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenEditDialog(field.value);
                                  }}
                                  color="primary"
                                >
                                  <Edit />
                                </IconButton>
                              )}
                              <IconButton
                                size="small"
                                onClick={onOpenAddDialog}
                                edge="end"
                                color="primary"
                              >
                                <Add />
                              </IconButton>
                            </InputAdornment>
                          </>
                        ),
                      }}
                    />
                  )}
                />
              );
            }}
          />
        ),
      },
      {
        accessorKey: "quantite",
        header: "Quantité",
        Cell: ({ cell }) => (
          <Typography>{cell.getValue<number>() || "0"}</Typography>
        ),
        Edit: () => (
          <Controller
            name="quantite"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Quantité"
                type="number"
                fullWidth
                error={!!errors.quantite}
                helperText={errors.quantite?.message}
              />
            )}
          />
        ),
      },
    ],
    [
      control,
      errors,
      articleList,
      onOpenAddDialog,
      onOpenEditDialog,
      onFieldChange,
    ]
  );

  return columns;
}
