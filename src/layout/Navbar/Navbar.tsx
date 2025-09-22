import { MenuProps, menus } from "@/lib/menu";
import {
  Avatar,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";
import { type IconType } from "react-icons/lib";
import PathNavigation from "./PathNavigation";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const profileItems: {
    icon: IconType;
    label: string;
    onClick: () => void;
  }[] = useMemo(
    () => [
      {
        icon: FiUsers,
        label: "Profile",
        onClick: () => router.push("/profile"),
      },
      {
        icon: IoIosLogOut,
        label: "Déconnexion",
        onClick: () => {},
      },
    ],
    [router]
  );
  return (
    <Stack marginBottom={2}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        paddingY={1}
        paddingX={3}
        sx={{
          backgroundColor: grey[200],
        }}
      >
        <Stack direction={"row"} gap={2} alignItems={"center"}>
          <Image src={"/logo.png"} width={30} height={30} alt="Logo" />
          <Stack direction={"row"} gap={1}>
            {menus.map((menu) =>
              menu.children ? (
                <MenuChildren menu={menu} key={menu.name} />
              ) : (
                <LinkItem menu={menu} key={menu.name} />
              )
            )}
          </Stack>
        </Stack>
        <Stack>
          <Avatar
            src={"/globe.svg"}
            sx={{
              backgroundColor: grey[100],
              border: "2px solid",
              borderColor: grey[400],
              cursor: "pointer",
              transition: ".3s",
              ":hover": {
                borderColor: grey[600],
              },
            }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          />
          <Menu
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorEl={anchorEl}
            anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            elevation={0}
            slotProps={{
              paper: {
                sx: {
                  marginTop: 1,
                  boxShadow: "0 0 15px 0 rgba(0, 0, 0, 0.1)",
                  width: 200,
                  borderRadius: 2,
                },
              },
            }}
          >
            <Stack paddingX={1}>
              {profileItems.map((item) => (
                <ProfileItem
                  icon={item.icon}
                  label={item.label}
                  onClick={item.onClick}
                  key={item.label}
                />
              ))}
            </Stack>
          </Menu>
        </Stack>
      </Stack>
      <Stack paddingY={1} paddingX={3}>
        <PathNavigation />
      </Stack>
      <Divider />
    </Stack>
  );
}

function ProfileItem(menu: {
  icon: IconType;
  label: string;
  onClick: () => void;
}) {
  return (
    <MenuItem
      dense
      sx={{
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
      onClick={menu.onClick}
    >
      <menu.icon />
      <Typography variant="body1">{menu.label}</Typography>
    </MenuItem>
  );
}

function MenuChildren({ menu }: { menu: MenuProps }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const path = usePathname();
  return (
    <Stack>
      <MenuItem
        onClick={(e) => setAnchorEl(e.currentTarget)}
        dense
        sx={{
          color: grey[600],
          backgroundColor: menu.path
            ? menu.path === "/"
              ? path === menu.path
                ? "white"
                : "transparent"
              : path.includes(menu.path)
              ? "white"
              : "transparent"
            : "transparent",
          padding: "5px 15px",
          borderRadius: 1,
          display: "flex",
          gap: 1,
        }}
      >
        <menu.icon />
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {menu.name}
        </Typography>
      </MenuItem>
      <Menu
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        elevation={0}
        slotProps={{
          paper: {
            sx: {
              marginTop: 1,
              boxShadow: "0 0 15px 0 rgba(0, 0, 0, 0.1)",
              width: 200,
              borderRadius: 2,
            },
          },
        }}
      >
        <Stack paddingX={1}>
          {menu.children?.map((item) => (
            <ProfileItem
              icon={item.icon}
              label={item.name}
              onClick={() => router.push(item.path)}
              key={item.name}
            />
          ))}
        </Stack>
      </Menu>
    </Stack>
  );
}

function LinkItem({
  menu,
}: {
  menu: {
    name: string;
    path?: string;
    icon: IconType;
  };
}) {
  const path = usePathname();
  return (
    <MenuItem
      dense
      sx={{
        color: grey[600],
        backgroundColor: menu.path
          ? menu.path === "/"
            ? path === menu.path
              ? "white"
              : "transparent"
            : path.includes(menu.path)
            ? "white"
            : "transparent"
          : "transparent",
        padding: "5px 15px",
        borderRadius: 1,
        display: "flex",
        gap: 1,
      }}
    >
      <menu.icon />
      <Link href={menu.path || "#"}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {menu.name}
        </Typography>
      </Link>
    </MenuItem>
  );
}
