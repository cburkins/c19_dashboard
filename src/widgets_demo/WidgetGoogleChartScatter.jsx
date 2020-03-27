// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import { Chart } from "react-google-charts";
import DashboardGoogleChartCard from "../core_components/DashboardGoogleChartCard";
import CardContainer from "../core_components/CardContainer";
import { withTheme } from "styled-components/macro";

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetGoogleScatterChart extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { widgetName: "WidgetGoogleScatterChart", count: null };

        // This is out event handler, it's called from outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.getDataAndUpdateState = this.getDataAndUpdateState.bind(this);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // eslint-disable-next-line no-unused-vars
    async getDataAndUpdateState(msg = "Default message", data = "Default data") {
        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data

        // Update our own component state with the new data, which will cause our component to re-render
        this.setState({ count: 42 });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    componentDidMount = async () => {
        // Standard React Lifecycle method, gets called by React itself
        // React calls this once after component gets "mounted", in other words called *after* the render() method below

        // manual update of our own data
        this.getDataAndUpdateState();

        // Now listen for update requests by subscribing to update events
        PubSub.subscribe("updateWidgetsEvent", this.getDataAndUpdateState);
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    componentWillUnmount() {
        // Standard React Lifecycle method, gets called by React itself
        // Gets called once before React unmounts and destroys our component

        // Unsubscribe from all pubsub events
        PubSub.unsubscribe(this.getDataAndUpdateState);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    renderChart(theme) {
        return (
            <Chart
                chartType="ScatterChart"
                rows={[
                    [8, 12],
                    [4, 5.5],
                    [11, 14],
                    [4, 5],
                    [3, 3.5],
                    [6.5, 7]
                ]}
                width={"100%"}
                height={"100%"}
                legendToggle
                columns={[
                    {
                        type: "number",
                        label: "Age"
                    },
                    {
                        type: "number",
                        label: "Weight"
                    }
                ]}
                options={
                    // Chart options
                    {
                        titleTextStyle: {
                            color: theme.currentColorTheme.colorThemeCardFontDefault
                        },
                        colors: [theme.currentColorTheme.colorThemeChartData],
                        hAxis: {
                            title: "Age",
                            viewWindow: { min: 0, max: 15 },
                            textStyle: {
                                color: theme.currentColorTheme.colorThemeCardFontDefault
                            },
                            titleTextStyle: {
                                color: theme.currentColorTheme.colorThemeCardFontDefault
                            },
                            baselineColor: theme.currentColorTheme.colorThemeCardFontDefault
                        },
                        vAxis: {
                            title: "Weight",
                            viewWindow: { min: 0, max: 15 },
                            textStyle: {
                                color: theme.currentColorTheme.colorThemeCardFontDefault
                            },
                            titleTextStyle: {
                                color: theme.currentColorTheme.colorThemeCardFontDefault
                            },
                            baselineColor: theme.currentColorTheme.colorThemeCardFontDefault
                        },
                        legend: "none",
                        animation: {
                            duration: 2000,
                            easing: "out",
                            startup: true
                        },
                        backgroundColor: theme.currentColorTheme.colorThemeCardBackground,
                        chartArea: {
                            width: "90%",
                            height: "70%",
                            backgroundColor: {
                                fill: theme.currentColorTheme.colorThemeCardBackground
                            }
                        }
                    }
                }
            />
        );
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        // Standard React Lifecycle method, gets called by React itself
        // Get called every time the "state" object gets modified, in other words setState() was called
        // Also called if "props" are modified (which are passed from the parent)

        return (
            <CardContainer id={this.props.id} position={this.props.position} color={this.props.color} widgetName="WidgetSNBarChart">
                {/* Title */}
                <div className="single-num-title">Scatter Chart (Google Charts)</div>

                <DashboardGoogleChartCard>
                    {/* Use this div to size the chart, rather than using Chart Width/Height */}
                    {/* Chart width/height seems to create two nested divs, which each have the %size applied, so double affect */}
                    <div className="manualChartSize" style={{ width: "95%", height: "95%" }}>
                        {this.renderChart(this.props.theme)}
                    </div>
                </DashboardGoogleChartCard>
            </CardContainer>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetGoogleScatterChart.defaultProps = {};

// Force the caller to include the proper attributes
WidgetGoogleScatterChart.propTypes = {
    theme: PropTypes.object,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string
};

// If we (this file) get "imported", this is what they'll be given
export default withTheme(WidgetGoogleScatterChart);
// withTheme() is React HOC that injects theme so we can use this.props.theme inside component (beyond styled div)

// =======================================================================================================
// =======================================================================================================
