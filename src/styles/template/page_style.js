import {StyleSheet,Dimensions} from 'react-native';
const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

export const colors = {
    light: '#C9CCD1',
    medium: '#888888',
    dark: '#000000',
    red:'#FF7E70',
    white:'#FFFFFF',
    main:'#0066FF',
    sub:'blue',
    light_btn:'#F1F1F3',
}

export const template= StyleSheet.create({
    baseContainer:{
     flex:1,
     backgroundColor:colors.white,
    },
    container:{
        flex:1,
        paddingHorizontal:'4%',
    },

    //Line
    line:{
        borderWidth:0.5,
        width:'100%',
        borderColor:colors.light
    },
    //Box
    layoutBox:{
        paddingHorizontal: '2%', 
        paddingVertical:'2%',
    },
    layoutBoxTest:{
        paddingHorizontal: '2%', 
        paddingVertical:'2%',
        borderWidth:1,
    },
    roundedBox:{
        borderWidth: 1, 
        borderRadius: 10, 
        borderColor:colors.light,
        paddingHorizontal: '2%', 
        paddingVertical:'2%',
        marginBottom: '2%',
    },

     //Text
     titleText:{
        fontSize:25,
        color:colors.dark,
        fontWeight:'bold'
     },
    largeText: {
        fontSize: 17,
        color: colors.dark,
    },
    smallText: {
        fontSize: 15,
        color: colors.medium,
    },
    contentText: {
        fontSize: 14,
        color: colors.dark,
    },
    contentTitleText:{
        fontSize: 14,
        color: colors.medium,
    },
    itemNumberText:{
        fontSize:12,
        color:colors.sub,
    },
    itemDistanceText:{
        fontSize: 10,
        color:colors.red
    },
    buttonText:{ 
        fontSize:17,
        color:colors.white,
    },
    inputText:{
        fontSize:15,
        padding:0
    },
    
    //Button
    activeButton:{
        height: 50,
        backgroundColor: colors.main,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inActiveButton:{
        height: 50,
        backgroundColor: colors.light,
        alignItems: 'center',
        justifyContent: 'center'
    },
    smallButton:{ 
        width: 40,
        height: 40,
        backgroundColor: colors.dark,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },

    //Image
    imageView:{
        borderRadius:10,
        width: ScreenWidth / 6.5,
        height: ScreenWidth / 6.5,
    },
  });
  