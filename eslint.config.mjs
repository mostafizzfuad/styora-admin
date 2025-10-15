// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	// Next.js presets (keep these first)
	...compat.extends("next/core-web-vitals", "next/typescript"),

	{
		rules: {
			"@typescript-eslint/no-explicit-any": "warn", // or "off"
			"@next/next/no-img-element": "warn", // or "off"
		},
	},

	// (optional) ignore patterns
	{
		ignores: [
			"node_modules/**",
			".next/**",
			"out/**",
			"build/**",
			"next-env.d.ts",
		],
	},
];

export default eslintConfig;
