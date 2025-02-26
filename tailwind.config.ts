import { transform } from "next/dist/build/swc";
import type { Config } from "tailwindcss";

const svgToDataUri = require("mini-svg-data-uri");
const colors = require("tailwindcss/colors");
const {
	default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
    	extend: {
    		boxShadow: {
    			input: '`0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`'
    		},
    		animation: {
    			spotlight: 'spotlight 2s ease .75s 1 forwards',
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			scroll: 'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
    			'slide-down': 'slideDown 4s linear infinite'
    		},
    		keyframes: {
    			slideDown: {
    				'0%': {
    					transform: 'translateY(0)'
    				},
    				'50%': {
    					transform: 'translateY(-10px)'
    				},
    				'100%': {
    					transform: 'translateY(0)'
    				}
    			},
    			spotlight: {
    				'0%': {
    					opacity: '0',
    					transform: 'translate(-72%, -62%) scale(0.5)'
    				},
    				'100%': {
    					opacity: '1',
    					transform: 'translate(-50%,-40%) scale(1)'
    				}
    			},
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			scroll: {
    				to: {
    					transform: 'translate(calc(-50% - 0.5rem))'
    				}
    			}
    		},
    		colors: {
    			background: 'var(--background)',
    			foreground: 'var(--foreground)',
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		}
    	}
    },
	plugins: [require("tailwindcss-animate"), addVariablesForColors,
	function ({ matchUtilities, theme }: any) {
		matchUtilities(
			{
				"bg-grid": (value: any) => ({
					backgroundImage: `url("${svgToDataUri(
						`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
					)}")`,
				}),
				"bg-grid-small": (value: any) => ({
					backgroundImage: `url("${svgToDataUri(
						`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
					)}")`,
				}),
				"bg-dot": (value: any) => ({
					backgroundImage: `url("${svgToDataUri(
						`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
					)}")`,
				}),
			},
			{ values: flattenColorPalette(theme("backgroundColor")), type: "color" }
		);
	}
	],
};

function addVariablesForColors({ addBase, theme }: any) {
	let allColors = flattenColorPalette(theme("colors"));
	let newVars = Object.fromEntries(
		Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
	);

	addBase({
		":root": newVars,
	});
}
export default config;
