import zustand from "zustand";

export type TStructure = {
	modal: boolean;
	toggleModal: () => void;
};

const StateKeymaps = zustand<TStructure>((set) => ({
	modal: false,
	toggleModal: () => set(({ modal }) => ({ modal: !modal })),
}));

export default StateKeymaps;
