// 3rd party imports
import React from "react";

// My own imports
import Dashboard from "./Dashboard";
import "../scss/main.scss";
import { ThemeProvider } from "styled-components";

// Diagnostic tool that describes why React component updated (rendered), put helpful logging to concole
if (process.env.NODE_ENV !== "production") {
}

let theme = {
    darkColorTheme: {
        // Page
        colorThemePageBackground: "#636977",
        colorThemePageTitle: "#bbb3b3",

        // Default
        colorThemeFontDefault: "#bbb3b3",

        // Card
        colorThemeCardBackground: "#2b2d3e",
        colorThemeCardShadow: "#1c1c1c",
        colorThemeCardFontDefault: "#eeeeee",
        colorThemeCardFontBlue: "#0bc2f0",
        colorThemeCardFontRed: "#ff6666",
        colorThemeCardFontAmber: "#e46e00",
        colorThemeCardFontGreen: "#66ff66",
        colorThemeCardTableBackground: "#242424",
        colorThemeCardTableGridLines: "#6b6b6b",
        colorThemeCardTableCellBackgroundRed: "#af0000",
        colorThemeCardTableCellBackgroundAmber: "#e46e00",
        colorThemeCardTableCellBackgroundGreen: "#009c00",

        // LeftNav
        colorThemeLeftNavButtons: "#bbb3b3",
        colorThemeLeftNavLinks: "#bbb3b3",
        colorThemeLeftNavLinksHover: "#4183c4",

        // Widget Links
        colorThemeWidgetLinks: "#6c9ccb",

        // Scrollbar
        colorThemeScrollbarTrackBackground: "#5c5f7a",
        colorThemeScrollbarThumbBackground: "#988b8b",

        // Chart
        colorThemeChartData: "#5e85c5",
        colorThemeChartGridlines: "#737373",
        colorThemeChartGreen: "#338a2e",
        colorThemeChartBrown: "#aa7c39",
        colorThemeChartPurple: "#e749e7"
    },

    lightColorTheme: {
        // Page
        colorThemePageBackground: "#d7d8db",
        colorThemePageTitle: "#000000",

        // Default
        colorThemeFontDefault: "#000000",

        // Card
        colorThemeCardBackground: "#c3c4c6",
        colorThemeCardShadow: "#1c1c1c",
        colorThemeCardFontDefault: "#000000",
        colorThemeCardFontBlue: "#0159b7",
        colorThemeCardFontRed: "#ff6666",
        colorThemeCardFontAmber: "#cd7d32",
        colorThemeCardFontGreen: "#36a336",
        colorThemeCardTableBackground: "#d9d8d8",
        colorThemeCardTableGridLines: "#969696",
        colorThemeCardTableCellBackgroundRed: "#a93737",
        colorThemeCardTableCellBackgroundAmber: "#cd7d32",
        colorThemeCardTableCellBackgroundGreen: "#2fb12f",

        // Left Nav
        colorThemeLeftNavButtons: "#bbb3b3",
        colorThemeLeftNavLinks: "#bbb3b3",
        colorThemeLeftNavLinksHover: "#4183c4",

        // Widget Links
        colorThemeWidgetLinks: "#4183c4",

        // Srollbar
        colorThemeScrollbarTrackBackground: "#ebebeb",
        colorThemeScrollbarThumbBackground: "#9c9c9c",

        // Chart
        colorThemeChartData: "#192453",
        colorThemeChartGreen: "#338a2e",
        colorThemeChartBrown: "#aa7c39",
        colorThemeChartPurple: "#6f256f"
    },
    currentColorTheme: null
};

// Select/Pick/Toggle a color theme to use
// theme.currentColorTheme = theme.lightColorTheme;
theme.currentColorTheme = theme.darkColorTheme;

// Apply the chose color theme to all of our CSS color variables
Object.entries(theme.currentColorTheme).forEach(color => {
    let colorName = color[0];
    let colorHexCode = color[1];
    // We're reaching into CSS root style sheet, and updating known variable names
    document.documentElement.style.setProperty("--" + colorName, colorHexCode);
});

class App extends React.Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                {/* 300k = 5m, 900k = 15m, 3600k = 60m */}
                <Dashboard reloadInterval={3 * 60 * 60 * 1000} refreshInterval={120 * 1000} theme={theme.current} />
            </ThemeProvider>
        );
    }
}

export default App;
