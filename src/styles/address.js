import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  total_container: {
    flex: 1,
    backgroundColor: 'white',

  },
  container: {
    flex: 1,
    marginTop: 30,
    //marginLeft:30,
    //marginRight:30,
  },
  rowLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  textInput: {
    backgroundColor: '#F1F1F3',
    marginBottom: 15,
    marginRight: 15,
    paddingHorizontal: 10,

    height: 55,
    width: "96%",
    borderRadius: 10,
    borderColor: '#F1F1F3',
    borderWidth: 1,
  },

  title: {
    fontFamily: "Cochin",
    fontSize: 18,
    fontWeight:"bold",
    color: "black",
    marginBottom: 15,
  },

  btn: {
    width: 100,
    height: 55,
    backgroundColor: "black",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  btn_text: {
    fontFamily: "Cochin",
    fontSize: 15,
    color: "white",
  },
  text: {
    fontFamily: "Cochin",
    fontSize: 15,
    color: "black",
    marginLeft: 10,
    marginRight: 10,
  },
  number_text: {

    width: '55%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#F1F1F3",
    borderRadius: 10,
    height: 55,
    marginBottom: 15,
    marginRight: 15,

  },
  address_text: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#F1F1F3",
    borderRadius: 10,
    height: 55,
    width: "96%",
    marginBottom: 15,
  },
  deliverView:{
    marginBottom:20,
    paddingBottom:10,
    borderBottomWidth:1,
    borderColor:'lightgray',
  },
});