import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginString from "vite-plugin-string";

// https://vitejs.dev/config/
export default defineConfig({
	base: "",
	plugins: [
		react(),
		// I don't know why
		vitePluginString.default({
			include: ["src/shaders/*.glsl"],
			exclude: "node_modules/**",
			compress: false,
		}),
	],
});
