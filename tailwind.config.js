module.exports = {
	purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			screens: {
				'xs': '370px'
			}
		}
	},
	variants: {
		extend: {},
	},
	plugins: [],
}