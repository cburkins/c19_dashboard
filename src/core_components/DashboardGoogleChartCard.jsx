import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";

// --------------------------------------------------------------------------------------------
// Unlike ChartJS card, this GoogleChart does NOT have to listen for window resize events
// --------------------------------------------------------------------------------------------

const GoogleChartCardDiv = styled.div`
    /* props.theme is available inside styled because parent component (app.jsx?) passed via ThemeProvider */

    background-color: ${props => props.theme.currentColorTheme.colorThemeCardBackground};
    border-radius: 0.2rem;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    /* Google chart creates a div, so style that immediate child as a flex item so we can easily center our content */
    & > div {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

// Create a widget class --------
class DashboardGoogleChartCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "DashboardGoogleChartCard" };
    }

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        return <GoogleChartCardDiv id={this.props.id}>{this.props.children}</GoogleChartCardDiv>;
    }
}

DashboardGoogleChartCard.propTypes = {
    children: PropTypes.node.isRequired,
    color: PropTypes.string,
    id: PropTypes.string
};

export default DashboardGoogleChartCard;
