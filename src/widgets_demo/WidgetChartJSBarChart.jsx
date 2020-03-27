// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import { Bar } from "react-chartjs-2";

// project imports
import DashboardChartJSCard from "../core_components/DashboardChartJSCard";
import CardContainer from "../core_components/CardContainer";
import { withTheme } from "styled-components/macro";

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetChartJSBarChart extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { widgetName: "WidgetChartJSBarChart", chartData: [] };

        // This is out event handler, it's called from outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.getDataAndUpdateState = this.getDataAndUpdateState.bind(this);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // eslint-disable-next-line no-unused-vars
    async getDataAndUpdateState(msg = "Default message", data = "Default data") {
        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data

        let rand = (minRandom = 30, maxRandom = 100) => {
            return Math.trunc(Math.random() * (maxRandom - minRandom) + minRandom);
        };

        let dataSets = {
            // Series 1
            series1: [rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand()],
            // Series 2
            series2: [rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand()],
            // Series 3
            series3: [rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand()],
            // Series 4
            series4: [rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand()]
        };

        let chartData = [
            {
                label: "Series 1",
                stack: 1,
                categoryPercentage: 0.7,
                // color of actual bar in bar chart
                backgroundColor: "#154bb7",
                // Outline around legend color
                borderColor: "black",
                data: dataSets.series1
            },
            {
                label: "Series 2",
                stack: 1,
                categoryPercentage: 0.7,
                // color of actual bar in bar chart
                backgroundColor: "#427ffa",
                // Outline around legend color
                borderColor: "black",
                data: dataSets.series2
            },
            {
                label: "Series 3",
                stack: 2,
                categoryPercentage: 0.7,
                // color of actual bar in bar chart
                backgroundColor: "#317d33",
                // Outline around legend color
                borderColor: "black",
                data: dataSets.series3
            },
            {
                label: "Series 4",
                stack: 2,
                categoryPercentage: 0.7,
                // color of actual bar in bar chart
                backgroundColor: "#0ccf13",
                // Outline around legend color
                borderColor: "black",
                data: dataSets.series4
            }
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

    renderJSChart() {
        return (
            <Bar
                className="chart-itself"
                data={{
                    labels: [
                        new Date("1/1/2020"),
                        new Date("2/1/2020"),
                        new Date("3/1/2020"),
                        new Date("4/1/2020"),
                        new Date("5/1/2020"),
                        new Date("6/1/2020"),
                        new Date("7/1/2020"),
                        new Date("8/1/2020"),
                        new Date("9/1/2020"),
                        new Date("10/1/2020"),
                        new Date("11/1/2020"),
                        new Date("12/1/2020")
                    ],
                    datasets: this.state.chartData
                }}
                options={{
                    responive: true,
                    maintainAspectRatio: false,
                    legend: {
                        labels: {
                            fontColor: this.props.theme.currentColorTheme.colorThemeFontDefault
                        }
                    },
                    scales: {
                        xAxes: [
                            {
                                type: "time",
                                time: {
                                    unit: "month",
                                    displayFormats: {
                                        month: "MMM YY"
                                    }
                                },
                                offset: true,
                                gridLines: {
                                    color: this.props.theme.currentColorTheme.colorThemeChartGridlines,
                                    // Length and spacing of dashed line
                                    borderDash: [1, 3],
                                    display: true // this will toggle vertical lines
                                },
                                ticks: {
                                    suggestedMin: 0,
                                    suggestedMax: 100,
                                    fontColor: this.props.theme.currentColorTheme.colorThemeFontDefault
                                }
                            }
                        ],
                        yAxes: [
                            {
                                stacked: true,
                                gridLines: {
                                    color: this.props.theme.currentColorTheme.colorThemeChartGridlines,
                                    // Length and spacing of dashed line
                                    borderDash: [5, 5],
                                    display: true // this will toggle horizontal lines
                                },
                                ticks: {
                                    suggestedMin: 0,
                                    suggestedMax: 200,
                                    fontColor: this.props.theme.currentColorTheme.colorThemeFontDefault
                                }
                            }
                        ]
                    }
                }}
            />
        );
    }

    render() {
        // Standard React Lifecycle method, gets called by React itself
        // Get called every time the "state" object gets modified, in other words setState() was called
        // Also called if "props" are modified (which are passed from the parent)

        return (
            <CardContainer id={this.props.id} position={this.props.position} color={this.props.color} widgetName="WidgetChartJSBarChart">
                <DashboardChartJSCard>
                    {/* Title */}
                    <div className="single-num-title">Clustered Stacked Bar Chart (Chart.js)</div>

                    <div style={{ width: "100%", height: "92%" }}>{this.renderJSChart()}</div>
                </DashboardChartJSCard>
            </CardContainer>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetChartJSBarChart.defaultProps = {};

// Force the caller to include the proper attributes
WidgetChartJSBarChart.propTypes = {
    theme: PropTypes.object,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string
};

// If we (this file) get "imported", this is what they'll be given
export default withTheme(WidgetChartJSBarChart);
// withTheme() is React HOC that injects theme so we can use this.props.theme inside component (beyond styled div)

// =======================================================================================================
// =======================================================================================================
