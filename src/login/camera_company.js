import React, { Component } from 'react';
import { View } from 'react-native';

import { styles } from "../styles/vision_camera_style";

import CameraX from '../util/camera_x';
import WebServiceManager from "../util/webservice_manager";
import Constant from "../util/constatnt_variables";

export default class CompanyCamera extends Component {
    constructor(props) {
        super(props);

        this.cutImageStyle={
            top:'7%', 
            left:'9%',
            right:'9%',
            bottom:'33%',
            position:'absolute',
            zIndex:2, 
            borderColor:'white',
        };
    }

    async callCompanyNoAPI(imageData) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetCompanyNo", "post");
        manager.addBinaryData("file", imageData);
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }

    onCutImageListener=(uri) => {
        console.log('cut image : ',uri);
        console.log(this.props);

        const fileData = {
            uri: uri,
            type: "image/jpeg",
            name: 'photo.jpg',
        }

        this.callCompanyNoAPI(fileData).then((response) => {
            console.log("responseNo", response);
            if (response.success == 0)
                this.props.route.params.onResultListener("0", uri);
            else
                this.props.route.params.onResultListener(response.no, uri);
            //this.props.navigation.pop();
        })
    }

    onCapturedListener=(uri)=> {
        console.log('original image : ',uri);
    }

    render() {
        return(
            <View style={styles.container}>
                <CameraX autoClose={true} blur={true} cameraBorder={true} navigation={this.props.navigation} cutImageStyle={this.cutImageStyle}  onCapturedListener={this.onCapturedListener} onCutImageListener={this.onCutImageListener} />
            </View>
        );
    }
}