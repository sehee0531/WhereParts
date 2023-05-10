import React, { Component } from 'react';
import { View } from 'react-native';

import { styles } from "../styles/vision_camera_style";

import CameraX from '../util/camera_x';

export default class SignUpCamera extends Component {
    constructor(props) {
        super(props);

        const params = this.props.route.params;
        
        //cut image가 사업자 등록증일 경우
        if(params.cutImageStyle=="company") {
            this.cutImageStyle={
                top:'11%', 
                left:'9%',
                right:'9%',
                bottom:'15%',
                position:'absolute',
                zIndex:2, 
                borderColor:'white',
            };
            this.text="사업자등록번호를 자동으로 인식해요.\n정확하게 인식됩니다"
        }
        //cut image가 명함일 경우
        else {
            this.cutImageStyle={
                position:'absolute',
                top:'28%', 
                left:'10%',
                right:'10%',
                bottom:'46%',
                zIndex:2, 
                borderColor:'white'
            };
            this.text="명함을 자동으로 인식해요"
        }
    }


    onCutImageListener=(uri) => {
        this.props.route.params.onResultListener(uri);        
    }

    onCapturedListener=(uri)=> {
        console.log('original image : ',uri);
    }

    render() {
        return(
            <View style={styles.container}>
                <CameraX autoClose={true} blur={true} cameraBorder={true} navigation={this.props.navigation} cutImageStyle={this.cutImageStyle}  onCapturedListener={this.onCapturedListener} 
                    onCutImageListener={this.onCutImageListener} upperText={"사각형 안에 맞춰주세요"} downText={this.text}/>
            </View>
        );
    }
}