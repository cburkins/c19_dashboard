// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import { Line } from "react-chartjs-2";
import axios from "axios";

// project imports
import DashboardChartJSCard from "../core_components/DashboardChartJSCard";
import CardContainer from "../core_components/CardContainer";
import { withTheme } from "styled-components/macro";
var moment = require("moment");

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetChartC19Line extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { widgetName: "WidgetChartC19Line", chartJSDataSets: [], xAxisLabels: [] };

        // This is out event handler, it's called from outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.getDataAndUpdateState = this.getDataAndUpdateState.bind(this);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    extractSingleDataSeriesAndAddZeros(chartDataObject, seriesName) {
        let dataSeries = Object.keys(chartDataObject)
            .sort((a, b) => {
                return new Date(a) > new Date(b) ? 1 : -1;
            })
            .map((date) => {
                // If there's a datapoint for this day, return it, otherwise, fill in a 0 (zero)
                return chartDataObject[date][seriesName] || 0;
            });
        return dataSeries;
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    async callCoronaScraperAndExtractData(desiredLocations) {
        // Call API and download a giant data file (download takes much longer than actual api call)
        // let dataURL = "https://coronadatascraper.com/timeseries-byLocation.json";
        // dataURL = "https://liproduction-reportsbucket-bhk8fnhv1s76.s3-us-west-1.amazonaws.com/v1/latest/timeseries-byLocation.json";

        // Source Data looks like this:
        // let response = {
        //     "NY, USA": {
        //         dates: {
        //             "2020-1-22": { cases: 0, deaths: 0, recovered: 0, active: 0 },
        //             "2020-1-23": { cases: 0, deaths: 0, recovered: 0, active: 0, growthFactor: null },
        //             "2020-1-24": { cases: 0, deaths: 0, recovered: 0, active: 0, growthFactor: null },
        //             "2020-1-25": { cases: 0, deaths: 0, recovered: 0, active: 0, growthFactor: null }
        //         },
        //         country: "USA",
        //         population: 19453561
        //     },
        //     "Bucks County, PA, USA": { dates: "sames as above" }
        // };

        // We're finished aquiring data, now transform into my own standard format (see bottom of function for example)

        // Initialize empty object to accumulate data
        let countsByDateObj = {};
        // Loop through each desired location
        await Promise.all(
            desiredLocations.map(async (location) => {
                let state = location.name;
                let dataURL = `https://api.covidtracking.com/v1/states/${state}/daily.json`;

                let responseC19 = await axios.get(dataURL, {
                    timeout: 20000,
                    params: {},
                });

                console.log(`response for ${location.name}:`, responseC19.data);

                let locationDates = responseC19.data;
                locationDates.sort((a, b) => {
                    return new Date(a.date) > new Date(b.date) ? 1 : -1;
                });
                console.log("sorted data:", locationDates);

                // Loop through array of dates
                locationDates.forEach((dateObj) => {
                    // First time we've seen this date ?  Create empty object for that date
                    let dateString = moment(dateObj.date, "YYYYMMDD").format("YYYY-MM-DD");
                    dateString in countsByDateObj || (countsByDateObj[dateString] = {});

                    // Add location's datapoint to this date (raw number of cases)
                    // countsByDateObj[date][location] = sourceDataSingleLocationObject["dates"][date]["cases"];

                    // probableCases
                    // hospitalizedCurrently
                    // inIcuCurrently
                    // deathIncrease
                    countsByDateObj[dateString][location.name] = (dateObj["hospitalizedCurrently"] / location.population) * 10000;
                    console.log("population:");
                });
                console.log("countsByDateObj:", countsByDateObj);
            })
        );
        console.log("Waited for API calls");

        // We're about to return a data object with this structure
        // NOTE: at this point, we might be missing data points on some dates (e.g. Feb 25th is missing data for MD)
        // return {
        //     "2020-02-25": { PA: 7, NJ: 12 },
        //     "2020-02-26": { PA: 8, NJ: 13 },
        //     "2020-02-27": { PA: 9, NJ: 11, MD: 4 }
        // };

        // Occasionally seeing bad data with today's date, so filter that out
        // delete countsByDateObj[moment().format("YYYY-MM-DD")];

        return countsByDateObj;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // eslint-disable-next-line no-unused-vars
    async getDataAndUpdateState(msg = "Default message", data = "Default data") {
        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data

        // Specify array of location we'd like to extract from large source data object
        let desiredLocations = this.props.desired_locations;

        // Call outside API, and transform data into my own standard format
        // let standardDataOjb = {
        //     "2020-02-25": { PA: 7, NJ: 12 },
        //     "2020-02-26": { PA: 8, NJ: 13 },
        //     "2020-02-27": { PA: 9, NJ: 11, MD: 4 }
        // };
        let casesByDate = await this.callCoronaScraperAndExtractData(desiredLocations);

        console.log("casesByDate42", casesByDate);

        // Create array to serve as x-axis labels on chart.js chart  (be sure to sort in date ascending order first)
        let xAxisLabels = Object.keys(casesByDate)
            .sort((a, b) => {
                return new Date(a) > new Date(b) ? 1 : -1;
            })
            .map((dateString) => {
                return new Date(`${dateString} 00:00:00`);
            });

        // Create object that contains all data for chart.js (created later)

        let colors = ["#b7ac15", "#15b786", "#b76115", "#1e4df6", "#d50af0", "#92010e", "#0af0e1", "#fafafa", "#790af0", "#71f00a"];
        let chartJSDataSets = [];
        let i = 0;
        desiredLocations.forEach((locationObj) => {
            chartJSDataSets.push({
                label: locationObj["label"],
                borderColor: colors[i],
                // Width of line in line chart
                borderWidth: 1,
                // Width of datapoint in line chart
                pointRadius: 1,
                data: this.extractSingleDataSeriesAndAddZeros(casesByDate, locationObj["name"]),
            });
            i = i + 1;
        });

        // // Update our own component state with the new data, which will cause our component to re-render
        this.setState({ chartJSDataSets: chartJSDataSets, xAxisLabels: xAxisLabels });
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
            <Line
                className="chart-itself"
                data={{
                    labels: this.state.xAxisLabels,
                    datasets: this.state.chartJSDataSets,
                }}
                options={{
                    responive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 3000,
                    },
                    legend: {
                        labels: {
                            fontColor: this.props.theme.currentColorTheme.colorThemeFontDefault,
                            fontSize: 16,
                        },
                    },
                    scales: {
                        xAxes: [
                            {
                                type: "time",
                                time: {
                                    unit: "day",
                                    displayFormats: {
                                        day: "MMM D",
                                    },
                                },
                                ticks: {
                                    fontColor: this.props.theme.currentColorTheme.colorThemeFontDefault,
                                    minRotation: 75,
                                    fontSize: 16,
                                    autoSkip: true,
                                    // Minimum spacing between auto-calculated labels on axis
                                    autoSkipPadding: 5,
                                    min: new Date(this.props.x_axis_min),
                                },
                                offset: false,
                                gridLines: {
                                    color: this.props.theme.currentColorTheme.colorThemeChartGridlines,
                                    // Length and spacing of dashed line
                                    borderDash: [1, 3],
                                    display: true, // this will toggle vertical lines
                                },
                            },
                        ],
                        yAxes: [
                            {
                                gridLines: {
                                    color: this.props.theme.currentColorTheme.colorThemeChartGridlines,
                                    // Length and spacing of dashed line
                                    borderDash: [5, 5],
                                    display: true, // this will toggle horizontal lines
                                },
                                ticks: {
                                    fontColor: this.props.theme.currentColorTheme.colorThemeFontDefault,
                                    suggestedMin: 0,
                                    suggestedMax: this.props.suggested_max,
                                    fontSize: 16,
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: "Hospitalized per 10K",
                                    fontColor: this.props.theme.currentColorTheme.colorThemeFontDefault,
                                    fontSize: 16,
                                },
                            },
                        ],
                    },
                }}
            />
        );
    }

    render() {
        // Standard React Lifecycle method, gets called by React itself
        // Get called every time the "state" object gets modified, in other words setState() was called
        // Also called if "props" are modified (which are passed from the parent)

        return (
            <CardContainer id={this.props.id} position={this.props.position} color={this.props.color} widgetName="WidgetChartC19Line">
                <DashboardChartJSCard>
                    {/* Title */}
                    <div className="single-num-title">{this.props.widget_title}</div>
                    <div className="single-num-subtitle">
                        Sourced from CoronaVirusScraper <a href="https://coronadatascraper.com/#timeseries-byLocation.json">Data Source</a>
                    </div>

                    <div style={{ width: "100%", height: "88%" }}>{this.renderJSChart()}</div>
                </DashboardChartJSCard>
            </CardContainer>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetChartC19Line.defaultProps = {
    desired_locations: [
        { label: "Bucks", name: "Bucks County, PA, USA" },
        { label: "Lanc", name: "Lancaster County, PA, USA" },
    ],
    widget_title: "C19 Cases By PA Counties",
    per_capita: false,
    x_axis_min: "2020-02-10 00:00:00",
    suggested_max: null,
};

// Force the caller to include the proper attributes
WidgetChartC19Line.propTypes = {
    theme: PropTypes.object,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    desired_locations: PropTypes.array.isRequired,
    widget_title: PropTypes.string,
    per_capita: PropTypes.bool,
    x_axis_min: PropTypes.string,
    suggested_max: PropTypes.number,
};

// If we (this file) get "imported", this is what they'll be given
export default withTheme(WidgetChartC19Line);
// withTheme() is React HOC that injects theme so we can use this.props.theme inside component (beyond styled div)

// =======================================================================================================
// =======================================================================================================
