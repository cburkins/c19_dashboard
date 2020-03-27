import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import { withTheme } from "styled-components/macro";

// Styled component, which is a CSS-in-JS solution/library (converts to CSS style sheet, not inline)
// When you pass in expression (interpolated function), styled-component library passes you the component props
const VersionTitleNestedOuter = styled.div`
    /* In CSS, this used to be the .versionTitleNestedOuter class */

    /* Visual styling */
    white-space: nowrap;
    /* Positioning of outer div */
    /* position: absolute; */
    /* left: 33px; */
    /* top: 30px; */
    /* Transform: origin is top/left */
    transform-origin: 0% 0%;
    /* Transform goes right to left (first rotate, then translate/move) */
    transform: translate(3vw, 15vw) rotate(90deg);
`;

const VersionTitleNestedInner = styled.div`
    /* In CSS, this used to be the .versionTitleNestedOuter class */
    /* props.theme is available inside styled because parent component (app.jsx?) passed via ThemeProvider */

    /* In a nested Div, the outer div transform gets done first, then inner */
    /* Flip the div (set rotation-origin at center of div, then rotate 180 degrees) */
    transform-origin: 50% 50%;
    transform: rotate(180deg);

    /* opacity: 0.2; */
    color: ${props => props.theme.currentColorTheme.colorThemeCardFontDefault};
    font-family: "Lato", "Courier New";
`;

// Create a react functional component ---------
const RotatedLeftEdgeTitle = props => {
    console.log("props in RotatedLeftEdge:", props);
    // Based on env (e.g. "test" or "local") choose a font color
    let envColor = props.environment.includes("local")
        ? "yellow"
        : props.environment.includes("staging")
        ? "red"
        : props.theme.currentColorTheme.colorThemeCardFontDefault;

    return (
        <VersionTitleNestedOuter>
            <VersionTitleNestedInner style={{ fontSize: "2.4vw" }}>
                <span style={{ color: envColor, opacity: "1.0" }}>{props.environment}</span> <span style={{ opacity: "0.2" }}>v{props.version}</span>
            </VersionTitleNestedInner>
        </VersionTitleNestedOuter>
    );
};

RotatedLeftEdgeTitle.propTypes = {
    theme: PropTypes.object,
    children: PropTypes.node,
    environment: PropTypes.string,
    version: PropTypes.string
};

// React.memo is a HOC that prevents functional components (like this) from re-rendering when there are no changes
// withTheme() is React HOC that injects theme so we can use this.props.theme inside component (beyond styled div)
export default withTheme(React.memo(RotatedLeftEdgeTitle));
