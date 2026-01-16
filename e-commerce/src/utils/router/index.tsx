export const routerPaths = {
	index: "/",
	login: "/auth/login",
	register: "/auth/register",
	about: "/about",
	contact: "/contact",
	blog: "/blog",
	products: "/products/:id",
	productDetail: "/products",
	cart: "/cart",
	banner: "/banners",
	category: "/categories",
	address: "/checkout/address",
	shipping: "/checkout/shipping",
	payment: "/checkout/payment",
	order: "/orders",
	favorite: "/favorites",
	profile: "/profile",
	adminDashboard: "/admin/dashboard",
	adminProducts: "/admin/products",
	adminOrders: "/admin/orders",
	adminCustomers: "/admin/customers",
};

export const replacePathParams = (path: string, params: Record<string, string>) => {
	return path.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
		return params[key] !== undefined ? params[key] : ":" + key;
	});
};

export const router = {
	product: (id: string | number) => replacePathParams(routerPaths.products, { id: String(id) }),
	orderDetail: (id: string | number) => `${routerPaths.order}/${id}`,
};
