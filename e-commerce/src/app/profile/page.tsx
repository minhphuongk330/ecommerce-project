"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "~/components/atoms/Button";
import ConfirmationModal from "~/components/atoms/Confirmation";
import ProfileForm from "~/components/Profile/Form";
import ProfileHeader from "~/components/Profile/Header";
import ChangePasswordModal from "~/components/Profile/Modal/ChangePassword";
import { ProfileSkeleton } from "~/components/Skeletons";
import { useNotification } from "~/contexts/Notification";
import { authService } from "~/services/auth";
import { useAuthStore } from "~/stores/useAuth";
import { UpdateProfilePayload } from "~/types/auth";
import { routerPaths } from "~/utils/router";
import { updateProfileSchema } from "~/utils/validator/auth";

export default function ProfilePage() {
	const router = useRouter();
	const { user, setUser, logout } = useAuthStore();
	const { showNotification } = useNotification();
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const { control, handleSubmit, reset } = useForm<UpdateProfilePayload>({
		resolver: zodResolver(updateProfileSchema) as any,
		defaultValues: {
			fullName: "",
			phoneNumber: "",
			gender: undefined,
			dateOfBirth: "",
		},
	});

	const fetchProfile = useCallback(async () => {
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
	}, [logout, reset, router, setUser]);

	useEffect(() => {
		fetchProfile();
	}, [fetchProfile]);

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

	const handleDeleteAccount = async () => {
		try {
			await authService.deactivateAccount();
			logout();
			router.push(routerPaths.index);
			showNotification("Your account has been deleted.", "success");
		} catch (error) {
			showNotification("Failed to delete account.", "error");
		}
	};

	if (isLoading || !user) {
		return (
			<div className="min-h-screen bg-gray-50 py-[40px] px-4 sm:px-6 lg:px-8">
				<div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden px-6 py-8">
					<ProfileSkeleton />
				</div>
			</div>
		);
	}

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
					<div className="mt-10 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 border-t">
						<Button
							type="button"
							onClick={() => setIsDeleteModalOpen(true)}
							variant="outline"
							theme="light"
							className="!w-full sm:!w-[160px] !h-11 !border-red-300 !text-red-600 hover:!bg-red-50"
						>
							Delete Account
						</Button>
						<Button
							type="button"
							onClick={handleSubmit(onSubmit)}
							disabled={isSaving}
							variant="solid"
							theme="dark"
							className="!w-full sm:!w-[160px] !h-11"
						>
							{isSaving ? "Saving..." : "Save changes"}
						</Button>
					</div>
				</div>
			</div>

			<ConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				title="Delete Account"
				message="Are you sure you want to delete your account? This action cannot be undone."
				confirmLabel="Delete Account"
				onConfirm={handleDeleteAccount}
				onError={() => showNotification("Failed to delete account.", "error")}
			/>
		</div>
	);
}
