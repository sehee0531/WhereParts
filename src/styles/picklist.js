import { StyleSheet,Dimensions } from 'react-native';
const ScreenHeight=Dimensions.get('window').height;
const ScreenWidth=Dimensions.get('window').width;

export const styles = StyleSheet.create({
    goodsContent: {
        position: 'relative',
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
      },
      total_container:{
        flex:1,
        backgroundColor:'white',
        //borderWidth:1,
        paddingHorizontal:10,
        paddingVertical:10,
       },
      itemView:{
        flex:1,
        marginBottom:10,
        paddingHorizontal:10,
        paddingVertical:10,
        borderWidth:2,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        marginHorizontal:10,
        borderColor:"#D1D1D1",
      },
     
     
      productImage: {
        flex:1,
        margin:5,
        width: ScreenWidth/3,
        height: ScreenHeight/6,
        borderRadius: 6,
      },
     
      pickView:{
        width:'100%',
        height:'10%',
        alignItems:'flex-end',
        justifyContent:'center',
      
      },
      // item 글자 디자인
      itemNumberText: {
        fontSize: 15,
        fontFamily: 'Pretendard-SemiBold',
      },
     
      itemNameText: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Pretendard-Medium',
        color: '#000000',
      },
      itemRegisterDateText:{
        fontSize: 15
      },
      itemDistanceText:{
        fontSize: 15,
        color:'#EE636A',
       
      },
      itemPriceText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Pretendard-SemiBold',
        color: '#000000',
      },
});