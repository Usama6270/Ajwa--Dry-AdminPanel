export const tokensDark = {
  grey: {
    0: "#ffffff", 
    10: "#f5f5f5", 
    50: "#e0e0e0", 
    100: "#b0b0b0", 
    200: "#8a8a8a", 
    300: "#6a6a6a", 
    400: "#4a4a4a", 
    500: "#333333", 
    600: "#1c1c1c", 
    700: "#121212", 
    800: "#0a0a0a", 
    900: "#0a0a0a", 
    1000: "#0a0a0a", 
  },
  primary: {
    100: "#f4e1c1", 
    200: "#e8c69b", 
    300: "#d1a55d", 
    400: "#bb7e2d", 
    500: "#9a5d0b", 
    600: "#7a4507", 
    700: "#5c2e04", 
    800: "#3e1802", 
    900: "#2b1302", 
  },
  secondary: {
    50: "#f8ebc2", 
    100: "#f0d99f", 
    200: "#e0c77a", 
    300: "#d1b35d", 
    400: "#c19c2f", 
    500: "#a17c14", 
    600: "#7f5b0e", 
    700: "#5e450c", 
    800: "#3e2e0b", 
    900: "#2e1e09", 
  },
  text: {
    primary: "#ffffff", // Use white text on dark backgrounds for readability
    secondary: "#b0b0b0", // Lighter grey for secondary text
    disabled: "#4a4a4a", // Subtle grey for disabled text
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

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[400],
              light: tokensDark.primary[400],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[300],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.primary[600],
              alt: tokensDark.primary[500],
            },
            text: {
              primary: tokensDark.text.primary,
              secondary: tokensDark.text.secondary,
              disabled: tokensDark.text.disabled,
            },
          }
        : {
            primary: {
              ...tokensLight.primary,
              main: tokensDark.grey[50],
              light: tokensDark.grey[100],
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensDark.secondary[600],
              light: tokensDark.secondary[700],
            },
            neutral: {
              ...tokensLight.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[0],
              alt: tokensDark.grey[50],
            },
            text: {
              primary: "#333333", // Dark text for better contrast on light backgrounds
              secondary: "#6a6a6a", // Grey secondary text
              disabled: "#b0b0b0", // Lighter grey for disabled text
            },
          }),
    },
    typography: {
      fontFamily: ["Arial", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Arial", "sans-serif"].join(","),
        fontSize: 40,
        color: mode === "dark" ? "#ffffff" : "#333333", // Ensure H1 has good contrast
      },
      h2: {
        fontFamily: ["Arial", "sans-serif"].join(","),
        fontSize: 32,
        color: mode === "dark" ? "#ffffff" : "#333333", // Ensure H2 has good contrast
      },
      h3: {
        fontFamily: ["Arial", "sans-serif"].join(","),
        fontSize: 24,
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
