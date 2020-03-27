import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";

// --------------------------------------------------------------------------------------------
// Listens for window resize events so it can trigger resize event on itself
// NOTE: GoogleChart does NOT have to do this
// --------------------------------------------------------------------------------------------

const DashboardChartJSCardDiv = styled.div`
    /* class used to be .chartJSCard */
    /* background-color: var(--colorThemeCardBackground); */
    color: "red";

    border-radius: 0.2rem;
    width: 100%;
    height: 100%;
    /* Don't add padding here, add it to the canvas */

    canvas {
        /* Spacing around the canvas/chart */
        padding: 1.5rem;

        background-color: ${props => props.theme.currentColorTheme.colorThemeCardBackground};
        color: red;

        /* There are way to make the chart.js responsive */
        /* PreReq: The chart.js needs to have option:responive on it.  Probably also maintainAspectRatio:false, then */
        /* there are two solutions */
        /* 1) div containing this canvas has to be *direct* child of grid item.  If you have extra <div> in there, it all falls */
        /*    apart (though solution #2 would still work) */
        /* 2) The canvas needs to have width/height as 100% !important.  This forces it's known size upwards to the divs */
        /* NOTE: I prefer avoiding !important, so opting for solution #1, but leaving these two lines here just in case of emergency. */
        /* width: 100% !important; */
        /* height: 100% !important; */
    }
`;

// Create a widget class --------
class DashboardChartJSCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "DashboardChartJSCard" };
        this.chartCardRef = React.createRef();

        // This is our event handler, it's called from the outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.triggerOurOwnResizeScrollEvent = this.triggerOurOwnResizeScrollEvent.bind(this);
    }

    triggerOurOwnResizeScrollEvent() {
        // The responsize resizing of the chartjs widget/card normally works fine, great in fact
        // The only time it doesn't is when the sidebar menu slides shut.  So in the "closeNav()" function,
        // I trigger a global window.resize event, and then listen for it, see the componentDidMount() below
        // Then I call this function to trigger a precise "scroll" event against the correct div, which causes chartjs to resizes
        // Why a "scroll" event ?  Who knows, discovered it was listening for "scroll" event by looking at Firefox devTools
        //
        // When we create this via React and react-chartjs-2:
        //
        // <div class="chartChart"
        //    <Bar data=barChartData />
        //
        // We will end up this this:
        //
        // <div class="chartCard"
        //    <div class="chartjs-size-monitor"
        //       <div class="chartjs-size-monitor-expand" />    <--- listens for "scroll" event to detect resize
        //       <div class="chartjs-sizes-monitor-shrink" />   <--- listens for "scroll" event to detect resize
        //    </div>
        //    <canvas />
        // </div>

        // Trigger a "scroll" event precisely where react-chartjs-2 is listening for it
        let chartjsSizeMonitorExpand = this.chartCardRef.current.childNodes[0].childNodes[0];
        chartjsSizeMonitorExpand.dispatchEvent(new Event("scroll"));
    }

    componentDidMount() {
        // When left navigation menu slides shut, we manually trigger a window.resize event.
        // Listen for that and trigger our own "scroll" event against the chart.js widget (so it re-sizes itself)
        window.addEventListener("resize", this.triggerOurOwnResizeScrollEvent);
    }

    componentWillUnmount() {
        // Before we get unmounted, remove the event listener for window resize (related to left nav menu)
        window.removeEventListener("resize", this.triggerOurOwnResizeScrollEvent);
    }

    render() {
        return (
            <DashboardChartJSCardDiv id={this.props.id} ref={this.chartCardRef}>
                {this.props.children}
            </DashboardChartJSCardDiv>
        );
    }
}

DashboardChartJSCard.propTypes = {
    children: PropTypes.node.isRequired,
    color: PropTypes.string,
    id: PropTypes.string
};

export default DashboardChartJSCard;
