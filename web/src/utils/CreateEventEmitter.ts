const CreateEventEmitter = <
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TEvents extends Record<string, (...arg: any[]) => any>
>() => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const callbacks = {} as Record<keyof TEvents, ((...arg: any[]) => any)[]>;

	return {
		addEventListener: <
			TChannel extends keyof TEvents,
			TCallback extends TEvents[TChannel]
		>(
			channel: TChannel,
			cb: TCallback
		) => {
			if (!Object.hasOwn(callbacks, channel)) {
				callbacks[channel] = [];
			}

			callbacks[channel].push(cb);

			return () => {
				const index = callbacks[channel].indexOf(cb);
				callbacks[channel].splice(index, 1);
			};
		},

		emmit: <
			TChannel extends keyof TEvents,
			TParameters extends TEvents[TChannel]
		>(
			channel: TChannel,
			...parameters: Parameters<TParameters>
		) => {
			if (!Object.hasOwn(callbacks, channel)) {
				callbacks[channel] = [];
			}

			for (const cb of callbacks[channel]) {
				cb(...parameters);
			}
		},
	};
};

export default CreateEventEmitter;
