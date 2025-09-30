import { FaChartPie, FaRegUser } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { type IconType } from "react-icons/lib";
import { MdGroups2 } from "react-icons/md";

export type MenuProps = {
  name: string;
  path?: string;
  icon: IconType;
  children?: {
    name: string;
    icon: IconType;
    path: string;
  }[];
};
export const menus: MenuProps[] = [
  {
    name: "Dashboard",
    path: "/",
    icon: FaChartPie,
  },
  {
    name: "Membres",
    icon: MdGroups2,
    path: "/membre",
  },
  {
    name: "Paramètre",
    icon: IoIosSettings,
    children: [
      {
        name: "Utilisateur",
        icon: FaRegUser,
        path: "/utilisateur",
      },
    ],
  },
];
