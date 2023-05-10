import React, {Component} from "react";
import { StyleSheet, View, Modal,Text } from "react-native";

class IndicatorText extends Component{

    constructor(props) {
        super(props);
        this.text=this.props.text;
    }

    render(){
        return (
            <Modal animationType='fade' transparent={true} visible={true}>
                <View style={inStyle.container}>
                    <View style={inStyle.box}>
                        <Text style={inStyle.text}>{this.text}</Text>
                    </View>
                </View>
            </Modal>
        );
    }
} 

const inStyle = StyleSheet.create({
    container :{
        flex : 1,
        backgroundColor:'rgba(52, 52, 52, 0.4)',//불투명도 40%
        alignItems:"center",
        justifyContent :"center",
    },

    box: {
        backgroundColor:"#eeeeee",
        borderWidth:1,
        borderRadius:15,
        borderColor:'black',
        justifyContent:'center',
        paddingVertical:'5%',
        paddingHorizontal:'10%',
    },

    text:{
        fontSize:15,
        color:'black',
        textAlign:'center',
    }
    
})

export default IndicatorText;