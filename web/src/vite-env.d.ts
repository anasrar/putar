/// <reference types="vite/client" />

declare module "*.glsl" {
	export default string;
}

interface ImportMetaEnv {
	readonly VITE_PUTAR_TARGET: "web" | "electron";
	readonly VITE_PUTAR_VERSION: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
