"use client";
import React, { useEffect, useState, useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListSubheader from "@mui/material/ListSubheader";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { useForm, Controller, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminService } from "~/services/admin";
import { useNotification } from "~/contexts/Notification";
import { bannerSchema, BannerFormValues } from "~/utils/validator/banner";
import { bannerCache } from "~/utils/lruCache";
import CommonInput from "~/components/atoms/Input";
import ImageUploadInput from "~/components/atoms/ImageUploadInput";
import { BannerData } from "~/types/banner";
import { AdminProduct } from "~/types/admin";

interface BannerFormModalProps {
	open: boolean;
	banner?: BannerData | null;
	onClose: () => void;
	onSuccess: () => void;
}

const initialValues: BannerFormValues = {
	imageUrl: "",
	displayType: "1",
	isActive: true,
	productId: "",
};

export default function BannerFormModal({ open, banner, onClose, onSuccess }: BannerFormModalProps) {
	const { showNotification } = useNotification();
	const isEdit = !!banner;
	const [products, setProducts] = useState<AdminProduct[]>([]);

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");

	const {
		control,
		handleSubmit,
		setValue,
		reset,
		formState: { isSubmitting },
	} = useForm<BannerFormValues>({
		resolver: zodResolver(bannerSchema),
		defaultValues: initialValues as DefaultValues<BannerFormValues>,
	});

	 
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const prodList = await adminService.getProducts();
				const sorted = prodList.sort((a, b) => a.name.localeCompare(b.name));
				setProducts(sorted);
			} catch (err) {
				console.error("Failed to load products for banner selection:", err);
			}
		};
		if (open) {
			fetchProducts();
			setSearchQuery("");
			setSelectedCategory("");
		}
	}, [open]);

 
	const categories = useMemo(() => {
		const cats = new Set<string>();
		products.forEach(p => {
			if (p.category?.name) {
				cats.add(p.category.name);
			}
		});
		return Array.from(cats).sort();
	}, [products]);

 
	const filteredProducts = useMemo(() => {
		return products.filter(prod => {
			const matchesName = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || String(prod.id).includes(searchQuery);
			const matchesCategory = !selectedCategory || prod.category?.name === selectedCategory;
			return matchesName && matchesCategory;
		});
	}, [products, searchQuery, selectedCategory]);

 
	useEffect(() => {
		if (open) {
			if (banner) {
				reset({
					imageUrl: banner.imageUrl ?? "",
					displayType: (String(banner.displayType) as any) ?? "1",
					isActive: banner.isActive ?? true,
					productId: banner.content ?? "",
				});
			} else {
				reset(initialValues);
			}
		}
	}, [banner, open, reset]);

	const handleFormSubmit = async (data: BannerFormValues) => {
		try {
			const payload = {
				title: "",
				content: data.productId || "",
				imageUrl: data.imageUrl.trim(),
				displayType: data.displayType,
				isActive: data.isActive,
			};

			if (isEdit && banner) {
				await adminService.updateBanner(Number(banner.id), payload);
				showNotification("Cập nhật banner thành công!", "success");
			} else {
				await adminService.createBanner(payload);
				showNotification("Thêm banner mới thành công!", "success");
			}

		 
			bannerCache.clear();

			onSuccess();
		} catch (err: any) {
			const msg = err?.response?.data?.message || (isEdit ? "Cập nhật thất bại" : "Thêm thất bại");
			showNotification(msg, "error");
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle sx={{ fontWeight: "bold", pr: 6 }}>
				{isEdit ? "✏️ Chỉnh sửa banner quảng cáo" : "🖼️ Thêm banner mới"}
				<IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent dividers>
				<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 pt-1">


					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				 
						<Controller
							name="displayType"
							control={control}
							render={({ field, fieldState: { error } }) => (
								<FormControl fullWidth size="medium" error={!!error}>
									<InputLabel id="display-type-label">Vị trí hiển thị *</InputLabel>
									<Select
										labelId="display-type-label"
										id="displayType"
										label="Vị trí hiển thị *"
										{...field}
									>
										<MenuItem value="1">Banner chính (Hero Slider ở đầu trang)</MenuItem>
										<MenuItem value="2">Banner đôi (Split Banners)</MenuItem>
										<MenuItem value="3">Bên trái - Banner lưới (Grid Carousel)</MenuItem>
										<MenuItem value="4">Banner cuối trang (Bottom Banner)</MenuItem>
										<MenuItem value="5">Bên phải - Banner phụ dọc (Side Banner)</MenuItem>
									</Select>
									{error && <FormHelperText>{error.message}</FormHelperText>}
								</FormControl>
							)}
						/>

						 
						<div className="flex items-center pl-1">
							<Controller
								name="isActive"
								control={control}
								render={({ field }) => (
									<FormControlLabel
										control={
											<Switch
												checked={!!field.value}
												onChange={(e) => field.onChange(e.target.checked)}
											/>
										}
										label="Kích hoạt hiển thị"
										labelPlacement="end"
									/>
								)}
							/>
						</div>
					</div>

					 
					<div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-4">
						<div className="flex items-center justify-between">
							<h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
								🔍 Tìm kiếm sản phẩm liên kết
							</h4>
							{(searchQuery || selectedCategory) && (
								<button
									type="button"
									onClick={() => { setSearchQuery(""); setSelectedCategory(""); }}
									className="text-xs text-blue-600 hover:text-blue-700 font-medium"
								>
									Xóa bộ lọc
								</button>
							)}
						</div>
						
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							 
							<TextField
								label="Tên sản phẩm hoặc ID"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Ví dụ: Camera, Tivi..."
								size="small"
								fullWidth
							/>

						 
							<FormControl fullWidth size="small">
								<InputLabel id="filter-category-label">Lọc theo danh mục</InputLabel>
								<Select
									labelId="filter-category-label"
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
									label="Lọc theo danh mục"
								>
									<MenuItem value="">
										<em>Tất cả danh mục</em>
									</MenuItem>
									{categories.map((cat) => (
										<MenuItem key={cat} value={cat}>
											{cat}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</div>

					 
						<Controller
							name="productId"
							control={control}
							render={({ field }) => (
								<FormControl fullWidth size="medium">
									<InputLabel id="product-link-label">Sản phẩm liên kết (Không bắt buộc)</InputLabel>
									<Select
										labelId="product-link-label"
										id="productId"
										label="Sản phẩm liên kết (Không bắt buộc)"
										{...field}
										value={field.value || ""}
									>
										<MenuItem value="">
											<em>Không liên kết (Mặc định)</em>
										</MenuItem>
										{filteredProducts.map((prod) => (
											<MenuItem key={prod.id} value={String(prod.id)}>
												{prod.name} (ID: {prod.id} - {prod.category?.name || "Khác"})
											</MenuItem>
										))}
										{filteredProducts.length === 0 && (
											<MenuItem disabled value="">
												<span className="text-gray-400 text-sm">Không tìm thấy sản phẩm phù hợp</span>
											</MenuItem>
										)}
									</Select>
								</FormControl>
							)}
						/>
					</div>

				 
					<div className="space-y-2">
						<ImageUploadInput
							name="imageUrl"
							control={control}
							setValue={setValue}
							label="Hình ảnh banner quảng cáo"
							onRemove={() => setValue("imageUrl", "", { shouldValidate: true })}
							skipCrop
						/>
					</div>
				</form>
			</DialogContent>

			<DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
				<button
					onClick={onClose}
					className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
				>
					Hủy
				</button>
				<button
					onClick={handleSubmit(handleFormSubmit)}
					disabled={isSubmitting}
					className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg transition-colors"
				>
					{isSubmitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm banner"}
				</button>
			</DialogActions>
		</Dialog>
	);
}
