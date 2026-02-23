"use client";
import { useEffect, useMemo, useState } from "react";
import AdminTableFilter, { FilterConfig } from "~/components/Admin/AdminTableFilter";
import CustomerTable from "~/components/Table/Customers";
import { useNotification } from "~/contexts/Notification";
import { adminService } from "~/services/admin";
import { AdminCustomer } from "~/types/admin";

export default function CustomersPage() {
	const [allCustomers, setAllCustomers] = useState<AdminCustomer[]>([]);
	const [filteredCustomers, setFilteredCustomers] = useState<AdminCustomer[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const { showNotification } = useNotification();

	const fetchCustomers = async () => {
		try {
			setLoading(true);
			const data = await adminService.getCustomers();
			setAllCustomers(data);
		} catch (error) {
			console.error("Failed to fetch customers", error);
			showNotification("Failed to load customer list", "error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCustomers();
	}, []);

	useMemo(() => {
		const filtered = allCustomers.filter(customer => {
			const matchesSearch =
				customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				customer.email.toLowerCase().includes(searchTerm.toLowerCase());
			return matchesSearch;
		});
		setFilteredCustomers(filtered);
	}, [allCustomers, searchTerm]);

	if (loading) return <div className="p-8 text-gray-500">Loading customer list...</div>;

	const filterConfig: FilterConfig = {
		searchPlaceholder: "Search by customer name or email...",
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
				<div className="text-sm text-gray-500">
					Total: <span className="font-semibold text-gray-800">{filteredCustomers.length}</span>
				</div>
			</div>
			<AdminTableFilter config={filterConfig} onSearch={setSearchTerm} />
			<CustomerTable customers={filteredCustomers} />
		</div>
	);
}
