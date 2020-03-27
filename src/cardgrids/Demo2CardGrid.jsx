// 3rd party imports
import React from "react";
import PropTypes from "prop-types";

// Widget imports
import WidgetGoogleChartScatter from "../widgets_demo/WidgetGoogleChartScatter";
import WidgetGoogleChartBarChartbyDay from "../widgets_demo/WidgetGoogleChartBarChartbyDay";
import WidgetGoogleChartHorizontalBar from "../widgets_demo/WidgetGoogleChartHorizontalBar";
import WidgetGoogleChartBarChartCombo1 from "../widgets_demo/WidgetGoogleChartBarChartCombo1";
import WidgetChartJSBarChart from "../widgets_demo/WidgetChartJSBarChart";
import WidgetChartJSMixedChartBarLine from "../widgets_demo/WidgetChartJSMixedChartBarLine";

// Other project imports
import CardGrid from "../core_components/cardGrid";

class Demo2CardGrid extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        super(props);

        // Update our parent (the Dashboard) with a new page title
        props.changeParentPageTitle("Demo2 Dashboard (zero APIs)");
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        return (
            <CardGrid rows="20" row_height="3.5vw" columns="12" column_width="1fr">
                <WidgetChartJSBarChart position="span 6 / span 6" />
                <WidgetGoogleChartBarChartCombo1 position="span 6 / span 6" />
                <WidgetChartJSMixedChartBarLine position="span 6 / span 6" />
                <WidgetGoogleChartScatter position="span 4 / span 4" />
                <WidgetGoogleChartBarChartbyDay position="span 4 / span 4" />
                <WidgetGoogleChartHorizontalBar position="span 4 / span 6" />
            </CardGrid>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

Demo2CardGrid.propTypes = {
    changeParentPageTitle: PropTypes.func.isRequired
};

// Set default props in case they aren't passed to us by the caller
Demo2CardGrid.defaultProps = {};

export default Demo2CardGrid;

// ====================================================================================
