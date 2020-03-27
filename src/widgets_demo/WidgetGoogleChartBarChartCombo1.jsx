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
class WidgetGoogleChartBarChartCombo1 extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = {
            widgetName: "WidgetGoogleChartBarChartCombo1",
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
        let randInt = (min, max) => {
            return Math.trunc(Math.random() * (max - min) + min);
        };

        let a = 10;
        let b = 200;
        let st1 = "stroke-color: #0f0f75; stroke-opacity: 1.0; stroke-width: 2";
        let st2 = "stroke-color: #0e5403; stroke-opacity: 1.0; stroke-width: 2";
        let chartData = [
            // Defines columns
            [
                // column 1
                { type: "date", label: "Month" },
                // column 2
                { type: "number", label: "Series 1" },
                { type: "string", role: "style" },
                // column 3
                { type: "number", label: "Series 2" },
                { type: "string", role: "style" },
                // column 4
                { type: "number", label: "Average" }
            ],
            // Adds rows
            [new Date(2020, 0, 1), randInt(a, b), st1, randInt(a, b), st2, 210],
            [new Date(2020, 1, 1), randInt(a, b), st1, randInt(a, b), st2, 210],
            [new Date(2020, 2, 1), randInt(a, b), st1, randInt(a, b), st2, 210],
            [new Date(2020, 3, 1), randInt(a, b), st1, randInt(a, b), st2, 210],
            [new Date(2020, 4, 1), randInt(a, b), st1, randInt(a, b), st2, 210],
            [new Date(2020, 5, 1), randInt(a, b), st1, randInt(a, b), st2, 210],
            [new Date(2020, 6, 1), randInt(a, b), st1, randInt(a, b), st2, 210],
            [new Date(2020, 7, 1), randInt(a, b), st1, randInt(a, b), st2, 210],
            [new Date(2020, 8, 1), randInt(a, b), st1, randInt(a, b), st2, 210],
            [new Date(2020, 9, 1), randInt(a, b), st1, randInt(a, b), st2, 210],
            [new Date(2020, 10, 1), randInt(a, b), st1, randInt(a, b), st2, 210],
            [new Date(2020, 11, 1), randInt(a, b), st1, randInt(a, b), st2, 210]
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
                chartType="ComboChart"
                loader={<div>Loading Chart</div>}
                data={this.state.chartData}
                options={{
                    chartArea: {
                        width: "85%",
                        height: "70%",
                        backgroundColor: {
                            fill: theme.currentColorTheme.colorThemeCardBackground
                        }
                    },
                    isStacked: "true",
                    vAxis: {
                        title: "Cups",
                        textStyle: {
                            color: theme.currentColorTheme.colorThemeCardFontDefault
                        },
                        titleTextStyle: {
                            color: theme.currentColorTheme.colorThemeCardFontDefault
                        },
                        gridlines: {
                            count: -1
                        },
                        minorGridlines: {
                            color: "transparent"
                        }
                    },
                    hAxis: {
                        title: "Month",
                        format: "MMM YY",
                        slantedText: true,
                        textStyle: {
                            color: theme.currentColorTheme.colorThemeCardFontDefault
                        },
                        titleTextStyle: {
                            color: theme.currentColorTheme.colorThemeCardFontDefault
                        },
                        gridlines: {
                            count: -1,
                            color: "transparent"
                        }
                    },
                    legend: {
                        // none, bottom, left, in, right, top
                        position: "top",
                        textStyle: {
                            color: theme.currentColorTheme.colorThemeCardFontDefault
                        }
                    },
                    dataOpacity: 0.4,
                    seriesType: "bars",
                    series: {
                        1: { color: "#1f6407" },
                        2: { type: "line", lineWidth: 5, color: "#e91cdb" }
                    },
                    backgroundColor: theme.currentColorTheme.colorThemeCardBackground
                    // animation: {
                    //     duration: 1000,
                    //     easing: "out",
                    //     startup: true
                    // }
                }}
                rootProps={{ "data-testid": "1" }}
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
                    <div className="single-num-title">Combo Chart Bar and Line (Google Charts)</div>

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
WidgetGoogleChartBarChartCombo1.defaultProps = {};

// Force the caller to include the proper attributes
WidgetGoogleChartBarChartCombo1.propTypes = {
    theme: PropTypes.object,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string
};

// If we (this file) get "imported", this is what they'll be given
export default withTheme(WidgetGoogleChartBarChartCombo1);
// withTheme() is React HOC that injects theme so we can use this.props.theme inside component (beyond styled div)

// =======================================================================================================
// =======================================================================================================
