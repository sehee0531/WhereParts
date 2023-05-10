import React, { Component } from 'react';
import { View } from 'react-native';

import { template } from "../styles/template/page_style";
import GalleryX from '../util/gallery_x';


//사업자등록번호 중간 gallery
class SignUpGallery extends Component {

    constructor(props) {
        super(props);
    }

    onResultListener=(uri)=> {      
        this.props.route.params.onResultListener(uri);      
    }

    render() {
        return (
            <View style={template.baseContainer}>
                <GalleryX autoClose={true} onResultListener={(uris)=>this.onResultListener(uris)} navigation={this.props.navigation} />                                          
            </View>
        )
    }
}

export default SignUpGallery;