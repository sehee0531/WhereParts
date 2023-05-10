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
      itemView:{
        padding:"3%",
        marginTop: "3%",
        marginLeft: "3%",
        marginRight: "3%",
        borderRadius: 10,
        backgroundColor:'#FFFF',
        borderWidth:2,
        borderColor:'#E9E9E9',
      },
      imageView:{
        width:ScreenWidth/5,
        height:ScreenWidth/5,
      },
      productImage: {
        flex: 1,
      
     /*    width: 80,
        height: 80, */
        borderRadius: 6,
    
      },
      productInfo: {
        //borderWidth:1,
        flex: 3,
        //paddingLeft:'2%',
        alignItems:'flex-start',
        justifyContent:'flex-end',
    
    /*     alignItems:'flex-end',
        justifyContent:'flex-end', */
    
        //flexDirection: 'row',
      },
    
      dateView:{
        flex:1,
        flexDirection:'row',
      },
      productView: {
        //borderWidth:1,
        paddingBottom:'2%',
        flexDirection: 'row',
        alignItems: 'center',
      },
      productButtonView:{
        height:35,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center'
      },
      payInfoButtonView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        borderRadius:5,
        borderColor: '#ABABAB',
        //marginHorizontal:'2%',
        paddingVertical:'2%'
      },
      deliverInfoButtonView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
      },
      productImageView: {
        width:ScreenWidth/5,
        height:ScreenWidth/5,
      },
      productImage: {
        flex:1,
        borderRadius:6,
      },
      productInfo: {
        //borderWidth:1,
        flex: 3,
        //paddingLeft:'2%',
        alignItems:'flex-start',
        justifyContent:'flex-end',
    
    /*     alignItems:'flex-end',
        justifyContent:'flex-end', */
    
        //flexDirection: 'row',
      },
      productInfoLeft:{
        flex:4,
        paddingHorizontal:'2%',
        //borderWidth:1,
      },
      productInfoRight:{
        flex:2.5,
        alignItems:'flex-end',
        //borderWidth:1,
      },
    
      productRegisterDate:{
        flex:1,
        justifyContent:'flex-end',
        
      },
      productDistance:{
        flex:1,
        justifyContent:'flex-start',
      },
      text:{
        fontSize:13,
        color:'black'
      },
      // item 글자 디자인
      itemNumberText: {
        fontSize: 15,
        color:'blue',
        fontFamily: 'Pretendard-SemiBold',
      },
    
      itemNameText: {
        fontSize: 15,
        //fontWeight: 'bold',
        fontFamily: 'Pretendard-Medium',
        color: '#000000', 
      },
      itemRegisterDateText: {
        fontSize: 15,
        color:'black'
      },
      itemDistanceText: {
        fontSize: 15,
        fontFamily: 'Pretendard-SemiBold',
        color:'black'
      },

      itemPriceText: {
        fontSize: 15,
        //fontWeight: 'bold',
        fontFamily: 'Pretendard-SemiBold',
        fontWeight:'600',
        color: 'black',
      },
      product: {
        flex: 1,
        paddingHorizontal:'2%',
        //flexDirection: 'row',
       // alignItems: 'center',
        borderWidth:2,
        borderColor:'#E9E9E9',
       
        paddingVertical:"2%",
        borderRadius:10,
        backgroundColor: '#FFF',
      },
    
});