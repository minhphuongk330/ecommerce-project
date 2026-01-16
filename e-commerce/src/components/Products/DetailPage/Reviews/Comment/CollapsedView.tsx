interface CollapsedViewProps {
	onClick: () => void;
	isAuth: boolean;
}

const CollapsedView = ({ onClick, isAuth }: CollapsedViewProps) => {
	return (
		<input
			type="text"
			placeholder="Leave Comment"
			readOnly
			onClick={onClick}
			className={`w-full h-[64px] border-[0.5px] rounded-[7px] px-[16px] py-[24px] 
        focus:outline-none transition-colors cursor-pointer text-sm border-[#E6E6E6]
        ${!isAuth ? "cursor-not-allowed opacity-70 bg-[#F3F4F6]" : "bg-[#FFFFFF]"}`}
		/>
	);
};

export default CollapsedView;
