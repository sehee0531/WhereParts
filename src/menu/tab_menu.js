import React, {Component} from 'react';
import {Dimensions, Image, Platform, Pressable, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// 경로를 위한 import

//홈
import Home from '../goods/list/home';
//import Home from '../goods/list/home_1';
//import Home from '../goods/list/home_2';
//import Home from '../goods/list/home_3';
//import Home from '../goods/list/home_4';

import AddGoods from '../goods/register/add_goods';
import MyPage from '../user/mypage';
import Notification from '../user/notification';

const Tab = createBottomTabNavigator(); // Tab 일 경우

const styles = StyleSheet.create({
  addGoods: {
    width: Dimensions.get('screen').width / 5.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class Tabs extends Component {
  constructor(props){
    super(props);

    this.initialTabMenu='Home';
    if(this.props.route.params != null){
      const params = this.props.route.params;
      if(params.hasOwnProperty("initialTabMenu"))
        this.initialTabMenu = params.initialTabMenu;
    }
  }

  render() {
    return (
      <Tab.Navigator
        initialRouteName={this.initialTabMenu}
        screenOptions={{
          headerTitleAlign: 'center',
          headerShown: true,
          tabBarActiveTintColor: '#0066FF',
          tabBarInactiveTintColor: '#BCBFC4',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTitleStyle: {
            color: '#1e272e',
          },
          tabBarLabelStyle: {
            marginTop: -6,
            fontSize: 11,
            fontFamily: 'Pretendard-Regular',
          },
          tabBarItemStyle: {
            padding: 2,
          },
          tabBarActiveBackgroundColor: '#F2F2F2',
          unmountOnBlur: Platform.OS === 'android' ? true : false,
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            title: '홈',
            headerShown: false,
            tabBarIcon: ({focused}) => {
              return (
                <Image
                  source={
                    focused
                      ? require('../images/tab/home-icon/home-icon-active.png')
                      : require('../images/tab/home-icon/home-icon.png')
                  }
                />
              );
            },
          }}
        />
        {/*}
        <Tab.Screen
          name="ShopHistory"
          component={ShopHistory} // TODO 변경해줘야함
          options={{
            title: '쇼핑 내역',
            //headerShown: false,
            tabBarIcon: ({focused}) => {
              return (
                <Image
                  source={
                    focused
                      ? require('../images/tab/shop-history-icon/shop-history-icon-active.png')
                      : require('../images/tab/shop-history-icon/shop-history-icon.png')
                  }
                />
              );
            },
          }}
        />*/}
        <Tab.Screen
          name="MyPage"
          component={MyPage}
          options={{
            title: '내 정보',
            headerShown:false,
            tabBarIcon: ({focused}) => {
              return (
                <Image
                  source={
                    focused
                      ? require('../images/tab/my-page-icon/my-page-icon-active.png')
                      : require('../images/tab/my-page-icon/my-page-icon.png')
                  }
                />
              );
            },
          }}
        />
       
        <Tab.Screen
          name="Notice"
          component={Notification} // 변경해야됨
          options={{
            title: '알림',
            tabBarIcon: ({focused}) => {
              return (
                <Image
                  source={
                    focused
                      ? require('../images/tab/service-icon/service-icon-active.png')
                      : require('../images/tab/service-icon/service-icon.png')
                  }
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="AddGoods"
          component={AddGoods}
          initialParams={{imageURLs: []}}
          options={{
            title: '상품 등록',
            tabBarButton: props => {
              return (
                <Pressable {...props} style={styles.addGoods}>
                  <Image
                    source={require('../images/tab/add-goods-icon/add-goods-icon.png')}
                  />
                </Pressable>
              );
            },
            tabBarHideOnKeyboard:true,
          }}
        />
      </Tab.Navigator>
    );
  }
}
export default Tabs;
