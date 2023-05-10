import AsyncStorage from "@react-native-async-storage/async-storage";
import WebServiceManager from "../util/webservice_manager";
import Constant from "./constatnt_variables";
import { useWindowDimensions } from "react-native";
import Session from "./session";

export default class FunctionUtil {
    
    //AsyncStorage에 저장된 값을 기반으로 companyNo,passwd,detailLogin를 리턴함
    //자동 로그인이 선택된 경우 7일이 경과하면 모든값을 초기상태로 되돌림, companyNo:"", passwd:"", detailLogin:0
    static async getLoginType() {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const firedDateInfo = await AsyncStorage.getItem('firedDateInfo');
        let value = { companyNo: "", passwd: "", detailLogin: 0};

        if (userInfo != null) {
            const { companyNo, passwd, detailLogin } = JSON.parse(userInfo);
            if (detailLogin == 0) {//로그인 방법을 아무것도 선택하지 않았을 경우
                value = { companyNo: "", passwd: "", detailLogin: 0};
            }
            else if (detailLogin == 1) {    //자동 로그인일 경우
                const today = parseInt(Date.now()/1000);
                //자동로그인 선택 후 7일이 경과하면 detailLogin을 0으로 다시 세팅
                if (firedDateInfo != null) {
                    const {firedDate} = JSON.parse(firedDateInfo);
                    if (firedDate - today < 0) 
                        value = { companyNo: "", passwd: "", detailLogin: 0 };
                    else
                        value = { companyNo: companyNo, passwd: passwd, detailLogin: 1 };
                }
            }
            else if (detailLogin == 2) { //id 기억일 경우
                value = { companyNo: companyNo, passwd: "", detailLogin: 2 };
            }
            return value;
        }
        else{
            return value;
        }
    }

    //로그인 API호출하고 세션값 저장(로그인 성공이면 true, 실패면 false return)
    static async goLogin(loginInfo){
        //console.log("로그인을 위한 정보 = ",loginInfo);
        let success = await this.callLoginAPI(loginInfo).then((response) => {
            //console.log("로그인 후 서버로부터 가져온 정보 = ", response);
            //정상적으로 로그인되었다면 userID(id)가 넘어옴            
            if (response.id != 0) {
                //세션에 userID,로그인ID(companyNo)사업자명,주소,로그인된 상태를 저장    
                let userInfo = {
                    id: response.id,
                    companyNo:response.companyNo,
                    companyName: response.companyName,
                    companyAddress: response.companyAddress,
                    isLoggedin: true
                }
                Session.setUserInfoItem(userInfo);
                
                //자동로그인으로 로그인된게 아니고 자동로그인이 선택된 경우(로그인 버튼을 클릭하여 로그인되면서 자동 로그인 선택한 경우)
                //AsyncStorage에 자동로그인 만료될 시간을 설정(현재 7일)
                if (loginInfo.isAutoLogin == false && loginInfo.detailLogin == 1) {
                    const firedDate = {
                        //firedDate: parseInt((Date.now() + Constant.asyncFiredTermTest) / 1000)    //테스트용 2분
                        firedDate: parseInt((Date.now() + Constant.asyncFiredTerm * 7) / 1000)      //7일
                    }
                    AsyncStorage.setItem('firedDateInfo', JSON.stringify(firedDate));
                }

                //현재 설정된 로그인 타입에 대한 정보를 AsyncStorage에 저장
                userInfo = {
                    companyNo: response.companyNo,
                    passwd: response.passwd,
                    detailLogin: loginInfo.detailLogin,
                }
                AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                return true;
            }
            return false;
        });
        return success;
    }

    //로그인 API호출
    static async callLoginAPI(loginInfo) {
        const {companyNo,passwd, deviceToken} = loginInfo;
        let manager = new WebServiceManager(Constant.serviceURL + "/Login", "post");
        manager.addFormData("data", { companyNo: companyNo, passwd: passwd, deviceToken: deviceToken });
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }

    //AsyncStorage에 저장된 값 단순히 리턴
    static async loginInfo(){
        const obj = await AsyncStorage.getItem('userInfo');
        const { companyNo, passwd, detailLogin } = JSON.parse(obj);
        value = { companyNo: companyNo, passwd: passwd, detailLogin: detailLogin };
        return value;
    }

    //정수를 금액단위로 표시
    static getPrice(data) {
        data = data.toString().replace(/,/g,'');
        return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
}