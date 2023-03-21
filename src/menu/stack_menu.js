import React, { Component } from "react";
import { View, FlatList, StyleSheet, Text } from 'react-native';
//Stack
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//마이페이지
import MyPage from "../user/mypage";
import SalesList from "../user/sales/sales_list";
import BuyList from "../user/buy/buy_list";
import PickList from "../user/buy/pick_list";
import AddDelivery from "../user/sales/add_delivery";
import DeliveryDetail from "../user/buy/delivery_detail";
//경로를 위한
import TabHome from "./tab_menu";
import Gallery from "../goods/register/components/gallery";
import GalleryX from "../util/gallery_x";
import GoodsImageCamera from "../goods/register/components/camera_goods_image";
//import SearchWebView from "../goods/list/components/web_view";
import GoogleWebView from "../util/google_web_view";
import Payment from "../goods/pay/payment";
import PayComplete from "../goods/pay/pay_complete";
import GoodsDetail from "../goods/list/components/item_detail";
import OrderDetail from "../user/buy/order_detail";
import EditProfile from "../user/buy/edit_profile";


//로그인 경로
import Login from "../login/member_register";
import SignUp from "../login/signup";
import RegisterGallery from "../login/gallery_register";
import BusinessCardCamera from "../login/camera_business_card";
import PhotoGallery from "../login/gallery_photo";
import CompanyCamera from "../login/camera_company";
import PartsNoCamera from "../goods/register/components/camera_goods_no";

//주소검색
import Address from "../goods/pay/address";
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
                <NativeStack.Screen name="RegisterGallery" component={RegisterGallery}/>
                <NativeStack.Screen name="BusinessCardCamera" component={BusinessCardCamera}
                    options={{ title: "명함" }} />
                <NativeStack.Screen name="PhotoGallery" component={PhotoGallery}/>
                <NativeStack.Screen name="CompanyCamera" component={CompanyCamera}
                    options={{ title: "사업자 등록증" }} />
                <NativeStack.Screen name="PartsNoCamera" component={PartsNoCamera}
                    options={{ title: "" }} />

                <NativeStack.Screen name="MyPage" component={MyPage}
                    options={{ title: "" , headerShown:false}}/>
                <NativeStack.Screen name="EditProfile" component={EditProfile}
                    options={{ title: "" }}/>
                <NativeStack.Screen name="SalesList" component={SalesList}
                    options={{ title: "판매 내역" }}/>
                <NativeStack.Screen name="BuyList" component={BuyList}
                    options={{ title: "구매 내역" }} />
                <NativeStack.Screen name="PickList" component={PickList}
                    options={{ title: "관심 목록" }} />
                <NativeStack.Screen name="AddDelivery" component={AddDelivery}
                    options={{ title: "배송 등록" }} />

                <NativeStack.Screen name="DeliveryDetail" component={DeliveryDetail}
                    options={{ title: "배송 조회" }} />

                <NativeStack.Screen name="Payment" component={Payment}
                    options={{ title: "결제" }} />
                <NativeStack.Screen name="PayComplete" component={PayComplete}
                     options={{ title: "결제완료" }} />
                <NativeStack.Screen name="GoodsDetail" component={GoodsDetail}
                    options={{ headerShown: false }}  />
                <NativeStack.Screen name="Address" component={Address}
                    options={{ title: "주소" }} />
                <NativeStack.Screen name="SearchAddress" component={SearchAddress}
                    options={{ title: "주소검색" }} />
           
                <NativeStack.Screen name="OrderDetail" component={OrderDetail}
                    options={{ title: "주문상세" }} />
               
            </NativeStack.Navigator>
           
        );
    }

}
export default Stack;