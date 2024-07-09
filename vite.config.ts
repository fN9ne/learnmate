import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react-swc";

import { defineConfig } from "vite";

import path from "path";

export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@icons": path.resolve(__dirname, "./src/img/icons"),
			"@UI": path.resolve(__dirname, "./src/components/UI"),
		},
	},
	plugins: [react(), svgr()],
});
