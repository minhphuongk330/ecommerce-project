interface Props {
	fullName: string;
}

const ProfileHeader = ({ fullName }: Props) => {
	return (
		<div className="bg-gray-200 px-6 py-8 text-center mb-8 rounded-lg">
			<div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white text-gray-600 text-3xl font-bold uppercase shadow-sm">
				{fullName.charAt(0)}
			</div>
		</div>
	);
};

export default ProfileHeader;
