//Home Style
import { StyleSheet,Dimensions } from 'react-native';
const ScreenHeight=Dimensions.get('window').height;
const ScreenWidth=Dimensions.get('window').width;
export const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFF',
  },
  salesdetailsheader: {
    flexDirection: 'row',
    marginBottom: "5%",
    paddingVertical:'2%',
    paddingHorizontal:'4%'
  },
  headertext: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Pretendard-SemiBold',
    color: '#000000',
  },
  slidertext: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Pretendard-SemiBold',
    color: '#000000',
    paddingBottom:10,
    //marginLeft: "15%",
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

  productImageView: {
    borderWidth: 1,
    flexDirection:"row",
    borderColor: '#E9E9E9',
    borderStyle: 'solid',
    overflow: 'hidden',
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

  productInfoRight: {
    borderTopWidth:1,
    borderRadius:10,
    borderTopColor:'#D1D1D1',
    alignItems:'flex-end',
    justifyContent:'center',
    //marginTop:'1%',
    paddingTop:'1%'
  },

  productRegisterDate: {
    alignItems:'flex-start',
    width:'100%',
    paddingTop:'2%',
    paddingLeft:'3%',
  },
  productDistance: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  // item 글자 디자인
  itemNumberText: {
    fontSize: 15,
    color:'blue',
    fontFamily: 'Pretendard-SemiBold',
  },

  itemNameText: {
    fontSize: 16,
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
});