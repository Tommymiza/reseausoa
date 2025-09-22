import { FaChartPie } from "react-icons/fa";
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
];
