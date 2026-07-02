"use client";
import React from "react";
import { Order } from "~/types/order";
import { formatPrice } from "~/utils/format";

interface InvoiceTemplateProps {
	order: Order;
	id: string;
}

export default function InvoiceTemplate({ order, id }: InvoiceTemplateProps) {
	const subtotal = Number(order.subtotal || 0);
	const tax = Number(order.taxAmount || 0);
	const shippingCost = Number(order.shippingCost || 0);
	const discount = Number(order.discount || 0);
	const shippingDiscount = Number(order.shippingDiscount || 0);
	const total = Number(order.totalAmount || 0);

	const formattedDate = order.createdAt
		? new Date(order.createdAt).toLocaleDateString("vi-VN", {
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
		  })
		: "";

	const invoiceDate = new Date().toLocaleDateString("vi-VN", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const isCOD = order.paymentMethod !== "VNPAY";

	return (
		<div
			id={id}
			style={{
				width: "800px",
				padding: "48px",
				fontFamily: "Inter, system-ui, -apple-system, sans-serif",
				boxSizing: "border-box",
				lineHeight: "1.5",
				backgroundColor: "#ffffff",
				color: "#111827",
				border: "1px solid #d1d5db",
			}}
		>
			{/* Header Table (All layout and dividers kept strictly inside table rows to prevent html2canvas overlap) */}
			<table
				style={{
					width: "100%",
					borderCollapse: "collapse",
					marginBottom: "24px",
				}}
			>
				<tbody>
					<tr>
						<td style={{ verticalAlign: "top", width: "55%", paddingBottom: "16px" }}>
							<h2 style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "0.05em", color: "#1e1b4b", margin: "0 0 6px 0" }}>
								CYBER SHOP
							</h2>
							<p style={{ fontSize: "12px", color: "#6b7280", maxWidth: "320px", margin: "0 0 12px 0" }}>
								Hệ thống cửa hàng công nghệ & thiết bị điện tử thông minh hàng đầu Việt Nam.
							</p>
							<div style={{ fontSize: "12px", color: "#4b5563", lineHeight: "1.6" }}>
								<p style={{ margin: "2px 0" }}>
									<strong style={{ color: "#1f2937" }}>Địa chỉ:</strong> Tầng 2, Số 9 Văn Miếu, Đống Đa, Hà Nội
								</p>
								<p style={{ margin: "2px 0" }}>
									<strong style={{ color: "#1f2937" }}>Hotline:</strong> 1900 232 461 |{" "}
									<strong style={{ color: "#1f2937" }}>Email:</strong> support@cyberstore.vn
								</p>
								<p style={{ margin: "2px 0" }}>
									<strong style={{ color: "#1f2937" }}>Mã số thuế:</strong> 0102030405
								</p>
							</div>
						</td>
						<td style={{ verticalAlign: "top", width: "45%", textAlign: "right", paddingBottom: "16px" }}>
							<h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1e1b4b", margin: "0 0 6px 0" }}>
								HÓA ĐƠN BÁN HÀNG
							</h1>
							<p style={{ fontSize: "14px", fontWeight: 600, color: "#374151", margin: "0 0 2px 0" }}>
								Mã HĐ: <span style={{ color: "#4338ca" }}>{order.orderNo}</span>
							</p>
							<p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0" }}>
								Ngày đặt: {formattedDate}
							</p>
							<p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0" }}>
								Ngày xuất HĐ: {invoiceDate}
							</p>
						</td>
					</tr>
					{/* Header Divider (Wrapped inside td to ensure it is drawn strictly below the content) */}
					<tr>
						<td colSpan={2} style={{ paddingTop: "8px", paddingBottom: "8px" }}>
							<div
								style={{
									height: "2px",
									backgroundColor: "#1f2937",
									width: "100%",
								}}
							/>
						</td>
					</tr>
				</tbody>
			</table>

			{/* Customer & Shipping Info Table */}
			<table
				style={{
					width: "100%",
					borderCollapse: "collapse",
					marginBottom: "24px",
					backgroundColor: "#f9fafb",
					border: "1px solid #e5e7eb",
					borderRadius: "6px",
				}}
			>
				<tbody>
					<tr>
						<td style={{ verticalAlign: "top", width: "50%", padding: "20px", borderRight: "1px solid #e5e7eb" }}>
							<h3 style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>
								Thông tin khách hàng
							</h3>
							<div style={{ fontSize: "13px", color: "#1f2937", lineHeight: "1.5" }}>
								<p style={{ fontWeight: 600, color: "#000000", margin: "0 0 4px 0" }}>
									{order.address?.receiverName || order.customer?.fullName || "Khách hàng"}
								</p>
								{order.customer?.email && <p style={{ margin: 0 }}>Email: {order.customer.email}</p>}
							</div>
						</td>
						<td style={{ verticalAlign: "top", width: "50%", padding: "20px" }}>
							<h3 style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>
								Địa chỉ nhận hàng
							</h3>
							{order.address ? (
								<div style={{ fontSize: "13px", color: "#1f2937", lineHeight: "1.5" }}>
									<p style={{ fontWeight: 600, color: "#000000", margin: "0 0 4px 0" }}>
										Người nhận: {order.address.receiverName}
									</p>
									<p style={{ margin: "0 0 2px 0" }}>SĐT: {order.address.phone}</p>
									<p style={{ margin: 0 }}>Địa chỉ: {order.address.address}</p>
								</div>
							) : (
								<p style={{ fontSize: "13px", fontStyle: "italic", color: "#9ca3af", margin: 0 }}>
									Không tìm thấy thông tin địa chỉ
								</p>
							)}
						</td>
					</tr>
				</tbody>
			</table>

			{/* Products Table */}
			<div style={{ marginBottom: "24px" }}>
				<table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
					<thead>
						<tr style={{ backgroundColor: "#f3f2ff" }}>
							<th
								style={{
									padding: "10px 12px",
									fontWeight: 700,
									fontSize: "11px",
									textTransform: "uppercase",
									letterSpacing: "0.05em",
									width: "48px",
									textAlign: "center",
									color: "#1e1b4b",
									borderBottom: "2px solid #1e1b4b",
								}}
							>
								STT
							</th>
							<th
								style={{
									padding: "10px 12px",
									fontWeight: 700,
									fontSize: "11px",
									textTransform: "uppercase",
									letterSpacing: "0.05em",
									color: "#1e1b4b",
									borderBottom: "2px solid #1e1b4b",
								}}
							>
								Sản phẩm
							</th>
							<th
								style={{
									padding: "10px 12px",
									fontWeight: 700,
									fontSize: "11px",
									textTransform: "uppercase",
									letterSpacing: "0.05em",
									textAlign: "center",
									color: "#1e1b4b",
									borderBottom: "2px solid #1e1b4b",
								}}
							>
								Đơn giá
							</th>
							<th
								style={{
									padding: "10px 12px",
									fontWeight: 700,
									fontSize: "11px",
									textTransform: "uppercase",
									letterSpacing: "0.05em",
									textAlign: "center",
									width: "80px",
									color: "#1e1b4b",
									borderBottom: "2px solid #1e1b4b",
								}}
							>
								SL
							</th>
							<th
								style={{
									padding: "10px 12px",
									fontWeight: 700,
									fontSize: "11px",
									textTransform: "uppercase",
									letterSpacing: "0.05em",
									textAlign: "right",
									width: "144px",
									color: "#1e1b4b",
									borderBottom: "2px solid #1e1b4b",
								}}
							>
								Thành tiền
							</th>
						</tr>
					</thead>
					<tbody>
						{order.orderItems?.map((item, index) => {
							const selectedVariant = (item.product as any)?.variants?.find(
								(v: any) => Number(v.id) === Number((item as any).variantId),
							);
							const itemTotal = Number(item.unitPrice) * item.quantity;
							return (
								<tr key={item.id}>
									<td
										style={{
											padding: "12px",
											fontSize: "13px",
											color: "#6b7280",
											textAlign: "center",
											borderBottom: "1px solid #e5e7eb",
										}}
									>
										{index + 1}
									</td>
									<td style={{ padding: "12px", fontSize: "13px", borderBottom: "1px solid #e5e7eb" }}>
										<p style={{ fontWeight: 600, color: "#000000", margin: 0 }}>
											{item.product?.name || "Tên sản phẩm"}
										</p>
										{(item.colorId || selectedVariant) && (
											<div style={{ fontSize: "11px", color: "#6b7280", display: "flex", gap: "10px", marginTop: "3px" }}>
												{item.colorId && <span>Màu: {item.colorId}</span>}
												{selectedVariant && <span>SKU: {selectedVariant.sku}</span>}
											</div>
										)}
									</td>
									<td
										style={{
											padding: "12px",
											fontSize: "13px",
											color: "#374151",
											textAlign: "center",
											borderBottom: "1px solid #e5e7eb",
										}}
									>
										{formatPrice(Number(item.unitPrice))}
									</td>
									<td
										style={{
											padding: "12px",
											fontSize: "13px",
											color: "#374151",
											textAlign: "center",
											borderBottom: "1px solid #e5e7eb",
										}}
									>
										{item.quantity}
									</td>
									<td
										style={{
											padding: "12px",
											fontSize: "13px",
											fontWeight: 600,
											color: "#000000",
											textAlign: "right",
											borderBottom: "1px solid #e5e7eb",
										}}
									>
										{formatPrice(itemTotal)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* Summary Details Table (Wrapped inside Table for absolute alignment and row boundaries) */}
			<div
				style={{
					display: "flex",
					justifyContent: "flex-end",
					marginBottom: "32px",
				}}
			>
				<table style={{ width: "320px", borderCollapse: "collapse", fontSize: "13px" }}>
					<tbody>
						<tr>
							<td style={{ padding: "4px 0", color: "#4b5563" }}>Tạm tính</td>
							<td style={{ padding: "4px 0", fontWeight: 500, color: "#111827", textAlign: "right" }}>
								{formatPrice(subtotal)}
							</td>
						</tr>
						<tr>
							<td style={{ padding: "4px 0", color: "#4b5563" }}>Thuế (VAT 10%)</td>
							<td style={{ padding: "4px 0", fontWeight: 500, color: "#111827", textAlign: "right" }}>
								{formatPrice(tax)}
							</td>
						</tr>
						<tr>
							<td style={{ padding: "4px 0", color: "#4b5563" }}>Phí vận chuyển</td>
							<td style={{ padding: "4px 0", fontWeight: 500, color: "#111827", textAlign: "right" }}>
								{shippingCost === 0 && shippingDiscount === 0 ? "Miễn phí" : formatPrice(shippingCost)}
							</td>
						</tr>
						{shippingDiscount > 0 && (
							<tr>
								<td style={{ padding: "4px 0", color: "#16a34a", fontWeight: 500 }}>Giảm phí ship</td>
								<td style={{ padding: "4px 0", color: "#16a34a", fontWeight: 500, textAlign: "right" }}>
									-{formatPrice(shippingDiscount)}
								</td>
							</tr>
						)}
						{discount > 0 && (
							<tr>
								<td style={{ padding: "4px 0", color: "#16a34a", fontWeight: 500 }}>Khuyến mãi áp dụng</td>
								<td style={{ padding: "4px 0", color: "#16a34a", fontWeight: 500, textAlign: "right" }}>
									-{formatPrice(discount)}
								</td>
							</tr>
						)}
						{/* Total Divider row */}
						<tr>
							<td colSpan={2} style={{ paddingTop: "8px", paddingBottom: "8px" }}>
								<div style={{ height: "2px", backgroundColor: "#1e1b4b", width: "100%" }} />
							</td>
						</tr>
						<tr style={{ color: "#1e1b4b", fontWeight: 900, fontSize: "18px" }}>
							<td style={{ padding: "4px 0" }}>Tổng cộng</td>
							<td style={{ padding: "4px 0", textAlign: "right" }}>{formatPrice(total)}</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* Payment status & sign-off Table */}
			<table
				style={{
					width: "100%",
					borderCollapse: "collapse",
					marginTop: "24px",
				}}
			>
				<tbody>
					{/* Footer Divider row */}
					<tr>
						<td colSpan={2} style={{ paddingBottom: "16px" }}>
							<div style={{ height: "1px", backgroundColor: "#e5e7eb", width: "100%" }} />
						</td>
					</tr>
					<tr>
						<td style={{ verticalAlign: "bottom", width: "50%" }}>
							<h3 style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>
								Trạng thái thanh toán
							</h3>
							<div style={{ fontSize: "12px", color: "#374151", lineHeight: "1.6" }}>
								<p style={{ margin: "2px 0" }}>
									<span style={{ color: "#4b5563" }}>Hình thức:</span>{" "}
									<strong style={{ color: "#1f2937" }}>
										{isCOD ? "Thanh toán khi nhận hàng (COD)" : "Thanh toán qua VNPay"}
									</strong>
								</p>
								<p style={{ margin: "2px 0" }}>
									<span style={{ color: "#4b5563" }}>Trạng thái:</span>{" "}
									<span
										style={{
											fontWeight: 600,
											color: order.paymentStatus === "paid" ? "#16a34a" : "#f59e0b",
										}}
									>
										{order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
									</span>
								</p>
								{!isCOD && order.txnRef && (
									<p style={{ margin: "2px 0" }}>
										<span style={{ color: "#4b5563" }}>Mã giao dịch:</span>{" "}
										<span style={{ fontFamily: "monospace", color: "#4b5563" }}>{order.txnRef}</span>
									</p>
								)}
							</div>
						</td>
						<td style={{ verticalAlign: "bottom", width: "50%", textAlign: "center" }}>
							<p style={{ fontSize: "12px", fontStyle: "italic", color: "#6b7280", margin: "0 0 54px 0" }}>
								Cảm ơn quý khách đã mua sắm tại Cyber Shop!
							</p>
							<div
								style={{
									display: "inline-block",
									borderTop: "1px solid #d1d5db",
									paddingLeft: "32px",
									paddingRight: "32px",
									paddingTop: "6px",
								}}
							>
								<p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#374151", margin: 0 }}>
									Người bán hàng
								</p>
								<p style={{ fontSize: "10px", color: "#9ca3af", margin: "2px 0 0 0" }}>
									Hóa đơn điện tử ký số bởi Cyber Shop
								</p>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
