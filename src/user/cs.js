import React, { Component } from 'react';
import { View,Text,ScrollView } from 'react-native';

import { template } from "../styles/template/page_style";

class CS extends Component {
    constructor(props) {
        super(props);
    }
  
    render() {
        return (
            <View style={template.total_container}>
            <ScrollView style={template.ScrollView}>
                <View style={template.container}>
                  
               </View>
           </ScrollView>
       </View>
        );
    }
}
export default CS;