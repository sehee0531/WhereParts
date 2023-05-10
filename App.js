import React, { Component } from "react";
import { Alert, AppState } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";

import Stack from "./src/menu/stack_menu";

//FCM
import Session from "./src/util/session";
import messaging from '@react-native-firebase/messaging';
class App extends Component {

  constructor(props) {
    super(props);

    this.state={
      appState: AppState.currentState,
    }
  }

  componentDidMount() {
    this.handleFCMMessage();
    this.appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
      }
      if (this.state.appState.match(/active|foreground/) && nextAppState === 'background') {
        console.log('App has go to the background');
      }
      this.setState({ appState: nextAppState });
    });
  }

  componentWillUnmount() {
    this.appStateSubscription.remove();
  }


  handleFCMMessage() {
    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('백그라운드 상태에서 메시지가 왔습니다.', remoteMessage);
      let pageInfo = {
        prevPage: "BuyList",
        nextPage: "MyPage"
      }
      Session.setPageInfoItem(pageInfo);
    });

    /* const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('포어그라운드 상태에서 베시지가 왔습니다.', remoteMessage);
      Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body, [
        { text: '취소', onPress: () => { } },
        { text: '확인', onPress: () => { } }],
        { cancelable: false });
      return unsubscribe;

    });

    //Background 상태에서 알림창을 클릭한 경우 해당 페이지로 이동         
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('앱이 백그라운드 상태에서 알림창을 클릭하여 앱을 실행하였습니다.', remoteMessage.notification);
      //this.backGroundNotiOkButtonClicked(remoteMessage);
    }); */

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('앱이 완전히 메모리에서 제거된 상태에서 알림이 왔습니다.', remoteMessage.notification);
        //setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
      }
      //setLoading(false);
    });
  }

  render() {
    return (

      <NavigationContainer>
        <Stack />
      </NavigationContainer>

    );
  }
}

export default App;