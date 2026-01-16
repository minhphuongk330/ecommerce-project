"use client";
import React from "react";
import { Address } from "~/types/address";
import DeleteAddress from "./Modal/Delete";
import UpdateAddress from "./Modal/Update";

interface AddressItemProps {
	addr: Address;
	isSelected: boolean;
	onSelect: () => void;
	onRefresh: () => void;
}

const AddressItem: React.FC<AddressItemProps> = ({ addr, isSelected, onSelect, onRefresh }) => {
	const containerClass = isSelected ? "bg-[#F4F4F4] border-transparent" : "bg-white border-gray-200";
	const radioBorderClass = isSelected ? "border-black" : "border-[#9F9F9F]";

	return (
		<div
			onClick={onSelect}
			className={`
        !w-full flex flex-col gap-3 text-left items-start
        rounded-[7px] border cursor-pointer transition-all
        p-4
        md:min-h-[144px] md:h-[144px] md:p-[24px]
        md:flex-row md:justify-between md:items-start md:gap-0
        ${containerClass}
      `}
		>
			<div className="flex gap-3 md:gap-[16px] items-start w-full md:flex-1 min-w-0">
				<div className="w-[20px] md:w-[24px] h-[20px] md:h-[24px] mt-1 flex items-center justify-center flex-shrink-0">
					<div
						className={`w-[16px] md:w-[20px] h-[16px] md:h-[20px] rounded-full border flex items-center justify-center ${radioBorderClass}`}
					>
						{isSelected && <div className="w-[8px] md:w-[10px] h-[8px] md:h-[10px] bg-black rounded-full" />}
					</div>
				</div>

				<div className="flex flex-col gap-1.5 flex-1 min-w-0 text-left items-start">
					<div className="flex flex-wrap items-center gap-2 justify-start">
						<span className="text-sm md:text-[16px] font-bold text-black uppercase break-all">{addr.receiverName}</span>

						{addr.isDefault && (
							<span className="bg-black text-white text-[9px] md:text-[10px] font-bold px-2 py-[2px] rounded-[4px] flex-shrink-0">
								HOME
							</span>
						)}
					</div>

					<div className="flex flex-col text-xs md:text-[14px] text-[#4E4E4E] leading-relaxed text-left items-start">
						<span className="break-words text-left">{addr.address}</span>
						<span className="text-left">{addr.phone}</span>
					</div>
				</div>
			</div>

			<div
				className="
          flex gap-4 pt-3 mt-2 border-t border-gray-200
          justify-end w-full
          md:pt-0 md:mt-0 md:border-t-0
          md:self-start md:justify-start md:w-auto
        "
				onClick={e => e.stopPropagation()}
			>
				<UpdateAddress address={addr} onSuccess={onRefresh} />
				<DeleteAddress id={addr.id} onSuccess={onRefresh} />
			</div>
		</div>
	);
};

export default AddressItem;
