import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";

const CardGridStyledDiv = styled.div`
    /* props.theme is available inside styled because parent component (app.jsx?) passed via ThemeProvider */

    display: grid;

    /* This now gets set dymanically by cardCard.jsx */
    /* grid-template-columns: repeat(6, 1fr); */
    /* grid-template-rows: repeat(6, 1fr); */
    /* height: 60vw; */
    /* height: 1vh; */
    grid-gap: 1.5rem;
    margin: 0 1.5rem 0 1.5rem;

    /* The width of the overall scrollbar (Chrome/Safari) */
    /*  .dataCard, */
    .bodyTableContainerDiv::-webkit-scrollbar {
        width: 0.5em;
    }

    /* background of the elevator bar (Chrome/Safari) */
    .bodyTableContainerDiv::-webkit-scrollbar-track {
        background-color: ${props => props.theme.currentColorTheme.colorThemeScrollbarTrackBackground};
        border-radius: 7px;
    }

    /* the elevator bar itself (Chrome/Safari) */
    .bodyTableContainerDiv::-webkit-scrollbar-thumb {
        background-color: ${props => props.theme.currentColorTheme.colorThemeScrollbarThumbBackground};
        border-radius: 7px;
    }

    /* Both elevator bar and elevator bar background (Firefox) */
    .bodyTableContainerDiv {
        scrollbar-color: var(--colorThemeScrollbarThumbBackground)
            ${props => props.theme.currentColorTheme.colorThemeScrollbarTrackBackground};
    }

    .cellRed {
        background-color: ${props => props.theme.currentColorTheme.colorThemeCardTableCellBackgroundRed};
    }

    .cellAmber {
        background-color: ${props => props.theme.currentColorTheme.colorThemeCardTableCellBackgroundAmber};
    }

    .cellGreen {
        background-color: ${props => props.theme.currentColorTheme.colorThemeCardTableCellBackgroundGreen};
    }
`;

// Create a react functional component
const CardGrid = props => {
    let style = {
        gridTemplateColumns: `repeat(${props.columns}, ${props.column_width})`,
        gridTemplateRows: `repeat(${props.rows},${props.row_height})`
    };
    return <CardGridStyledDiv style={style}>{props.children}</CardGridStyledDiv>;
};

// Set default props in case they aren't passed to us by the caller
CardGrid.defaultProps = {
    column_width: "1fr",
    row_height: "4.0vw"
};

CardGrid.propTypes = {
    rows: PropTypes.string.isRequired,
    columns: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    column_width: PropTypes.string,
    row_height: PropTypes.string
};

export default CardGrid;
