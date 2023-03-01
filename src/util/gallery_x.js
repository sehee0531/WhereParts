import React,{Component} from 'react';
import {StyleSheet,SafeAreaView,TouchableOpacity,NativeModules,FlatList, StatusBar,Image, Dimensions, View, Text, TouchableWithoutFeedbackBase} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import ImagePlus from 'react-native-vector-icons/MaterialCommunityIcons';

export default class GalleryX extends Component {
    constructor(props) {
        super(props);
        this.selectedIndexes=[];
        this.isSelectEnabled=true;
        this.isDeSelectEnabled=true;
        
        this.max=this.props.max;
        this.autoClose=this.props.autoClose;
        this.onResultListener=this.props.onResultListener;

        console.log("max값",this.props.max)
        console.log("autoClose", this.props.autoClose)
        this.state={
            imageURIs:[]
        };
    }

    componentDidMount() {
        const {AlbumModule} = NativeModules;
        AlbumModule.getAlbumUris(this.failedCallback, this.successCallback);
    }

    failedCallback=(message)=> {
        console.log('error',message);
    }

    //앨범의 모든 이미지 URI를 가져온 경유
    successCallback=(uris)=> {
        this.setState({imageURIs:uris});
    }

    //사진을 선택한 경우
    onSelectListener=(index)=> {
        if(this.selectedIndexes.length<this.max) {
            this.selectedIndexes.push(index);
        }
        if(this.selectedIndexes.length==this.max) {
            this.isSelectEnabled=false;
            this.isDeSelectEnabled=true;
        }       
        if(this.autoClose) {
            this.onResultListener(this.state.imageURIs[index]);
            this.props.navigation.pop();
        }
    }

    //사진 선택을 해제한 경우
    onDeSelectListener=(index)=> {
        if(this.selectedIndexes.length>0) {
            this.selectedIndexes=this.selectedIndexes.filter((item)=> {
                return item!=index;
            });       
        }
       
        if(this.selectedIndexes.length>=0 && this.selectedIndexes.length<this.max) {
            this.isSelectEnabled=true;
            this.isDeSelectEnabled=true;
        }
    }

    //선택완료 버튼을 클릭한 경우
    onSelectComplete=()=> {
        console.log('selected indexes = ',this.selectedIndexes);

        const uris=[];
        for(let i=0;i<this.selectedIndexes.length;i++) 
            uris.push(this.state.imageURIs[i]);

        console.log(uris);
        this.onResultListener(uris);
        this.props.navigation.pop();
    }

    //사진을 선택할 수 있는 상황인지 판단
    getSelectEnabled=()=> {
        return this.isSelectEnabled;
    }

    //사진선택을 해제할 수 있는지 판단
    getDeSelectEnabled=()=> {
        return this.isDeSelectEnabled;
    }

    render() {
        return(
            <SafeAreaView style={styles.container}>
                <TouchableOpacity onPress={this.onSelectComplete} style={{alignItems:'flex-end', paddingRight:'2%',  paddingTop:'1.5%'}}>
                    <ImagePlus name={'image-plus'} size={40}/>
                    {/*<Text style={styles.text}>선택완료</Text>*/}
                </TouchableOpacity>
                <FlatList data={this.state.imageURIs} horizontal={false} numColumns={3} renderItem={(item)=><ListItem item={item} onSelectListener={(index)=>this.onSelectListener(index)} onDeSelectListener={(index)=>this.onDeSelectListener(index)} getSelectEnabled={this.getSelectEnabled} getDeSelectEnabled={this.getDeSelectEnabled}/>}/>              
            </SafeAreaView>
        );
    }
}


class ListItem extends Component {
    constructor(props){
        super(props);

        this.imageURI=this.props.item.item;
        this.index=this.props.item.index;
        this.isSelected=false;

        this.state={
            checkBoxVisible:false
        };
    }

    componentDidMount() {
        //this.setState({imageSource:this.props.item.item});
    }

    //사진을 선택 또는 해제할 경우
    imageSelectHandler=()=> {        
        this.isSelected=!this.isSelected;
        console.log('select enabled : ',this.props.getSelectEnabled());
        if(this.props.getSelectEnabled()==true && this.isSelected==true) {
            this.props.onSelectListener(this.index);
            this.setState({checkBoxVisible:true});
        }
        else if(this.props.getDeSelectEnabled()==true && this.isSelected==false) {
            this.props.onDeSelectListener(this.index);
            this.setState({checkBoxVisible:false})
        }
        else
            this.setState({checkBoxVisible:false});       
    }

    render() {
        return(
            <TouchableOpacity onPress={this.imageSelectHandler}>
                <View style={{paddingTop:'3%',paddingLeft:'2%',  /*borderWidth:1*/}}>
                    <Image source={{ uri: this.imageURI }} style={styles.image} />
                </View>
                {/* 이미지 선택여부 CheckBox */}
                {this.state.checkBoxVisible && (
                    <View style={styles.overlay}>
                        <CheckBox tintColors={{true:'white', false:'black'}} disabled={false} value={true}/>
                    </View>
                )}
            </TouchableOpacity>
        );
    }
}



const ScreenHeight=Dimensions.get('window').height;
const ScreenWidth=Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      //marginTop: StatusBar.currentHeight || 0,
    },
    image: {
        width:(ScreenWidth/3.2),
        height:(ScreenWidth/3.2),
        alignSelf:'center',
        //marginHorizontal:"0.3%",
        //marginVertical:"0.5%",
        //borderRadius:15
    },
    text:{
        fontFamily:"Cochin",
        fontSize:15,
        color:"blue",
        //borderWidth:1,
        //alignItems: 'flex-end',
    },
    overlay:{
        position:"absolute",
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop:5,
        paddingRight:5,
        width:"100%",
        height :"100%",
        //backgroundColor : "rgba(0,0,0,0.6)",
        top:0,
      },
});