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
class WidgetGoogleChartBarChartbyDay extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = {
            widgetName: "WidgetGoogleChartBarChartbyDay",
            count: null,
            chartData: []
        };

        // This is out event handler, it's called from outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.getDataAndUpdateState = this.getDataAndUpdateState.bind(this);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // eslint-disable-next-line no-unused-vars
    async getDataAndUpdateState(msg = "Default message", data = "Default data") {
        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data

        // Helper function to get a random integer within a defined range
        let getRandomInt = (min, max) => {
            return Math.trunc(Math.random() * (max - min) + min);
        };

        let chartData = [
            [
                { type: "date", id: "Date" },
                { type: "number", id: "Days" }
            ],
            [new Date(2020, 2 - 1, 29), getRandomInt(3, 20)],
            [new Date(2020, 3 - 1, 1), getRandomInt(3, 20)],
            [new Date(2020, 3 - 1, 2), getRandomInt(3, 20)],
            [new Date(2020, 3 - 1, 3), getRandomInt(3, 20)],
            [new Date(2020, 3 - 1, 4), getRandomInt(3, 20)],
            [new Date(2020, 3 - 1, 7), getRandomInt(3, 20)],
            [new Date(2020, 3 - 1, 10), getRandomInt(3, 20)],
            [new Date(2020, 3 - 1, 12), getRandomInt(3, 20)]
        ];

        // Update our own component state with the new data, which will cause our component to re-render
        this.setState({ chartData: chartData });
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
                width={"100%"}
                height={"100%"}
                chartType="ColumnChart"
                loader={<div>Loading Chart</div>}
                data={this.state.chartData}
                options={{
                    backgroundColor: theme.currentColorTheme.colorThemeCardBackground,
                    chartArea: {
                        width: "90%",
                        height: "70%",
                        backgroundColor: {
                            fill: theme.currentColorTheme.colorThemeCardBackground
                        }
                    },
                    hAxis: {
                        format: "MMM dd",
                        slantedText: true,
                        gridlines: {
                            count: 6
                        },
                        textStyle: {
                            color: theme.currentColorTheme.colorThemeCardFontDefault
                        }
                    },
                    vAxis: {
                        textStyle: {
                            color: theme.currentColorTheme.colorThemeCardFontDefault
                        }
                    },
                    animation: {
                        duration: 1000,
                        easing: "out",
                        startup: true
                    }
                }}
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
                <DashboardGoogleChartCard>
                    {/* Title */}
                    <div className="single-num-title">Simple ColumnChart ByDay</div>

                    {/* Use this div to size the chart, rather than using Chart Width/Height */}
                    {/* Chart width/height seems to create two nested divs, which each have the %size applied, so double affect */}
                    <div className="manualChartSize" style={{ width: "95%", height: "85%" }}>
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
WidgetGoogleChartBarChartbyDay.defaultProps = {};

// Force the caller to include the proper attributes
WidgetGoogleChartBarChartbyDay.propTypes = {
    theme: PropTypes.object,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string
};

// If we (this file) get "imported", this is what they'll be given
export default withTheme(WidgetGoogleChartBarChartbyDay);
// withTheme() is React HOC that injects theme so we can use this.props.theme inside component (beyond styled div)

// =======================================================================================================
// =======================================================================================================
