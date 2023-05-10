import React,{Component} from 'react';
import WebView  from 'react-native-webview';
import Constant from '../../util/constatnt_variables';
import { BackHandler } from 'react-native';
export default class LogisWeb extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.route.params.logisInfo);
        this.apiKey=Constant.deliveryApiKey;
        this.code=this.props.route.params.logisInfo.code;
        this.invoice=this.props.route.params.logisInfo.invoice;
    }
    componentDidMount(){
        BackHandler.addEventListener("hardwareBackPress", this.backPressed);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
    }
    backPressed = () => {
        this.props.navigation.pop();
        return true;
    }
    render() {
        const body="t_code="+this.code+"&t_invoice="+this.invoice+"&t_key="+this.apiKey;
        return(
            <WebView source={{uri:"http://info.sweettracker.co.kr/tracking/5",method:"post",body:body}}></WebView>
        );
    }
}