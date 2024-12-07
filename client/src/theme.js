export const tokensDark = {
  grey: {
    0: "#ffffff", // manually adjusted
    10: "#f6f6f6", // manually adjusted
    50: "#f0f0f0", // manually adjusted
    100: "#e0e0e0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
    1000: "#0a0a0a", // Darker black (adjusted)
  },
  primary: {
    // Purple shades replacing aqua
    100: "#f2e6ff", // Light purple
    200: "#d9b3ff", // Soft purple
    300: "#bf80ff", // Lighter purple
    400: "#a64dff", // Normal purple
    500: "#8c1aff", // Default purple
    600: "#6f00cc", // Darker purple
    700: "#520099", // Even darker purple
    800: "#3a0066", // Darkest purple shade
    900: "#1d0033", // Near black purple tone
  },
  secondary: {
    // Yellow
    50: "#f0f0f0", // manually adjusted
    100: "#fff6e0",
    200: "#ffedc2",
    300: "#ffe3a3",
    400: "#ffda85",
    500: "#ffd166",
    600: "#cca752",
    700: "#997d3d",
    800: "#665429",
    900: "#332a14",
  },
};

function reverseTokens(tokensDark) {
  const reversedTokens = {};
  Object.entries(tokensDark).forEach(([key, val]) => {
    const keys = Object.keys(val);
    const values = Object.values(val);
    const length = keys.length;
    const reversedObj = {};
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key] = reversedObj;
  });
  return reversedTokens;
}

export const tokensLight = reverseTokens(tokensDark);

// MUI theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[400], // Medium purple for primary elements
              light: tokensDark.primary[300], // Lighter purple for hover
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[300], // Soft yellow for accents
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.primary[900], // Deep purple for dark mode background
              alt: tokensDark.primary[800], // Slightly lighter purple for alt backgrounds
            },
            text: {
              primary: "#ffffff", // White text for high contrast
              secondary: "#d1c4e9", // Light lavender for secondary text
              disabled: "#a899b9", // Muted lavender for disabled text
            },
          }
        : {
            primary: {
              ...tokensLight.primary,
              main: tokensLight.primary[500], // Purple for primary elements
              light: tokensLight.primary[400], // Softer purple for hover
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensLight.secondary[600], // Dark yellow for accents
              light: tokensLight.secondary[700], // Muted yellow for hover
            },
            neutral: {
              ...tokensLight.grey,
              main: tokensLight.grey[700], // Medium grey for neutral text
            },
            background: {
              default: tokensLight.grey[0], // White for light mode background
              alt: tokensLight.grey[10], // Very light grey for alt backgrounds
            },
            text: {
              primary: "#333333", // Dark text for readability on light backgrounds
              secondary: "#5a5a5a", // Grey for secondary text
              disabled: "#b0b0b0", // Light grey for disabled text
            },
          }),
    },
    typography: {
      fontFamily: ["Arial", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Arial", "sans-serif"].join(","),
        fontSize: 40,
        color: mode === "dark" ? "#ffffff" : "#333333", // High contrast for headers
      },
      h2: {
        fontFamily: ["Arial", "sans-serif"].join(","),
        fontSize: 32,
        color: mode === "dark" ? "#ffffff" : "#333333", // High contrast for headers
      },
      h3: {
        fontFamily: ["Arial", "sans-serif"].join(","),
        fontSize: 24,
        color: mode === "dark" ? "#d1c4e9" : "#5a5a5a", // Subtle contrast for smaller headers
      },
      h4: {
        fontFamily: ["Arial", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Arial", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Arial", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
