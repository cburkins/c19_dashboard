import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import styled from "styled-components/macro";

// Styled component, which is a CSS-in-JS solution/library (converts to CSS style sheet, not inline)
// When you pass in expression (interpolated function), styled-component library passes you the component props
const CardTableDiv = styled.table`
    /* NOTE: This is at the <table> level of the DOM */
    /* props.theme is available inside styled because parent component (app.jsx?) passed via ThemeProvider */

    /* remove the double border between cells, make it a single border */
    border-collapse: collapse;
    /* Center the table left/right in it's containing div */
    margin: 0 auto;
    font-size: 0.6vw;

    /* Only direct tbody children of this styled table */
    & > tbody {
        /* border: 1px solid ${(props) => props.theme.currentColorTheme.colorThemeCardTableGridLines}; */
        margin: 0 auto;
        background: ${(props) => props.theme.currentColorTheme.colorThemeCardTableBackground};

        td {
            border: 2px solid ${(props) => props.theme.currentColorTheme.colorThemeCardTableGridLines};
            padding: 0.2rem 0.5rem 0.2rem 0.5rem;

            /* Without this, super-long strings (without spaces) cause table cell to expand (without wrapping text) */
            word-break: break-word;

            &.redFont {
                color: ${(props) => props.theme.currentColorTheme.colorThemeCardFontRed};
                font-weight: 700;
            }
            &.amberFont {
                color: ${(props) => props.theme.currentColorTheme.colorThemeCardFontAmber};
                font-weight: 700;
            }
            &.greenFont {
                color: ${(props) => props.theme.currentColorTheme.colorThemeCardFontGreen};
                font-weight: 700;
            }

            &.tdRed {
                color: ${(props) => props.theme.currentColorTheme.colorThemeCardFontRed};
            }

            &.blueFont {
                color: ${(props) => props.theme.currentColorTheme.colorThemeCardFontBlue};
                font-weight: 700;
            }
        }
    }
    thead {
        font-size: 0.8vw;
        font-weight: 700;
    }
`;

// Create a widget class ---------
class CardTable extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = { widgetName: "CardTable" };
    }

    hideToolTipIn5Seconds() {
        console.log("Hiding tooltip in 5 seconds...");
        setTimeout(ReactTooltip.hide, 5000);
    }

    render() {
        return <CardTableDiv style={{ ...this.props.style }}>{this.props.children}</CardTableDiv>;
    }
}

CardTable.propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object,
};

export default CardTable;
