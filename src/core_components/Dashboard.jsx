// 3rd party imports
import React from "react";
import { HashRouter, Route, Link, Redirect } from "react-router-dom";
import PubSub from "pubsub-js";
import PropTypes from "prop-types";

// project imports
import Demo2CardGrid from "../cardgrids/Demo2CardGrid";
import NumberFormat from "react-number-format";
import RotatedLeftEdgeTitle from "./RotatedLeftEdgeTitle";

import styled from "styled-components/macro";

const SidebarDiv = styled.div`
    color: ${props => props.theme.currentColorTheme.colorThemeLeftNavLinks};
`;

const LinkSidebar = styled(Link)`
    padding-left: 0.7vw;
    padding-bottom: 0.4vw;
    padding-top: 0.4vw;
    text-decoration: none;
    color: ${props => props.theme.currentColorTheme.colorThemeLeftNavLinks};
    transition: 0.5s;
    display: block;
    font-size: 1.4vw;
`;

const SidebarTitle = styled.div`
    font-size: 1.6vw;
    text-decoration: underline;
    color: ${props => props.theme.currentColorTheme.colorThemeLeftNavLinks};
`;

class Dashboard extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    constructor(props) {
        super(props);

        this.state = {
            pageTitle: "Original Title",
            //
            refreshInterval: props.refreshInterval,
            // time remaining until next data refresh PubSub
            refreshRemainingMs: props.refreshInterval,
            reloadRemainingMs: props.reloadInterval
        };

        // So we can keep track of the once-per-second timeout
        this.intervalHandle = null;

        this.slidingSideBarRef = React.createRef();
        this.mainRef = React.createRef();
        // This is our event handler, it's called from the outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.openNav = this.openNav.bind(this);
        this.closeNav = this.closeNav.bind(this);

