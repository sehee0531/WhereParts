import React, { Component } from 'react';
import { Camera,useFrameProcessor } from "react-native-vision-camera";
import { View,StyleSheet,TouchableOpacity,Button,Image,ImageBackground, NativeModules, BackHandler, Text } from 'react-native';

//import IconCamera from 'react-native-vector-icons/Feather';
import IconCamera from 'react-native-vector-icons/FontAwesome5';
import IconCircle from "react-native-vector-icons/FontAwesome";
import { styles } from "../styles/vision_camera_style";
import { tapGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/TapGestureHandler';

class CameraX extends Component {
    constructor(props) {
        super(props);

        this.camera = React.createRef();
        this.capturedView = React.createRef();
        this.cameraView = React.createRef();
        //this.topTextView= React.createRef();
        this.source={};
        this.target={};
        //this.text={};

        //안드로이드에서 정의한 모듈 가져옴
        const {ImageModule} = NativeModules;
        this.imageModule = ImageModule;
        
        this.state={
            device:null,
            cutImage:null,

            // blur
            topBlur:{},
            leftBlur:{},
            rightBlur:{},
            bottomBlur:{},
            // cameraBorder
            imageTopLeft:{},
            imageTopRight:{},
            imageBottomLeft:{},
            imageBottomRight:{},

            topTextView:{},
            bottomTextView:{},
            capturedViewVisible:false
            //cameraButtonView:{},
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

        let sourceHeight=0;
        
        this.cameraView.current.measure( (fx, fy, width, height, px, py) => {     
            topMargin=py;
            leftMargin=px;
            this.source={width:width,height:height};
            sourceHeight=this.source.height;

            console.log('source',this.source);
        })

        //console.log("sourceHeight", sourceHeight);// sourceHeight 0
        if (this.props.hasOwnProperty("onCutImageListener") && this.props.hasOwnProperty("cutImageStyle")) {
            this.capturedView.current.measure((fx, fy, width, height, px, py) => {
            
                this.target = { top: py - topMargin, left: px - leftMargin, width: width, height: height };
                //console.log("sourceHeight",sourceHeight); // sourceHeight 645
                
                // 사진 안내문구 위치 설정(capturedView 위에 위치하도록)
                this.setState({
                    //topTextView height:20, width:140 
                    topTextView: { top: (this.target.top -40), alignSelf:'center',  position: 'absolute', zIndex: 3 },
                    bottomTextView:{top: (this.target.top +this.target.height+15), alignSelf:'center',  position: 'absolute', zIndex: 3,  }
                });

                // blur를 true로 받을 때
                if (this.props.blur == true) {
                    this.setState({
                        //blur
                        topBlur: { top: 0, left: 0, width: "100%", height: this.target.top, backgroundColor: "rgba(0,0,0,0.6)", position: "absolute", zIndex: 2 },
                        leftBlur: { top: this.target.top, left: 0, width: this.target.left, height: this.target.height, backgroundColor: "rgba(0,0,0,0.6)", position: "absolute", zIndex: 2 },
                        rightBlur: { top: this.target.top, left: (this.target.left + this.target.width), width: this.target.left, height: this.target.height, backgroundColor: "rgba(0,0,0,0.6)", position: "absolute", zIndex: 2 },
                        bottomBlur: { top: (this.target.top + this.target.height), left: 0, width: "100%", height: this.source.height - (this.target.top + this.target.height), backgroundColor: "rgba(0,0,0,0.6)", position: "absolute", zIndex: 2 },
                    });
                }
                // cameraBorder를 true로 받을 때
                if (this.props.cameraBorder == true) {
                    this.setState({
                        //cameraBorder 이미지크기: 27x27
                        imageTopLeft: { top: this.target.top, left: this.target.left, position: 'absolute', zIndex: 2 },
                        imageTopRight: { top: this.target.top, left: (this.target.left + this.target.width - 27), position: 'absolute', zIndex: 2 },
                        imageBottomLeft: { top: (this.target.top + this.target.height - 27), left: this.target.left, position: 'absolute', zIndex: 2 },
                        imageBottomRight: { top: (this.target.top + this.target.height - 27), left: (this.target.left + this.target.width - 27), position: 'absolute', zIndex: 2 },
                    });
                }
                this.setState({ capturedViewVisible: true });
                console.log('target', this.target);
            });
        }
        
        /*
        // height 측정은 o, width는 전체 너비로 결과가 나옴
        this.topTextView.current.measure((fx, fy, width, height, px, py) => {
            this.text={width:width,height:height};

            this.setState({topTextView: {top:0,left:(this.source.width-this.text.width)/2,color:"white",borderWidth:1,position:'absolute',zIndex:2}})
            console.log('text',this.text.width);
        });
        */
        //console.log('source',this.source);
    }

    render() {
        console.log("render");
        if (this.state.device == null) return (<></>);
        return (
            <View style={styles.container}>
                <View style={styles.viewBodyLayout} onLayout={(event) => this.getViewSize(event)} ref={this.cameraView}>
                        <Camera
                            ref={this.camera}
                            //frameProcessor={this.frameProcessor}
                            //frameProcessorFps={5}
                            style={StyleSheet.absoluteFill} //view 설정한 크기에 맞게 채워줌
                            device={this.state.device.back}
                            isActive={true}
                        />
                        
                        <View style={this.props.cutImageStyle} ref={this.capturedView} />
                        {/* cameraBorder가 true이고 좌표계산이 끝났으면 */}
                        {this.props.cameraBorder==true && this.state.capturedViewVisible==true && <>
                            <Image style={this.state.imageTopLeft} source={require('../images/icon/angle-icon/angle11.png')} />
                            <Image style={this.state.imageTopRight} source={require('../images/icon/angle-icon/angle22.png')} />
                            <Image style={this.state.imageBottomLeft} source={require('../images/icon/angle-icon/angle33.png')} />
                            <Image style={this.state.imageBottomRight} source={require('../images/icon/angle-icon/angle44.png')} /></>
                        }

                        {/* 전체화면에서 captured View만 있을 경우 */}
                        {this.props.hasOwnProperty("upperText") &&this.props.hasOwnProperty("cutImageStyle") && this.props.hasOwnProperty("onCutImageListener") && this.state.capturedViewVisible==true &&<>
                            <View style={[this.state.topTextView,styles.topTextViewStyle]} /*ref={this.topTextView}*/>
                                <Text style={{color:'white'}}>{this.props.upperText}</Text>
                            </View>
                            </>
                        }
                        {this.props.hasOwnProperty("downText")&&this.props.hasOwnProperty("cutImageStyle") && this.props.hasOwnProperty("onCutImageListener") && this.state.capturedViewVisible==true &&<>
                          <View style={this.state.bottomTextView}>
                            <Text style={{color:'white',textAlign:'center'}} /*ref={this.topTextView}*/>{this.props.downText}</Text>
                          </View>
                          
                          </>
                      }

                        {/* blur==true (captured View이외의 화면을 뿌옇게) 하고 좌표 계산이 끝났으면 */}
                        {this.props.blur==true && this.state.capturedViewVisible==true && <>
                            <View style={this.state.topBlur} />
                            <View style={this.state.leftBlur} />                            
                            <View style={this.state.rightBlur} />
                            <View style={this.state.bottomBlur} /></>
                        }
                </View>

                <View style={styles.viewBottomLayout}>
                    <View style={styles.cameraLayout}>
                        <TouchableOpacity style={styles.btn_camera} onPress={this.shutterButtonClicked}>
                            <IconCamera name="camera" size={30} color="#0066FF" style={{ position: 'absolute' }} />
                            <IconCircle name="circle-o" size={69} color="#0066FF" />
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