import React, { Component } from "react";
import { View, FlatList, StyleSheet, Text } from 'react-native';
//Stack
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//마이페이지
import MyPage from "../user/mypage";

//판매내역
import SalesList from "../user/sales/sales_list";

//구매내역
import BuyList from "../user/buy/buy_list";

//관심목록
import PickList from "../user/buy/pick_list";

//배송등록
import AddDelivery from "../user/sales/add_delivery";

//배송조회
import DeliveryDetail from "../user/buy/delivery_detail";

//경로를 위한
import TabHome from "./tab_menu";
import Gallery from "../goods/register/gallery";
import GalleryX from "../util/gallery_x";
import GoodsImageCamera from "../goods/register/camera_goods_image";
import GoogleWebView from "../util/google_web_view";

//결제창
import Payment from "../goods/pay/payment";
//결제완료
import PayComplete from "../goods/pay/pay_complete";

//상품상세
import GoodsDetail from "../goods/list/item_detail";

import OrderDetail from "../user/buy/order_detail";
import EditProfile from "../user/buy/edit_profile";


//로그인 경로
import Login from "../login/login";
import SignUp from "../login/signup";
import SignUpGallery from "../login/gallery";
import SignUpCamera from "../login/camera";
import PartsNoCamera from "../goods/register/camera_goods_no";

//주소검색
import SearchAddress from "../goods/pay/address_search";

const NativeStack = createNativeStackNavigator();

class Stack extends Component {

    render() {
        return (
      
            <NativeStack.Navigator initialRouteName="Login"
                screenOptions={{
                    headerTitleAlign: 'center',
                }}>


                <NativeStack.Screen name="TabHome" component={TabHome}
                    options={{ headerShown:false}} />
            
                <NativeStack.Screen name="Gallery" component={Gallery}
                    options={{ title: "앨범", }} />
                <NativeStack.Screen name="GalleryX" component={GalleryX}
                    options={{ title: "앨범X", }} />
                <NativeStack.Screen name="GoodsImageCamera" component={GoodsImageCamera}
                    options={{ title: "카메라", }} />
                <NativeStack.Screen name="GoogleWebView" component={GoogleWebView}
                    options={{ title: "" }} />

                <NativeStack.Screen name="Login" component={Login}
                    options={{ headerShown: false }} />
                <NativeStack.Screen name="SignUp" component={SignUp} 
                     initialParams={{ companyNoImageURL: [],cardImageURL:[],companyNo:"" }} options={{ title: " " }} />
                <NativeStack.Screen name="SignUpGallery" component={SignUpGallery} options={{ title: "사진선택" }}/>
                <NativeStack.Screen name="SignUpCamera" component={SignUpCamera} options={{ title: "사진촬영" }} />
                <NativeStack.Screen name="PartsNoCamera" component={PartsNoCamera}
                    options={{ title: "" }} />

                <NativeStack.Screen name="MyPage" component={MyPage}
                    options={{ title: "" , headerShown:false}}/>
                <NativeStack.Screen name="EditProfile" component={EditProfile}
                    options={{ title: "" }}/>
                <NativeStack.Screen name="SalesList" component={SalesList}
                    options={{ title: "판매 내역",headerBackVisible:false }}/>
                <NativeStack.Screen name="BuyList" component={BuyList}
                    options={{ title: "구매 내역",headerBackVisible:false}} />
                <NativeStack.Screen name="PickList" component={PickList}
                    options={{ title: "관심 목록" }} />
                <NativeStack.Screen name="AddDelivery" component={AddDelivery}
                    options={{ title: "배송 등록" }} />

                <NativeStack.Screen name="DeliveryDetail" component={DeliveryDetail}
                    options={{ title: "배송 조회" }} />

                <NativeStack.Screen name="Payment" component={Payment}
                    options={{ title: "결제" }} />
                <NativeStack.Screen name="PayComplete" component={PayComplete} 
                     options={{ title: "결제완료", headerBackVisible:false}} />
                <NativeStack.Screen name="GoodsDetail" component={GoodsDetail}
                    options={{ headerShown: false }} />
              
                <NativeStack.Screen name="SearchAddress" component={SearchAddress}
                    options={{ title: "주소검색" }} />
           
                <NativeStack.Screen name="OrderDetail" component={OrderDetail}
                    options={{ title: "주문상세" }} />
               
            </NativeStack.Navigator>
           
        );
    }

}
export default Stack;