import { OrderStatus } from "~/types/order";

export const getOrderStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "Pending":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "Shipped":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "Completed":
      return "text-green-600 bg-green-50 border-green-200";
    case "Cancelled":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};