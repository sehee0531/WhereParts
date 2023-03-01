import React, { Component } from 'react';

import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

class SearchWebView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
           <WebView source={{ uri: 'http://www.google.com/search?q=' + this.props.route.params.itemNum }} />
        )
    }
}

export default SearchWebView;