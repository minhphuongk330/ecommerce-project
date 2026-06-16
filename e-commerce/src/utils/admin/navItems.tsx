import Dashboard from "@mui/icons-material/Dashboard";
import Home from "@mui/icons-material/Home";
import People from "@mui/icons-material/People";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import Bolt from "@mui/icons-material/Bolt";
import LocalOffer from "@mui/icons-material/LocalOffer";
import Business from "@mui/icons-material/Business";
import ViewCarousel from "@mui/icons-material/ViewCarousel";
import Category from "@mui/icons-material/Category";
import MailOutline from "@mui/icons-material/MailOutline";
import { routerPaths } from "~/utils/router";

export const ADMIN_NAV_ITEMS = [
	{ name: "Tổng quan", path: routerPaths.adminDashboard, icon: <Dashboard />, exact: false },
	{ name: "Sản phẩm", path: routerPaths.adminProducts, icon: <ShoppingBag />, exact: false },
	{ name: "Danh mục", path: routerPaths.adminCategories, icon: <Category />, exact: false },
	{ name: "Thương hiệu", path: routerPaths.adminBrands, icon: <Business />, exact: false },
	{ name: "Banners", path: routerPaths.adminBanners, icon: <ViewCarousel />, exact: false },
	{ name: "Liên hệ", path: routerPaths.adminContacts, icon: <MailOutline />, exact: false },
	{ name: "Đơn hàng", path: routerPaths.adminOrders, icon: <ShoppingCart />, exact: false },
	{ name: "Khách hàng", path: routerPaths.adminCustomers, icon: <People />, exact: false },
	{ name: "Flash Sale", path: routerPaths.adminFlashSales, icon: <Bolt />, exact: false },
	{ name: "Mã giảm giá", path: routerPaths.adminCoupons, icon: <LocalOffer />, exact: false },
	{ name: "Cửa hàng", path: routerPaths.index, icon: <Home />, exact: true },
];
