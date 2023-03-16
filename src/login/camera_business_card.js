import React, { Component } from 'react';
import {View} from 'react-native';

import { styles } from "../styles/vision_camera_style";
import CameraX from '../util/camera_x';


export default class BusinessCardCamera extends Component {
    constructor(props) {
        super(props);

        this.cutImageStyle={
            position:'absolute',
            top:'28%', 
            left:'10%',
            right:'10%',
            bottom:'46%',
            zIndex:2, 
            borderColor:'white'
        };
    }

    onCapturedListener=(uri)=> {
        console.log('original image : ',uri);
    }

    onCutImageListener=(uri) => {
        console.log('cut image : ',uri);
        console.log(this.props);
        this.props.route.params.onResultListener(uri);
    }

    render() {
        return(
            <View style={styles.container}>
                <CameraX autoClose={true} blur={true} cameraBorder={true} navigation={this.props.navigation} cutImageStyle={this.cutImageStyle} onCapturedListener={this.onCapturedListener} onCutImageListener={this.onCutImageListener} />
            </View>
        );
    }
}