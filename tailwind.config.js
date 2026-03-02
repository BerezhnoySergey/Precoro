/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./index.html",
		"./src/**/*.{vue,js,ts,jsx,tsx}",
		"./node_modules/vue-tailwind-datepicker/**/*.{js,ts,vue,mjs}",
	],
	theme: {
		extend: {},
	},
	plugins: [require("@tailwindcss/forms")],
};
