import React, { Component } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';


import EmptyListIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class EmptyListView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                {this.props.hasOwnProperty('contentContainerStyle') && (<ScrollView
                    style={{ borderWidth: 0, paddingTop: "45%", paddingLeft: "35%" }}
                    refreshControl={<RefreshControl refreshing={this.props.isRefresh} onRefresh={this.props.onRefreshListener} />}
                    contentContainerStyle={this.props.contentContainerStyle}
                >
                    <EmptyListIcon name='clipboard-text-off-outline' size={100} />
                    <Text style={{ fontSize: 18, }}>항목이 없습니다</Text>
                </ScrollView>)}
                
                {this.props.hasOwnProperty('contentContainerStyle')==false && (<ScrollView
                    style={{ borderWidth: 0, paddingTop: "45%", paddingLeft: "35%" }}
                    refreshControl={<RefreshControl refreshing={this.props.isRefresh} onRefresh={this.props.onRefreshListener} />}
                >
                    <EmptyListIcon name='clipboard-text-off-outline' size={100} />
                    <Text style={{ fontSize: 18, }}>항목이 없습니다</Text>
                </ScrollView>)}
            </>
        );
    }
}