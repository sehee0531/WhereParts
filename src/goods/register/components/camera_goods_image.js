import React, { Component } from 'react';
import {
    StyleSheet, View, Button, Text, Image, FlatList, TouchableOpacity,
    ImageBackground, Modal, DeviceEventEmitter, BackHandler
} from 'react-native';

import CameraX from '../../../util/camera_x';
import { styles } from "../../../styles/register/addgoods_camera_style";
import IconDelete from 'react-native-vector-icons/Ionicons';
import IconCircle from "react-native-vector-icons/FontAwesome";
import IconPicture from "react-native-vector-icons/SimpleLineIcons";

class GoodsImageCamera extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imageURLs: [],
            imageLength: this.props.route.params.imageLength,
        }
    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.backPressed);
    }

    componentWillUnmount() {
        console.log('카메라 백핸들러 이벤트 지우기')
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    backPressed = () => {
        this.props.navigation.pop();
        return true;
    }

    onCapturedListener=(uri)=> {
        console.log('original image : ',uri);
        if (this.state.imageLength > 4) {
            alert('이미지는 최대 5장까지 선택할 수 있어요');
            return this.setState({ imageLength: this.state.imageLength })
        }
        this.setState({ imageLength: this.state.imageLength + 1 });
        this.setState({ imageURLs: this.state.imageURLs.concat(uri) });
    }

    //등록 버튼 클릭
    putButton = (index) => {
        this.props.route.params.onResultListener(this.state.imageURLs);
        this.props.navigation.navigate('AddGoods');
        //console.log("등록버튼 ",this.state.imageURLs);
    }

    // 이미지 삭제
    imageRemove = (index) => {
        console.log(index);
        this.setState({
            imageURLs: this.state.imageURLs.filter((value, indexNum) => indexNum !== index),
            imageLength: this.state.imageLength - 1
        });
        console.log('삭제완료');
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex:1.5}}>
                    <FlatList
                        data={this.state.imageURLs}
                        renderItem={(item) => <ImageRender image={item} imageRemove={(index) => this.imageRemove(index)} />}
                        horizontal={true} // 가로정렬
                    />
                </View>
                <View style={{flex:8.5}}>
                    <CameraX autoClose={false} blur={false} cameraBorder={false} navigation={this.props.navigation} onCapturedListener={this.onCapturedListener} />
                </View>
                <Button title={"등록"} color={"#0066FF"} onPress={()=>this.putButton()} />
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
            <View style={styles.image_render_view}>
                <TouchableOpacity style={styles.image_view}>
                    <ImageBackground source={{ uri: imagePath }} style={styles.image_background_view}>
                        <TouchableOpacity onPress={() => this.props.imageRemove(imageIndex)}>
                            <IconDelete name="close" color="black" size={30}></IconDelete>
                        </TouchableOpacity>
                    </ImageBackground>
                </TouchableOpacity >
            </View>
        )
    }
}

export default GoodsImageCamera;