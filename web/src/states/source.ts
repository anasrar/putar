import zustand from "zustand";

export type TStructure = {
	dropZone: boolean;
	setDropZone: (val: boolean) => boolean;
	blob: string;
	setBlob: (val: string) => string;
	type: string;
	setType: (val: string) => string;
};

const StateSource = zustand<TStructure>((set) => ({
	dropZone: true,
	setDropZone: (val: boolean) => {
		set({
			dropZone: val,
		});
		return val;
	},
	blob: "",
	setBlob: (val) => {
		set(({ blob }) => {
			window.URL.revokeObjectURL(blob);
			return { blob: val };
		});
		return val;
	},
	type: "image/png",
	setType: (val) => {
		set({ type: val });
		return val;
	},
}));

export default StateSource;
