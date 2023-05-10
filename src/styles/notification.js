import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  slidertext: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Pretendard-SemiBold',
    color: '#000000',
    //marginLeft: "15%",
  },
  product: {
    flex: 1,
    //height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E9E9E9',
    marginTop: "2%",
    borderRadius: 10,
    backgroundColor: '#FFF',
    paddingVertical:'2%'
  },
  productTop_view: {
    flexDirection: 'row',
    width: "100%",
    marginBottom: 10
  },
  listItem_view: {
    //flex:1,
    flexDirection: 'row',
    width: "100%",
  },
  circleIcon_view: {
    flex: 2,
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  itemkind_view:{
    width:50,
    height:50,
    justifyContent:'center',
    alignItems:'center', 
    borderWidth:3,
    borderRadius:100, 
    borderColor:'#0066FF',
    //margin:'3%',
  },
  itemkind_text: {
    color: "#0066FF",
    fontWeight: 'bold',
    fontSize: 16
  },
  itemDetail_view: {
    flex: 8,
    justifyContent:'center'
  },
  itemDetail_text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black'
  },

});