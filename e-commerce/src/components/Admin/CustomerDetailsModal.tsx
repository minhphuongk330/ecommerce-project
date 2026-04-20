"use client";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AdminCustomer } from "~/types/admin";
import { formatDate } from "~/utils/format";
import { useScrollLock } from "~/hooks/useScrollLock";

interface CustomerDetailsModalProps {
	customer: AdminCustomer | null;
	onClose: () => void;
}

const ModalHeader = ({ id, fullName, onClose }: { id: number; fullName: string; onClose: () => void }) => {
	return (
		<div className="p-6 border-b border-gray-100 flex justify-between items-start">
			<div>
				<h3 className="text-xl font-bold text-gray-800">Customer Details</h3>
				<p className="text-sm text-gray-500 mt-1">ID #{id}</p>
				<p className="text-sm font-semibold text-gray-900 mt-2">{fullName}</p>
			</div>
			<button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 transition-colors">
				<CloseIcon />
			</button>
		</div>
	);
};

const InfoField = ({ label, value }: { label: string; value: string | React.ReactNode }) => {
	return (
		<div className="py-3 border-b border-gray-100 last:border-b-0">
			<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
			<p className="text-sm text-gray-900 font-medium">
				{value || <span className="text-gray-400 italic">Not provided</span>}
			</p>
		</div>
	);
};

const ProfileSection = ({ customer }: { customer: AdminCustomer }) => {
	return (
		<div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
			<h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Personal Information</h4>

			<InfoField label="Email" value={customer.email} />
			<InfoField label="Phone Number" value={customer.profile?.phoneNumber || ""} />
			<InfoField
				label="Gender"
				value={
					customer.profile?.gender
						? customer.profile.gender === "MALE"
							? "Male"
							: customer.profile.gender === "FEMALE"
								? "Female"
								: "Other"
						: ""
				}
			/>
			<InfoField
				label="Date of Birth"
				value={customer.profile?.dateOfBirth ? formatDate(customer.profile.dateOfBirth) : ""}
			/>
		</div>
	);
};

const ModalFooter = ({ onClose }: { onClose: () => void }) => {
	return (
		<div className="p-4 border-t border-gray-100 flex justify-end bg-white">
			<button
				onClick={onClose}
				className="px-8 py-2 bg-[#111827] text-white font-bold rounded-md hover:bg-black active:scale-95 transition-all"
			>
				Close
			</button>
		</div>
	);
};

const CustomerDetailsModal = ({ customer, onClose }: CustomerDetailsModalProps) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useScrollLock(!!customer);

	if (!mounted || !customer) return null;

	return createPortal(
		<div
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 transition-all"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
				onClick={e => e.stopPropagation()}
			>
				<ModalHeader id={customer.id} fullName={customer.fullName} onClose={onClose} />

				<div className="p-6 overflow-y-auto flex-1 bg-gray-50/20 custom-scrollbar">
					<ProfileSection customer={customer} />
				</div>
				<ModalFooter onClose={onClose} />
			</div>
		</div>,
		document.body,
	);
};

export default CustomerDetailsModal;
