// 3rd party imports
import React from "react";
import PropTypes from "prop-types";

// Widget imports
import WidgetChartJSC19LineChartCoronaVirusScraper from "../widgetsExperimental/WidgetChartJSC19LineChartCoronaVirusScraper";
import WidgetText from "../widgets_demo/WidgetText";

// Other project imports
import CardGrid from "../core_components/cardGrid";

class C19CardGrid extends React.PureComponent {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        super(props);

        // Update our parent (the Dashboard) with a new page title
        props.changeParentPageTitle("Covid-19 Dashboard");
        props.changeRefreshInterval(3000 * 1000);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        let country_locations = [
            { label: "China", name: "CHN" },
            { label: "Italy", name: "ITA" },
            { label: "Spain", name: "ESP" },
            { label: "USA", name: "United States" },
            { label: "Iran", name: "IRN" },
            { label: "India", name: "IND" },
            { label: "France", name: "FRA" },
            { label: "Belgium", name: "BEL" },
            { label: "UK", name: "GBR" },
            { label: "Germany", name: "DEU" },
        ];
        let state_locations = [
            { label: "NY", name: "New York, United States" },
            { label: "WA", name: "Washington, United States" },
            { label: "PA", name: "Pennsylvania, United States" },
            { label: "NJ", name: "New Jersey, United States" },
            { label: "CA", name: "California, United States" },
            { label: "MI", name: "Michigan, United States" },
            { label: "DC", name: "District of Columbia, Washington, D.C., United States" },
            { label: "FL", name: "Florida, United States" },
        ];
        let pa_county_locations = [
            { label: "Bucks", name: "Bucks County, Pennsylvania, United States" },
            { label: "Lanc", name: "Lancaster County, Pennsylvania, United States" },
            { label: "Phil", name: "Philadelphia County, Pennsylvania, United States" },
            { label: "MontCo", name: "Montgomery County, Pennsylvania, United States" },
            { label: "DelCo", name: "Delaware County, Pennsylvania, United States" },
            { label: "Berks", name: "Berks County, Pennsylvania, United States" },
            { label: "Lehigh", name: "Lehigh County, Pennsylvania, United States" },
        ];
        let nj_county_locations = [
            { label: "Hunterdon", name: "Hunterdon County, New Jersey, United States" },
            { label: "Somerset", name: "Somerset County, New Jersey, United States" },
            { label: "Mercer", name: "Mercer County, New Jersey, United States" },
            { label: "Middlesex", name: "Middlesex County, New Jersey, United States" },
            { label: "Hudson", name: "Hudson County, New Jersey, United States" },
            { label: "Morris", name: "Morris County, New Jersey, United States" },
            { label: "Union", name: "Union County, New Jersey, United States" },
            // { label: "", name: " County, New Jersey, United States" },
        ];
        let nyc_county_locations = [
            { label: "Queens", name: "Queens County, New York, United States" },
            { label: "Bronx", name: "Bronx County, New York, United States" },
            { label: "Manhattan", name: "New York County, New York, United States" },
            { label: "Brooklyn", name: "Kings County, New York, United States" },
            { label: "Staten Island", name: "Richmond County, New York, United States" },
            { label: "Bergen, NJ", name: "Bergen County, New Jersey, United States" },
        ];
        return (
            <CardGrid rows="42" row_height="3.5vw" columns="12" column_width="1fr">
                {/* <WidgetChartJSC19LineByState position="span 6 / span 6" /> */}
                {/* <WidgetChartJSC19LineByCountry position="span 6 / span 6" /> */}
                {/* <WidgetChartJSC19BarByState position="span 10 / span 4" /> */}

                <WidgetText
                    position="span 3 / span 4"
                    color="#114c79"
                    widget_title="Disclaimer Note (Experimental)"
                    text={[
                        <div>
                            NOTE: This dashboard is very experimental, and the data source very dynamic (they change the data structure often). As a
                            result, this whole setup is fairly brittle, but when it works, the data is useful. It's useful for me as I think through
                            all this, so figured I would share with others. (Chad)
                        </div>,
                    ]}></WidgetText>
                <WidgetText
                    position="span 3 / span 4"
                    color="#58266d"
                    widget_title="Disclaimer Note (PA Data)"
                    text={[
                        <div>UPDATE: On 3/30, developer fixed PA data, numbers now appear to be accurate.</div>,
                        <br />,
                        <div>
                            NOTE: As of 3/25, it appears that the data for the state of PA is currently inaccurate (it's very low). I've opened an
                            issue with the developer of the data source to have this repaired
                        </div>,
                    ]}></WidgetText>
                <WidgetChartJSC19LineChartCoronaVirusScraper
                    position="span 6 / span 12"
                    desired_locations={country_locations}
                    widget_title="C19 Cases by Country (Long history)"
                    per_capita={false}
                    x_axis_min="2020-01-21 00:00:00"
                />

                {/* Country */}
                <WidgetChartJSC19LineChartCoronaVirusScraper
                    position="span 6 / span 6"
                    desired_locations={country_locations}
                    widget_title="By Country"
                    per_capita={false}
                    x_axis_min="2020-03-15 00:00:00"
                />
                <WidgetChartJSC19LineChartCoronaVirusScraper
                    position="span 6 / span 6"
                    desired_locations={country_locations}
                    widget_title="By Country (per 1000 people)"
                    per_capita={true}
                    x_axis_min="2020-03-15 00:00:00"
                />

                {/* State */}
                <WidgetChartJSC19LineChartCoronaVirusScraper
                    position="span 6 / span 6"
                    desired_locations={state_locations}
                    widget_title="By US State"
                    per_capita={false}
                    x_axis_min="2020-03-15 00:00:00"
                />
                <WidgetChartJSC19LineChartCoronaVirusScraper
                    position="span 6 / span 6"
                    desired_locations={state_locations}
                    widget_title="By US State (per 1000 people)"
                    per_capita={true}
                    x_axis_min="2020-03-15 00:00:00"
                />

                {/* PA County */}
                <WidgetChartJSC19LineChartCoronaVirusScraper
                    position="span 6 / span 6"
                    desired_locations={pa_county_locations}
                    widget_title="By PA County"
                    per_capita={false}
                    x_axis_min="2020-03-15 00:00:00"
                    suggested_max={1600}
                />
                <WidgetChartJSC19LineChartCoronaVirusScraper
                    position="span 6 / span 6"
                    desired_locations={pa_county_locations}
                    widget_title="By PA County (per 1000 people)"
                    per_capita={true}
                    x_axis_min="2020-03-15 00:00:00"
                    suggested_max={1.4}
                />
                {/* NJ County */}
                <WidgetChartJSC19LineChartCoronaVirusScraper
                    position="span 6 / span 6"
                    desired_locations={nj_county_locations}
                    widget_title="By NJ County"
                    per_capita={false}
                    x_axis_min="2020-03-15 00:00:00"
                    suggested_max={1600}
                />
                <WidgetChartJSC19LineChartCoronaVirusScraper
                    position="span 6 / span 6"
                    desired_locations={nj_county_locations}
                    widget_title="By NJ County (per 1000 people)"
                    per_capita={true}
                    x_axis_min="2020-03-15 00:00:00"
                    suggested_max={1.4}
                />
                {/* New York City Counties */}
                <WidgetChartJSC19LineChartCoronaVirusScraper
                    position="span 8 / span 6"
                    desired_locations={nyc_county_locations}
                    widget_title="By NYC County"
                    per_capita={false}
                    x_axis_min="2020-03-15 00:00:00"
                    suggested_max={1600}
                />
                <WidgetChartJSC19LineChartCoronaVirusScraper
                    position="span 8 / span 6"
                    desired_locations={nyc_county_locations}
                    widget_title="By NYC County (per 1000 people)"
                    per_capita={true}
                    x_axis_min="2020-03-15 00:00:00"
                />
            </CardGrid>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

C19CardGrid.propTypes = {
    changeParentPageTitle: PropTypes.func.isRequired,
    changeRefreshInterval: PropTypes.func.isRequired,
    boardId: PropTypes.string.isRequired,
};

// Set default props in case they aren't passed to us by the caller
C19CardGrid.defaultProps = { boardId: "412731036" };

export default C19CardGrid;

// ====================================================================================
