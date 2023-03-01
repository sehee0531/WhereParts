import React, { Component } from 'react';
import { View } from 'react-native';

import { template } from "../styles/template/page_style";
import { styles } from "../styles/gallery";

import GalleryX from '../util/gallery_x';

//명함 중간 gallery
class RegisterGallery extends Component {

    constructor(props) {
        super(props);
    }

    onResultListener=(uris)=> {  
        this.props.route.params.onResultListener(uris);
    }

    render() {
        return (
            <View style={template.total_container}>
                <GalleryX autoClose={true} onResultListener={(uris)=>this.onResultListener(uris)} navigation={this.props.navigation} />
            </View>
        )
    }
}

export default RegisterGallery;