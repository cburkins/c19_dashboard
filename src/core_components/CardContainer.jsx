import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import styled from "styled-components/macro";

// Styled component, which is a CSS-in-JS solution/library (converts to CSS style sheet, not inline)
// When you pass in expression (interpolated function), styled-component library passes you the component props
const DataCardDiv = styled.div`
    a {
        color: ${props => props.theme.currentColorTheme.colorThemeWidgetLinks}; 
    }

    /* In CSS, this used to be the .dataCard class */
    /* props.theme is available inside styled because parent component (app.jsx?) passed via ThemeProvider */

    /* Critical for functionality of dashboard, be careful about changing */
    /* Used for vert/horz centering.  Flex commands only apply to direct children */
    display: flex;
    flex-direction: column;
    /* When content overflows widget, hides overflow and creates a scrollbar */
    overflow: auto;

    /* Not critical, just makes it pretty, so feel free to tweak */
    padding: 5px;
    background: ${props => props.theme.currentColorTheme.colorThemeCardBackground};
    color: ${props => props.theme.currentColorTheme.colorThemeCardFontDefault};
    border-radius: 0.2rem;
    padding: 0.5rem;
    font-size: 1.4vw;
    font-family: "Nunito", "Courier New";
    box-shadow: 5px 5px 5px ${props => props.theme.currentColorTheme.colorThemeCardShadow};
    /* background of the elevator bar (Chrome/Safari) */
    ::-webkit-scrollbar-track {
        background-color: ${props => props.theme.currentColorTheme.colorThemeScrollbarTrackBackground};
        border-radius: 7px;
    }
    /* the elevator bar itself (Chrome/Safari) */
    ::-webkit-scrollbar-thumb {
        background-color: ${props => props.theme.currentColorTheme.colorThemeScrollbarThumbBackground};
        border-radius: 7px;
    }
    /* Both elevator bar and elevator bar background (Firefox) */
    /* prettier-ignore */
    scrollbar-color: ${props => props.theme.currentColorTheme.colorThemeScrollbarThumbBackground} ${props =>
    props.theme.currentColorTheme.colorThemeScrollbarTrackBackground};

    .single-num-title {
        font-size: 1.2vw;
        /* line-height: 2rem; */
        text-align: center;
        font-family: "Nunito", "Courier New";
        padding-bottom: 0.0vw;
    }
    .single-num-subtitle {
        font-size: 0.8vw;
        /* line-height: 2rem; */
        text-align: center;
        font-family: "Nunito", "Courier New";
        padding-bottom: 0.0vw;
    }

    .single-num-value {
        font-size: 3.3vw;
        /* line-height: 4rem; */
        text-align: center;
        /* line-height: normal;ß */
    }
    /* Typically used for large single numbers, outside of tables */
    .redFont {
        color: ${props => props.theme.currentColorTheme.colorThemeCardFontRed};
    }
    .amberFont {
        color: ${props => props.theme.currentColorTheme.colorThemeCardFontAmber};
    }
    .greenFont {
        color: ${props => props.theme.currentColorTheme.colorThemeCardFontGreen};
    }


    /* Create a series of fonts, each one 15% bigger than the last */
    $previous: 0.2;
    @for $i from 0 through 30 {
        .Font#{$i}x {
            font-size: $previous + vw;
            $new: $previous * 1.15;
            $previous: $new;
        }
    }
    
`;

// Create a widget class ---------
class DashboardCardContainer extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = { widgetName: "DashboardCardContainer" };
    }

    hideToolTipIn5Seconds() {
        console.log("Hiding tooltip in 5 seconds...");
        setTimeout(ReactTooltip.hide, 5000);
    }

    render() {
        let styles = {};
        // If the caller passed in styles, use them
        if (this.props.position) {
            styles.gridArea = this.props.position;
        }
        if (this.props.color) {
            styles.backgroundColor = this.props.color;
        }

        return (
            <DataCardDiv
                id={this.props.widgetName}
                style={styles}
                data-tip={this.props["data-tip"]}
                // data-event-off="click"
            >
                {this.props.children}
                <ReactTooltip
                    place="top"
                    type="dark"
                    effect="float"
                    multiline={true}
                    // Show tooltip pop-up when user clicks
                    event="click"
                    // Hide tooltip five seconds are we display it
                    afterShow={this.hideToolTipIn5Seconds}
                    // Show tooltip 40 pixels higher up than default location
                    offset={{ top: 40 }}
                    // Show a white 1px border
                    border={true}
                />
            </DataCardDiv>
        );
    }
}

DashboardCardContainer.propTypes = {
    children: PropTypes.node.isRequired,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    id: PropTypes.string,
    widgetName: PropTypes.string.isRequired,
    "data-tip": PropTypes.string
};

export default DashboardCardContainer;
