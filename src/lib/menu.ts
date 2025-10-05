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
    name: "Service au membre",
    icon: MdGroups2,
    children: [
      {
        name: "Accompagnement",
        icon: MdGroups2,
        path: "/service/accompagnement",
      },
      {
        name: "Installation jeune",
        icon: MdGroups2,
        path: "/service/jeune",
      },
      {
        name: "Représentation",
        icon: MdGroups2,
        path: "/service/representation",
      },
      {
        name: "Achat groupé",
        icon: MdGroups2,
        path: "/service/achat-groupe",
      },
      {
        name: "Vente groupée",
        icon: MdGroups2,
        path: "/service/vente-groupe",
      },
      {
        name: "Santé animale",
        icon: MdGroups2,
        path: "/service/sante-animale",
      },
      {
        name: "Action environnementale",
        icon: MdGroups2,
        path: "/service/action-environnementale",
      },
      {
        name: "GVEC",
        icon: MdGroups2,
        path: "/service/gvec",
      },
    ],
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
      {
        name: "Spéculation",
        icon: FaRegUser,
        path: "/speculation",
      },
    ],
  },
];
