import Dashboard from "@mui/icons-material/Dashboard";
import Home from "@mui/icons-material/Home";
import People from "@mui/icons-material/People";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { routerPaths } from "~/utils/router";

export const ADMIN_NAV_ITEMS = [
	{ name: "Dashboard", path: routerPaths.adminDashboard, icon: <Dashboard />, exact: false },
	{ name: "Products", path: routerPaths.adminProducts, icon: <ShoppingBag />, exact: false },
	{ name: "Orders", path: routerPaths.adminOrders, icon: <ShoppingCart />, exact: false },
	{ name: "Customers", path: routerPaths.adminCustomers, icon: <People />, exact: false },
	{ name: "Home", path: routerPaths.index, icon: <Home />, exact: true },
];
