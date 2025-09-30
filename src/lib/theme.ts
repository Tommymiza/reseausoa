import { ThemeOptions } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const PRIMARY_MAIN = "#678f6b";

const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: PRIMARY_MAIN,
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6aa86b",
    },
    background: {
      default: "#ffffff",
      paper: "#f7f9f7",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(
      ", "
    ),
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: PRIMARY_MAIN,
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
export { themeOptions };
