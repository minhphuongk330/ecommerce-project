"use client";
import { useEffect, useState } from "react";
import { adminService } from "~/services/admin";
import { AdminCustomer } from "~/types/admin";
import CustomerTable from "~/components/Table/Customers";

export default function CustomersPage() {
	const [customers, setCustomers] = useState<AdminCustomer[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchCustomers = async () => {
		try {
			setLoading(true);
			const data = await adminService.getCustomers();
			setCustomers(data);
		} catch (error) {
			console.error("Failed to fetch customers", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCustomers();
	}, []);

	if (loading) return <div className="p-8 text-gray-500">Loading customer list...</div>;

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
				<div className="text-sm text-gray-500">
					Total: <span className="font-semibold text-gray-800">{customers.length}</span>
				</div>
			</div>
			<CustomerTable customers={customers} />
		</div>
	);
}
