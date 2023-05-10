import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';

class GoogleWebView extends Component {
    constructor(props) {
        super(props);
        this.url=this.props.route.params.url;
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    backPressed=()=>{
        this.props.navigation.pop();
        return true;
    }

    render() {
        return (
           <WebView source={{ uri: this.url }} />
        )
    }
}

export default GoogleWebView;