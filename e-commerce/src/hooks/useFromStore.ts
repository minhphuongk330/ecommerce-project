import { useState, useEffect } from "react";

export function useFromStore<T, F>(
	store: (callback: (state: T) => unknown) => unknown,
	storeCallback: (state: T) => F
) {
	const result = store(storeCallback) as F;
	const [state, setState] = useState<F>();

	useEffect(() => {
		setState(result);
	}, [result]);

	return state;
}
