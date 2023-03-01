import React, { Component } from 'react';
import { Camera,useFrameProcessor } from "react-native-vision-camera";
import { View,StyleSheet,TouchableOpacity,Button,Image, NativeModules, BackHandler } from 'react-native';

import IconCamera from 'react-native-vector-icons/Feather';
import IconCircle from "react-native-vector-icons/FontAwesome";
import { styles } from "../styles/vision_camera_style";
import { tapGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/TapGestureHandler';

class CameraX extends Component {
    constructor(props) {
        super(props);

        this.camera = React.createRef();
        this.capturedView = React.createRef();
        this.cameraView = React.createRef();
        this.source={};
        this.target={};

        //안드로이드에서 정의한 모듈 가져옴
        const {ImageModule} = NativeModules;
        this.imageModule = ImageModule;
        
        this.state={
            device:null,
            cutImage:null
        };
    }

    componentDidMount() {
        this.availableCameraDevices().then((select)=> {
            this.setState({ device: select });
        });
        BackHandler.addEventListener("hardwareBackPress", this.backPressed);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress',this.backPressed);      
    }

    //안드로이드에서 back 버튼 터치시 
    backPressed=()=>{
        this.props.navigation.pop();
        return true;
    }

    async availableCameraDevices() {
        const devices = await Camera.getAvailableCameraDevices();
        return {
            back: devices.find((d) => d.position === "back"),
            front: devices.find((d) => d.position === "front"),
        }
    }

    // 카메라 촬영 버튼
    shutterButtonClicked = async () => {
        console.log('shutter clicked...')
        const photo = await this.camera.current.takeSnapshot({
            flash: 'off',
        });
        const imageURI='file://'+photo.path;
        this.props.onCapturedListener(imageURI);
        if(this.props.hasOwnProperty("onCutImageListener") && this.props.hasOwnProperty("cutImageStyle")) {
            this.imageModule.getCutImageUri(imageURI,this.source,this.target,this.failedCallback,this.successCallback);
        }
        else {
            if(this.props.autoClose===true) {
                this.props.navigation.pop();
            }
        }
    }

    //안드로이드 모듈 호출 실패시 Callback함수
    failedCallback=(message)=> {
        console.log(message);
    }

    //안드로이드 모듈 호출 성공시 Callback함수
    successCallback=(imageURI)=> {
        console.log('cut image uri:',imageURI);
        this.setState({cutImage:imageURI});
        this.props.onCutImageListener(imageURI);  
        if(this.props.autoClose===true)
            this.props.navigation.pop();      
    }




    //render에 정의한 View 사이즈 가져오기
    getViewSize=(event) => {
        const layout = event.nativeEvent.layout;
        let topMargin=0;
        let leftMargin=0;
        
        this.cameraView.current.measure( (fx, fy, width, height, px, py) => {     
            topMargin=py;
            leftMargin=px;
            this.source={width:width,height:height};
            console.log('source',this.source);
        });

        this.capturedView.current.measure( (fx, fy, width, height, px, py) => {
            this.target={top:py-topMargin,left:px-leftMargin,width:width,height:height};
            console.log('target',this.target);
        });

        //console.log('source',this.source);
        

    }

    render() {
        if (this.state.device == null) return (<></>);
        return(
            <View style={styles.container}>
                <View style={styles.viewHeaderLayout}>
                    <Image source={{uri:this.state.cutImage}} style={{flex:1, resizeMode:"contain"}}/>
                </View>
                <View style={styles.viewBodyLayout} onLayout={(event) => this.getViewSize(event)} ref={this.cameraView}>
                    <View style={{ width: "100%", height: "100%", position: 'absolute', zIndex: 1 }}>
                        <Camera 
                            ref={this.camera}
                            //frameProcessor={this.frameProcessor}
                            //frameProcessorFps={5}
                            style={StyleSheet.absoluteFill} //view 설정한 크기에 맞게 채워줌
                            device={this.state.device.back}
                            isActive={true}
                        />
                        <View style={this.props.cutImageStyle} ref={this.capturedView}>
                            
                        </View>
                    </View>
                </View>      

                <View style={styles.viewBottomLayout}>
                    <View style={styles.cameraLayout}>
                        <TouchableOpacity style={styles.btn_camera} onPress={this.shutterButtonClicked}>
                            <IconCircle name="circle-thin" size={65} color="#C0C0CE"></IconCircle>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}


//useLocation, useNaviagion, useParams를 사용하기 위해 클래스를 Wrap
//클래스에서는 위와 같은 함수를 사용하지 못함
const withWrapper = (Component) => (props) => {
    const frameProcessor = useFrameProcessor((frame)=> {

    });
    return <Component frameProcessor={frameProcessor} {...props} />;
};

//export default withWrapper(UserCamera);

export default CameraX;