import React, { Component } from 'react';
import {Text, View, TouchableOpacity, TouchableWithoutFeedback, Modal, StyleSheet} from 'react-native';
import IconPopup from 'react-native-vector-icons/EvilIcons';

//이미지 선택 버튼 클릭시 팝업 (카메라, 갤러리)
export default class ImageSelectorPopup extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const layout = { flex: 1, left: this.props.x, top: this.props.y };
        return (
            <Modal
                animationType='fade'
                transparent={true}
                visible={true}
                onRequestClose={this.props.closeCameraPopupMenu}>
                <TouchableOpacity onPress={this.props.closeCameraPopupMenu} style={{ flex: 1 }}>
                    <View style={layout} >
                        <TouchableWithoutFeedback>
                            <View style={styles.camera_modal_view}>
                                <View style={[styles.center_view,{borderRightWidth:1}]}>
                                    <TouchableOpacity onPress={this.props.goCameraScreen}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <IconPopup name="camera" size={25} color={'black'} ></IconPopup>
                                            <Text style={[styles.btn_text,{color:'black'}]}>카메라   </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.center_view}>
                                    <TouchableOpacity onPress={this.props.goGalleryScreen}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <IconPopup name="image" size={25} color={'black'} ></IconPopup>
                                            <Text style={[styles.btn_text,{color:'black'}]}>앨범</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    center_view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    camera_modal_view: {
        width: 170,
        height: 45,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    btn_text: {
        fontFamily: "Cochin",
        fontSize: 16,
        color: "white",
        alignItems:'center',
    }
});