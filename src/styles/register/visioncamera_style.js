import { StyleSheet, Dimensions } from 'react-native';
const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;
export const styles = StyleSheet.create({

  //view
  background_view: {
    flex: 1,
    backgroundColor: 'black',
  },
  header_view: {
    flex: 2,
    justifyContent: 'center',
    marginTop: 12,
  },
  bottom_view: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 30
  },
  imagebackground_view: {
    flex: 1,
    width: 160,
    height: 100,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  center_view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image_view: {
    flex: 1,
    width: 160,
    height: 100,
    margin: 5,
  },
  
//button
  camera_btn: {
    width: 65,
    height: 65,
    backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  register_btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  //text
  register_text: {
    fontSize: 15,
    color: "yellow",
  },
});

export default styles;