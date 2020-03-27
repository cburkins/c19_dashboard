// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import { Line } from "react-chartjs-2";
import axios from "axios";

// project imports
import CardContainer from "../core_components/CardContainer";
import { withTheme } from "styled-components/macro";

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetText extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { widgetName: "WidgetText" };

        // This is out event handler, it's called from outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.getDataAndUpdateState = this.getDataAndUpdateState.bind(this);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // eslint-disable-next-line no-unused-vars
    async getDataAndUpdateState(msg = "Default message", data = "Default data") {
        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data
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

    render() {
        // Standard React Lifecycle method, gets called by React itself
        // Get called every time the "state" object gets modified, in other words setState() was called
        // Also called if "props" are modified (which are passed from the parent)

        return (
            <CardContainer id={this.props.id} position={this.props.position} color={this.props.color} widgetName="WidgetText">
                {/* Title */}
                <div className="single-num-title">{this.props.widget_title}</div>
                <div className="single-num-subtitle"></div>
                <div style={{ fontSize: "1.0vw", paddingTop: "0.8vw" }}>{this.props.text}</div>
            </CardContainer>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetText.defaultProps = {
    text: "Here is some text"
};

// Force the caller to include the proper attributes
WidgetText.propTypes = {
    theme: PropTypes.object,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    widget_title: PropTypes.string,
    per_capita: PropTypes.bool,
    x_axis_min: PropTypes.string,
    text: PropTypes.string.isRequired
};

// If we (this file) get "imported", this is what they'll be given
export default withTheme(WidgetText);
// withTheme() is React HOC that injects theme so we can use this.props.theme inside component (beyond styled div)

// =======================================================================================================
// =======================================================================================================
