import React, {Component} from "react";
import { ActivityIndicator , StyleSheet, View } from "react-native";

class Indicator extends Component{
    render(){
        return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0066FF"/>
        </View>
        )
    }
} 

const styles = StyleSheet.create({
    container :{
        flex : 1,
        justifyContent :"center"
    }
    
})

export default Indicator;