        // Make sure child components have access to component attributes like this.props and this.state
        this.changePageTitle = this.changePageTitle.bind(this);
        this.changeRefreshInterval = this.changeRefreshInterval.bind(this);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    widgetRefreshCountdownLoop() {
        // PubSub event will trigger (likely once per second), and call this method

        // console.log("Time left: " + this.state.refreshRemainingMs);

        // Check to see if reload timer expired, if so trigger data update
        if (this.state.reloadRemainingMs <= 0) {
            window.location.reload();
        }

        // Check to see if refresh timer expired, if so trigger data update
        if (this.state.refreshRemainingMs <= 0) {
            PubSub.publish("updateWidgetsEvent", "Update your data, you widgets !");
            // Update our own component state with the new data, which will cause our component to re-render
            this.setState({ refreshRemainingMs: this.props.refreshInterval });
        }

        // Subtract one second from the count
        // Update our own component state with the new data, which will cause our component to re-render
        this.setState({ refreshRemainingMs: this.state.refreshRemainingMs - this.props.refreshUpdateInterval });
        // Update our own component state with the new data, which will cause our component to re-render
        this.setState({ reloadRemainingMs: this.state.reloadRemainingMs - this.props.refreshUpdateInterval });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    componentDidMount() {
        // Create an interval to periodically trigger PubSub event
        this.intervalHandle = setInterval(() => {
            this.widgetRefreshCountdownLoop();
        }, this.props.refreshUpdateInterval);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Later will pass this function to child components so they can change our Page Title
    changePageTitle(newTitle) {
        // Update our own component state with the new data, which will cause our component to re-render
        this.setState({ pageTitle: newTitle });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    changeRefreshInterval(newRefreshInterval) {
        this.setState({ refreshInterval: newRefreshInterval, refreshRemainingMs: newRefreshInterval });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    /* Set the width of the side navigation to 250px */
    openNav() {
        // To "open" the sidebar navigation, set's it's width from 0 to 250px
        this.slidingSideBarRef.current.style.width = "250px";
        // And at the same time, add a similar margin to main panel, which squishes the content over to make room for menu
        // The margin we're adding is slightly smaller so that the menu goes farther, and cover the original sidebar buttons
        this.mainRef.current.style.marginLeft = "180px";
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    /* Set the width of the side navigation to 0 */
    closeNav() {
        // Close the sidebar by setting width to 0
        this.slidingSideBarRef.current.style.width = "0";
        // Re-open main page to full width
        this.mainRef.current.style.marginLeft = "0";
        console.log("going to set resize event in 1s");
        setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
            // There's a listener out there for this in the DashboardChartJSCard, so it can trigger a resize of all active chart cards
        }, 1000);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    doSomethingForDebugging() {
        console.log("Clicked on Title, this function used for inserting a quick function for debugging");
        console.log("Going to manually update widget data now via PubSub");
        PubSub.publish("updateWidgetsEvent", "Manually updating widget data");
        // let colorVariableName = "colorThemePageBackground";
        // document.documentElement.style.setProperty("--" + colorVariableName, "#a7a");
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        return (
            <HashRouter>
                {/* HashRouter can have only one child element, so adding a <div> */}
                <SidebarDiv>
                    {/* Sidebar */}
                    <div ref={this.slidingSideBarRef} className="slidingSideNav">
                        {/* create a button to close the sidebar panel */}
                        <span className="closebtn" onClick={this.closeNav}>
                            &times;
                        </span>

                        <div>
                            <LinkSidebar style={{ paddingBottom: "2vw" }} to="/dashboard-release-notes">
                                New: Dashboard Release Notes
                            </LinkSidebar>

                            <SidebarTitle>Available Dashboards:</SidebarTitle>
                            <LinkSidebar to="/">Home</LinkSidebar>
                            <LinkSidebar to="/demo2-dashboard">Demo Dashboard</LinkSidebar>
                        </div>
                    </div>

                    {/* Main page_container: contains title, fixed sidbar, and widgets */}
                    <div id="main" ref={this.mainRef} className="page_container">
                        <div className="title_container">
                            <div className="title" onClick={this.doSomethingForDebugging}>
                                {this.state.pageTitle}
                            </div>
                        </div>
                        <div className="fixedSideBar_container">
                            {/* Create the hamburger menu button */}
                            <button className="navButtonsLeft" type="button" onClick={this.openNav}>
                                &#9776;
                            </button>
                            <Link to="/dashboard-release-notes">
                                <button className="navButtonsLeft" type="button">
                                    ?
                                </button>
                            </Link>

                            {/* Show the time remaining until the next refresh */}
                            <div style={{ padding: "6px", fontSize: "2vw" }}>{this.state.refreshRemainingMs / 1000}s</div>
                            <div style={{ padding: "6px", fontSize: "2vw" }}>
                                <NumberFormat
                                    value={this.state.reloadRemainingMs / 1000 / 60}
                                    decimalScale={1}
                                    fixedDecimalScale={true}
                                    displayType={"text"}
                                />
                                m
                            </div>

                            <RotatedLeftEdgeTitle environment={process.env.REACT_APP_ENV} version={process.env.REACT_APP_VERSION} />
                        </div>
                        <div className="centerPanel_container">
                            {/* Define a route to a new dashboard */}
                            <Route
                                path="/demo2-dashboard"
                                exact
                                render={() => <Demo2CardGrid changeParentPageTitle={this.changePageTitle} refreshInterval={8000} />}
                            />
                            {/* Define the DEFAULT route when no path to a dashboard is given */}
                            <Route path="/" exact render={() => <Redirect to="/demo2-dashboard" />} />
                        </div>
                    </div>
                </SidebarDiv>
            </HashRouter>
        );
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
}

// Set DEFAULT props (easily overridden) in case they aren't passed to us by the caller
Dashboard.defaultProps = {
    refreshUpdateInterval: 1000,
    refreshInterval: 60 * 1000,
    reloadInterval: 3600 * 1000, // 300k = 5m, 900k = 15m, 36k = 60m
    sn_instance: "jnjprodworker.service-now.com",
    // sn_instance: "jnjqa2.service-now.com",
    boldchat_instance: "api.boldchat.com",
    leankit_instance: "jnj.leankit.com"
};

Dashboard.propTypes = {
    refreshInterval: PropTypes.number.isRequired,
    reloadInterval: PropTypes.number.isRequired,
    refreshUpdateInterval: PropTypes.number.isRequired,
    sn_instance: PropTypes.string.isRequired,
    boldchat_instance: PropTypes.string.isRequired,
    leankit_instance: PropTypes.string.isRequired,
    theme: PropTypes.shape({
        colorThemePageBackground: PropTypes.string
    })
};

export default Dashboard;
