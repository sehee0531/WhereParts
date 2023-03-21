import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

class GoogleWebView extends Component {
    constructor(props) {
        super(props);
        this.url=this.props.route.params.url;
    }

    render() {
        return (
           <WebView source={{ uri: this.url }} />
        )
    }
}

export default GoogleWebView;