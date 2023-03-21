import React,{Component} from 'react';
import WebView  from 'react-native-webview';

export default class LogisWeb extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.route.params.logisInfo);
        this.apiKey="3LJ8cI2G0mSsKhGzRgAWCw";
        this.code=this.props.route.params.logisInfo.code;
        this.invoice=this.props.route.params.logisInfo.invoice;
    }

    render() {
        const body="t_code="+this.code+"&t_invoice="+this.invoice+"&t_key="+this.apiKey;
        return(
            
            <WebView source={{uri:"http://info.sweettracker.co.kr/tracking/5",method:"post",body:body}}></WebView>
        );
    }
}