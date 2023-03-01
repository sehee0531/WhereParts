import React, { Component } from 'react';
import { View } from 'react-native';

import { template } from "../styles/template/page_style";
import { styles } from "../styles/gallery";

import GalleryX from '../util/gallery_x';
import WebServiceManager from "../util/webservice_manager";
import Constant from "../util/constatnt_variables";

//사업자등록번호 중간 gallery
class RegisterGallery extends Component {

    constructor(props) {
        super(props);
    }

    async callCompanyNoAPI(imageData) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetCompanyNo", "post");
        manager.addBinaryData("file", imageData);
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }


    onResultListener=(uris)=> {
        const fileData = {
            uri: uris,
            type: "image/jpeg",
            name: 'photo.jpg',
        }
        this.callCompanyNoAPI(fileData).then((response) => {
            console.log("responseNo", response);
            if (response.success == 0)
                this.props.route.params.onResultListener("0", uris);
            else
                this.props.route.params.onResultListener(response.no, uris);
            //this.props.navigation.pop();
        })
    }

    render() {
        return (
            <View style={template.total_container}>
                <View style={styles.viewBodyLayout}>
                    <GalleryX autoClose={true} onResultListener={(uris)=>this.onResultListener(uris)} navigation={this.props.navigation} />
                </View>             
            </View>
        )
    }
}

export default RegisterGallery;