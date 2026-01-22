import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import type { SnackbarCloseReason, AlertColor } from "@mui/material";

interface NotificationContextType {
	showNotification: (message: string, type: AlertColor) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error("useNotification must be used within a NotificationProvider");
	}
	return context;
};

export const NotificationProvider = React.memo(function NotificationProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [severity, setSeverity] = useState<AlertColor>("success");

	const showNotification = useCallback((msg: string, type: AlertColor) => {
		setOpen(false);
		setTimeout(() => {
			setMessage(msg);
			setSeverity(type);
			setOpen(true);
		}, 0);
	}, []);

	const handleClose = useCallback((event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
		if (reason === "clickaway") return;
		setOpen(false);
	}, []);

	const contextValue = useMemo(() => ({ showNotification }), [showNotification]);

	return (
		<NotificationContext.Provider value={contextValue}>
			{children}

			<Snackbar
				open={open}
				autoHideDuration={2000}
				onClose={handleClose}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
					{message}
				</Alert>
			</Snackbar>
		</NotificationContext.Provider>
	);
});
