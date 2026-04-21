import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,
} from "react-icons/lu";

// Navigation menu data - Defines sidebar menu items with labels, icons, and routes
export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Начало",
        icon: LuLayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        label: "Приход",
        icon: LuWalletMinimal,
        path: "/income",
    },
    {
        id: "03",
        label: "Разход",
        icon: LuHandCoins,
        path: "/expense",
    },

    {
        id: "06",
        label: "Изход",
        icon: LuLogOut,
        path: "logout",
    },
];