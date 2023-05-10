import { StyleSheet, Dimensions } from 'react-native';
const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
    goodsContent: {
        position: 'relative',
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    total_container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: '2%',
        paddingVertical: '4%',
        //borderWidth:1,
    },
    item_view: {
        width: ScreenWidth / 2.2,
        borderWidth: 1.5,
        borderRadius: 10,
        borderColor: '#D9D9D9',
        padding:'3%',
        marginBottom:'5%',
        marginLeft:'3%',
    },

    listTop_view: {
        width: '100%',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor:'#D9D9D9',
        paddingBottom:3,
    },
    listBottom_view:{
        flexDirection:'row',
        borderColor:'#D9D9D9',
        paddingTop:10,
    },
    pick_view: {
        flex: 1,
        alignItems: 'flex-end',
    },
    productImage_view:{
        width: ScreenWidth / 6.5,
        height: ScreenWidth / 6.5,
    },
    productImage: { 
        flex: 1,
        width: ScreenWidth / 6.5,
        height: ScreenWidth / 6.5,
        borderRadius: 10,
    },
    productInfoRight_view:{
        flex:1,
        height:ScreenWidth / 6.5,
        alignItems:'flex-end',
        justifyContent:'flex-end',
    },
    
    // item 글자 디자인
    itemName_text: {
        fontSize: 14,
        fontFamily: 'Pretendard-Medium',
        color: '#000000',
    },
    itemNumber_text: {
        fontSize: 12,
        color:'blue',
        fontFamily: 'Pretendard-SemiBold',
    },
    itemPrice_text: {
        fontSize: 14,
        fontFamily: 'Pretendard-Medium',
        color: '#000000',
    },
    itemDistance_text: {
        fontSize: 10,
        color: '#EE636A',
    },
    itemRegisterDate_text: {
        fontSize: 15
    },
});