import React, { Component } from 'react';
import { View } from 'react-native';

import { template } from "../../styles/template/page_style";
import { styles } from "../../styles/gallery";

import GalleryX from '../../util/gallery_x';


class Gallery extends Component {

    constructor(props) {
        super(props);

        console.log('imageLength는?', this.props.route.params.imageLength);
    }

    onResultListener = (uris) => {
        this.props.route.params.onResultListener(uris);
    }

    render() {
        return (
            <View style={template.baseContainer}>
                <GalleryX autoClose={false} max={5 - this.props.route.params.imageLength} onResultListener={(uris) => this.onResultListener(uris)} navigation={this.props.navigation} />
            </View>
        )
    }
}

export default Gallery;