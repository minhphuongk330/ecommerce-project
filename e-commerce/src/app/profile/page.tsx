"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "~/services/auth";
import { useAuthStore } from "~/stores/useAuth";
import { routerPaths } from "~/utils/router";
import { useNotification } from "~/contexts/Notification";
import { UpdateProfilePayload } from "~/types/auth";
import { updateProfileSchema } from "~/utils/validator/auth";
import Button from "~/components/atoms/Button";
import ProfileHeader from "~/components/Profile/Header";
import ProfileForm from "~/components/Profile/Form";
import ChangePasswordModal from "~/components/Profile/Modal/ChangePassword";

export default function ProfilePage() {
	const router = useRouter();
	const { user, setUser, logout } = useAuthStore();
	const { showNotification } = useNotification();
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const { control, handleSubmit, reset } = useForm<UpdateProfilePayload>({
		resolver: zodResolver(updateProfileSchema) as any,
		defaultValues: {
			fullName: "",
			phoneNumber: "",
			gender: undefined,
			dateOfBirth: "",
		},
	});

	const fetchProfile = async () => {
		try {
			const data = await authService.getProfile();
			setUser(data);
			reset({
				fullName: data.fullName || "",
				phoneNumber: data.phoneNumber || "",
				gender: data.gender || undefined,
				dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
			});
		} catch (error: any) {
			if (error.response?.status === 401) {
				logout();
				router.push(routerPaths.login);
			}
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchProfile();
	}, []);

	const onSubmit = async (data: UpdateProfilePayload) => {
		try {
			setIsSaving(true);
			const updatedUser = await authService.updateProfile(data);
			setUser(updatedUser);
			showNotification("Update successful!", "success");
		} catch (error) {
			showNotification("Update failed.", "error");
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading || !user) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;

	return (
		<div className="min-h-screen bg-gray-50 py-[40px] px-4 sm:px-6 lg:px-8">
			<div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden px-6 py-8">
				<ProfileHeader fullName={user.fullName} />

				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
					<h3 className="text-lg font-semibold text-gray-900">My Profile</h3>
					<ChangePasswordModal />
				</div>

				<div className="space-y-6">
					<ProfileForm control={control} email={user.email} />
					<div className="mt-10 flex justify-end gap-3 pt-4">
						<Button
							type="button"
							onClick={handleSubmit(onSubmit)}
							disabled={isSaving}
							variant="solid"
							theme="dark"
							className="!w-auto !h-auto px-6 py-2"
						>
							{isSaving ? "Saving..." : "Save changes"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
