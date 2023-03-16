import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
  //view
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  image_render_view: {
    flex:1,
    justifyContent: 'center',
    marginLeft: 5,
  },
  image_background_view: {
    width: 120,
    height: 90,
    alignItems:'flex-end',
  },
  image_view: {
    width: 'auto',
    height: 'auto',
  },
});

export default styles;