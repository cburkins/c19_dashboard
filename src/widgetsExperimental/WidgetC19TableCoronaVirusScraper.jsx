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
import CardTable from "../core_components/CardTable";
import NumberFormat from "react-number-format";
var jmespath = require("jmespath");
var moment = require("moment");

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetChartJSC19LineChartCoronaVirusScraper extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { widgetName: "WidgetChartJSC19LineChartCoronaVirusScraper", dataset: [] };

        // This is out event handler, it's called from outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.getDataAndUpdateState = this.getDataAndUpdateState.bind(this);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    extractDataSeriesAddZeros(chartDataObject, seriesName) {
        let todayStr = moment().format("YYYY-MM-DD");
        let dataSeries = Object.keys(chartDataObject)
            .sort((a, b) => {
                return new Date(a) > new Date(b) ? 1 : -1;
            })
            .map((date) => {
                // Data should never included "today", so remove it if it does
                if (date !== todayStr) {
                    return chartDataObject[date][seriesName] || 0;
                }
            });
        return dataSeries;
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    async callCoronaScraperTodaysData(desiredFilters) {
        // Call API and download a giant data file (download takes much longer than actual api call)
        let responseC19Today = await axios.get("https://coronadatascraper.com/data.json", {
            timeout: 20000,
            params: {},
        });

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

        let J19Data = responseC19Today.data;

        // Apply the desired filter functions
        desiredFilters.forEach((myFilterFunc) => {
            J19Data = J19Data.filter(myFilterFunc);
        });

        // Add custom variable for cases per 1000
        J19Data.forEach((dataPoint) => {
            dataPoint.uu_casesPer1000 = (dataPoint.cases / dataPoint.population) * 1000.0 || 0;
        });

        // Sort by cases per 1000
        J19Data.sort((a, b) => {
            return b.uu_casesPer1000 - a.uu_casesPer1000;
        });

        // Truncate to desired length
        J19Data.length = this.props.limit;
        return J19Data;
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // eslint-disable-next-line no-unused-vars
    async getDataAndUpdateState(msg = "Default message", data = "Default data") {
        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data

        // Specify array of location we'd like to extract from large source data object
        let desiredLocations = this.props.desired_locations;

        let dataset = await this.callCoronaScraperTodaysData(this.props.desired_filters);

        // // Update our own component state with the new data, which will cause our component to re-render
        this.setState({ dataset: dataset });
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

    render() {
        // Standard React Lifecycle method, gets called by React itself
        // Get called every time the "state" object gets modified, in other words setState() was called
        // Also called if "props" are modified (which are passed from the parent)

        // console.log("state", this.state);
        // console.log("length: ", this.state.dataset.length);
        if (this.state.dataset.length > 0) {
            return (
                <CardContainer
                    id={this.props.id}
                    position={this.props.position}
                    color={this.props.color}
                    widgetName="WidgetChartJSC19LineChartCoronaVirusScraper">
                    <div className="single-num-title">{this.props.widget_title}</div>
                    <CardTable style={{ marginLeft: "0.4vw", marginRight: "0.4vw", fontSize: "0.6vw" }}>
                        <thead>
                            <tr>
                                <th width="10%">#</th>
                                <th width="30%">Location</th>
                                <th width="20%">Cases</th>
                                <th width="20%">Population</th>
                                <th width="20%">Cases / 1000</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.dataset.map((dataPoint, index) => {
                                return (
                                    <tr key={dataPoint["name"]}>
                                        <td>{index + 1}</td>
                                        <td>{dataPoint["name"]}</td>
                                        <td align="right">
                                            <NumberFormat value={dataPoint["cases"]} decimalScale={0} displayType={"text"} thousandSeparator={true} />
                                        </td>
                                        <td>
                                            <NumberFormat
                                                value={dataPoint["population"]}
                                                decimalScale={0}
                                                displayType={"text"}
                                                thousandSeparator={true}
                                            />
                                        </td>
                                        <td>
                                            <NumberFormat value={dataPoint.uu_casesPer1000} decimalScale={1} displayType={"text"} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </CardTable>
                </CardContainer>
            );
        } else {
            return <h3>Waiting for Data</h3>;
        }
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetChartJSC19LineChartCoronaVirusScraper.defaultProps = {
    desired_filters: [{ name: "level", value: "county" }],
    widget_title: "C19 Cases By PA Counties",
    per_capita: false,
    x_axis_min: "2020-02-10 00:00:00",
    suggested_max: null,
    limit: 20,
};

// Force the caller to include the proper attributes
WidgetChartJSC19LineChartCoronaVirusScraper.propTypes = {
    theme: PropTypes.object,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    widget_title: PropTypes.string,
    per_capita: PropTypes.bool,
    x_axis_min: PropTypes.string,
    suggested_max: PropTypes.number,
    desired_filters: PropTypes.array.isRequired,
    limit: PropTypes.number.isRequired,
};

// If we (this file) get "imported", this is what they'll be given
export default withTheme(WidgetChartJSC19LineChartCoronaVirusScraper);
// withTheme() is React HOC that injects theme so we can use this.props.theme inside component (beyond styled div)

// =======================================================================================================
// =======================================================================================================
