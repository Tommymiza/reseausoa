import { Breadcrumbs, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PathNavigation() {
  const path = usePathname();
  const paths = path.split("/").filter((p) => p !== "");
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link color="inherit" href="/">
        <Typography
          variant="subtitle1"
          sx={{
            ":hover": {
              textDecoration: "underline",
            },
          }}
        >
          Home
        </Typography>
      </Link>
      {paths.map((p, i) => (
        <Link
          color="inherit"
          href={`/${paths.slice(0, i + 1).join("/")}`}
          key={i}
        >
          <Typography
            variant="subtitle1"
            sx={{
              ":hover": {
                textDecoration: "underline",
              },
            }}
          >
            {p}
          </Typography>
        </Link>
      ))}
    </Breadcrumbs>
  );
}
