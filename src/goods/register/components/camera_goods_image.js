import React, { Component } from 'react';
import { StyleSheet, View, Button, Text, Image, FlatList, TouchableOpacity,
     ImageBackground, Modal,DeviceEventEmitter, BackHandler } from 'react-native';


import { Camera } from 'react-native-vision-camera';

import {styles} from "../../../styles/register/visioncamera_style";
import IconDelete from 'react-native-vector-icons/Ionicons';
import IconCircle from "react-native-vector-icons/FontAwesome";
import IconPicture from "react-native-vector-icons/SimpleLineIcons";

class GoodsImageCamera extends Component {
    constructor(props) {
        super(props);

        this.camera = React.createRef();
        this.cameraView=React.createRef();

        this.devices = [];
        this.state = {
            imageURLs: [],
            imageLength:this.props.route.params.imageLength,
            device: null,
            //modal: false
        }
        this.source={};
    }
    
  
    componentDidMount() {
        this.availableCameraDevices().then((select) => {
            this.setState({ device: select });
        });
        BackHandler.addEventListener("hardwareBackPress", this.backPressed);
    }

    componentWillUnmount() {
        console.log('카메라 백핸들러 이벤트 지우기')
        BackHandler.removeEventListener('hardwareBackPress',this.backPressed);      
    }

    backPressed=()=>{
        this.props.navigation.pop();
        return true;
    }
    

    async availableCameraDevices() {
        this.devices = await Camera.getAvailableCameraDevices();
        const sorted = this.devices.sort(this.devices.devices);
        return {
            back: sorted.find((d) => d.position === "back"),
            front: sorted.find((d) => d.position === "front")
        }
    }
   
   //카메라 버튼 클릭
   onPressButton = async () => {
    const photo = await this.camera.current.takeSnapshot({
        flash: 'off',
    })
    if(this.state.imageLength>4){
        alert('이미지는 최대 5장까지 선택할 수 있어요');
        return this.setState({imageLength:this.state.imageLength})
    }
    this.setState({imageLength:this.state.imageLength+1})
   
    this.setState({ imageURLs: this.state.imageURLs.concat('file://' + photo.path) })
    }

    getViewSize=(event) => {
        const layout = event.nativeEvent.layout;
        console.log('width',layout.width);
        console.log('width',layout.height);
        let topMargin=0;
        let leftMargin=0;
        
        this.cameraView.current.measure( (fx, fy, width, height, px, py) => {
            console.log('Component fx is: ' + fx)
            console.log('Component fy is: ' + fy)
            console.log('Component width is: ' + width)
            console.log('Component height is: ' + height)
            console.log('X offset to page: ' + px)
            console.log('Y offset to page: ' + py)

            topMargin=py;
            leftMargin=px;
            this.source={width:width,height:height};
        });
    }

    //등록 버튼 클릭
    putButton = (index) => {
        this.props.route.params.callback(this.state.imageURLs)
        this.props.navigation.navigate('AddGoods');
        //console.log("등록버튼 ",this.state.imageURLs);
    }

    // 이미지 삭제
    imageRemove = (index) => {
        console.log(index);
        this.setState({
            imageURLs: this.state.imageURLs.filter((value, indexNum) => indexNum !== index),

            imageLength:this.state.imageLength-1
        });
        console.log('삭제완료');
    };

    render() {
        if (this.state.device == null) return (<></>);
        return (
            <View style={styles.background_view}>

                <View style={styles.header_view}>
                    <FlatList
                        data={this.state.imageURLs}
                        renderItem={(item) => <ImageRender image={item} imageRemove={(index) => this.imageRemove(index)} />}
                        horizontal={true} // 가로정렬
                    />
                </View>

                <View style={{flex:7}} onLayout={(event) => this.getViewSize(event)} ref={this.cameraView}>
                    <Camera
                        ref={this.camera}
                        style={StyleSheet.absoluteFill}
                        device={this.state.device.back}
                        isActive={true}
                    />
                </View>

                <View style={styles.bottom_view}>
                    <View style={[styles.center_view,{alignItems:'flex-start'}]} />
                    <View style={styles.center_view}>
                        <TouchableOpacity style={styles.camera_btn} onPress={this.onPressButton}>
                            <IconCircle name="circle-thin" size={65} color="#C0C0CE"></IconCircle>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={[styles.center_view,{alignItems:'flex-end'}]}>
                        <TouchableOpacity style={styles.register_btn} onPress={this.putButton}>
                            <Text style={styles.register_text}>등 록</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

class ImageRender extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const imagePath = this.props.image.item;
        const imageIndex = this.props.image.index;

        return (
            <TouchableOpacity style={styles.image_view}>
                <View style={{flex:1}}>
                    <ImageBackground source={{ uri: imagePath }} style={styles.imagebackground_view}>
                        <TouchableOpacity onPress={() => this.props.imageRemove(imageIndex)}>
                            <IconDelete name="close" color="black" size={30}></IconDelete> 
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
            </TouchableOpacity >
        )
    }
}

export default GoodsImageCamera;