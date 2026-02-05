interface ListenerRegistry {
	listeners: Map<Function, boolean>;
	count: number;
}

const globalListeners = new Map<string, ListenerRegistry>();

export const addEventListenerOnce = (
	target: EventTarget,
	eventType: string,
	handler: EventListener,
	options?: boolean | AddEventListenerOptions,
) => {
	const key = `${eventType}`;
	const isPassive = typeof options === "boolean" ? false : (options?.passive ?? false);

	if (!globalListeners.has(key)) {
		globalListeners.set(key, {
			listeners: new Map(),
			count: 0,
		});
	}

	const registry = globalListeners.get(key)!;

	if (registry.listeners.has(handler)) {
		return;
	}
	registry.listeners.set(handler, true);
	registry.count++;
	target.addEventListener(eventType, handler, {
		...(typeof options === "object" ? options : {}),
		passive: isPassive || eventType === "scroll",
	} as AddEventListenerOptions);
};

export const removeEventListenerOnce = (target: EventTarget, eventType: string, handler: EventListener) => {
	const key = `${eventType}`;
	const registry = globalListeners.get(key);
	if (!registry || !registry.listeners.has(handler)) {
		return;
	}
	registry.listeners.delete(handler);
	registry.count--;
	target.removeEventListener(eventType, handler);
	if (registry.count === 0) {
		globalListeners.delete(key);
	}
};

export const clearAllEventListeners = () => {
	globalListeners.clear();
};
