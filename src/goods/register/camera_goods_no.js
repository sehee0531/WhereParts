import React, { Component } from 'react';
import { View, LogBox} from 'react-native';

import CameraX from '../../util/camera_x';

import { styles } from "../../styles/vision_camera_style";

// 오류구문 무시
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export default class PartsNoCamera extends Component {
    constructor(props) {
        super(props);

        this.cutImageStyle={
            position:'absolute',
            top:'35%', 
            left:'15%',
            right:'15%', 
            bottom:'53%',
            zIndex:2,
            borderColor:'white',
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
                <CameraX autoClose={true} blur={true} cameraBorder={true} navigation={this.props.navigation} cutImageStyle={this.cutImageStyle} onCapturedListener={this.onCapturedListener} onCutImageListener={this.onCutImageListener} 
                            upperText={"사각형 안에 맞춰주세요"} downText={"부품번호를 자동으로 인식해요"}/>
            </View>
        );
    }
}