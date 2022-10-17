import zustand from "zustand";

export type TStructure = {
	hide: boolean;
	toggleHide: () => boolean;
	currentTime: number;
	setCurrentTime: (val: number) => number;
	addCurrentTime: (val: number) => number;
	duration: number;
	setDuration: (val: number) => number;
	paused: boolean;
	play: () => void;
	pause: () => void;
	togglePlayPause: () => boolean;
	muted: boolean;
	mute: () => void;
	unmute: () => void;
	toggleMute: () => boolean;
	volume: number;
	addVolume: (val: number) => number;
	setVolume: (val: number) => number;
};

const StateControl = zustand<TStructure>((set) => ({
	hide: false,
	toggleHide: () => {
		let result = false;
		set(({ hide }) => {
			result = !hide;
			return { hide: result };
		});
		return result;
	},
	currentTime: 0,
	setCurrentTime: (val) => {
		let result = 0;
		set(({ duration }) => {
			result = Math.max(0, Math.min(duration, val));
			return { currentTime: result };
		});
		return result;
	},
	addCurrentTime: (val) => {
		let result = 0;
		set(({ currentTime, duration }) => {
			result = Math.max(0, Math.min(duration, currentTime + val));
			return {
				currentTime: result,
			};
		});
		return result;
	},
	duration: 100,
	setDuration: (val) => {
		set({ duration: val });
		return val;
	},
	paused: true,
	play: () => set({ paused: false }),
	pause: () => set({ paused: true }),
	togglePlayPause: () => {
		let result = false;
		set(({ paused }) => {
			result = paused;
			return { paused: !paused };
		});
		return !result;
	},
	muted: false,
	mute: () => set({ muted: true }),
	unmute: () => set({ muted: false }),
	toggleMute: () => {
		let result = false;
		set(({ muted }) => {
			result = !muted;
			return { muted: !muted };
		});
		return result;
	},
	volume: 100,
	addVolume: (val) => {
		let result = 100;
		set(({ volume }) => {
			result = Math.max(0, Math.min(100, volume + val));
			return {
				volume: result,
			};
		});
		return result;
	},
	setVolume: (val) => {
		set({ volume: val });
		return val;
	},
}));

export default StateControl;
