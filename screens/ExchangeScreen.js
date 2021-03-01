import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View , Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import db from '../config'
import firebase from 'firebase'
import MyHeader from '../components/MyHeader'
import { KeyboardAvoidingView } from 'react-native';

export default class HomeScreen extends React.Component{

    constructor(){
        super();
        this.state={
            userName : '',
            itemName : '',
            IsExchangeRequestActive : "",
            description : '',
            itemStatus : '',
            exchangeId:"",
            requestedItemName : '',
            userDocId: '',
            docId :'',
            Imagelink : '',
            dataSource : '',
            showFlatlist : false
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7);
      }

    addItem=(itemName,description)=>{
        var userName = this.state.userName
        var randomRequestId = this.createUniqueId()
        db.collection("exchange_requests").add({
            "username" : userName,
            "item_name" : itemName,
            "description" : description,
            "request_id"  : randomRequestId,
        })
        this.setState({
            itemName : '',
            description : ''       
        })

        return alert(
            'Item ready to exchange',
            '',
            [
                {text : 'OK', onPress : () => {
                    this.props.navigation.navigate('HomeScreen')
                }}
            ]
        )

    }

    receivedItems=(itemName)=>{
        var userName = this.state.userName
        var requestId = this.state.exchangeId
        db.collection('received_items').add({
            "user_id": userName,
            "item_name":itemName,
            "request_id"  : requestId,
            "itemStatus"  : "received",
      
        })
      }

    getIsExchangeRequestActive(){
        db.collection('users')
        .where('email_id','==',this.state.userId)
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.setState({
              IsExchangeRequestActive:doc.data().IsExchangeRequestActive,
              userDocId : doc.id
            })
          })
        })
      }

      
sendNotification=()=>{
    //to get the first name and last name
    db.collection('users').where('email_id','==',this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var name = doc.data().first_name
        var lastName = doc.data().last_name
  
        // to get the donor id and item nam
        db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            var donorId  = doc.data().donor_id
            var itemName =  doc.data().item_name
  
            //targert user id is the donor id to send notification to the user
            db.collection('all_notifications').add({
              "targeted_user_id" : donorId,
              "message" : name +" " + lastName + " exchanged the item " + itemName ,
              "notification_status" : "unread",
              "item_name" : itemName
            })
          })
        })
      })
    })
  }

  updateItemRequestStatus=()=>{
    //updating the item status after receiving the item
    db.collection('exchange_requests').doc(this.state.docId)
    .update({
      exchange_status : 'recieved'
    })
  
    //getting the  doc id to update the users doc
    db.collection('users').where('email_id','==',this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        //updating the doc
        db.collection('users').doc(doc.id).update({
          IsExchangeRequestActive: false
        })
      })
    })
  
  
  }

    render(){
       if (this.state.IsExchangeRequestActive === true) {
        return(

            // Status screen
    
            <View style = {{flex:1,justifyContent:'center'}}>
              <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
              <Text>Item Name</Text>
              <Text>{this.state.requestedItemName}</Text>
              </View>
              <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
              <Text> Item Status </Text>
    
              <Text>{this.state.itemStatus}</Text>
              </View>
    
              <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
              onPress={()=>{
                this.sendNotification()
                this.updateItemRequestStatus();
                this.receivedItems(this.state.requestedItemName)
              }}>
              <Text>I recieved the Item </Text>
              </TouchableOpacity>
            </View>
          )
       } else {
        return(
            <View style={{flex:1}}>
                <MyHeader
                title = "Add Item"
                navigation = {this.props.navigation}
                />
                <KeyboardAvoidingView
                style={{flex :1, justifyContent : 'center', alignItems : 'center'}}
                >
                <TextInput
                placeholder={"Item Name"}
                onChangeText={(text)=>{
                    this.setState({
                        itemName : text
                    })
                }}
                value={this.state.itemName}
                />
                <TextInput
                placeholder={"Description"}
                multiline={true}
                onChangeText={(text)=>{
                    this.setState({
                        description : text
                    })
                }}
                value={this.state.description}
                />
                <TouchableOpacity style={styles.button}
                onPress={()=>{
                    this.addItem(this.state.itemName,this.state.description)
                }}
                >
                    <Text style={{color:'#ffff',fontSize:18,fontWeight:'bold'}}>
                        Add Item
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
            </View>
        )
       }
    }
}

const styles = StyleSheet.create({
    button:{ width:"75%", height:50, justifyContent:'center', alignItems:'center', borderRadius:10, backgroundColor:"#ff5722", shadowColor: "#000", shadowOffset: { width: 0, height: 8, }, shadowOpacity: 0.44, shadowRadius: 10.32, elevation: 16, marginTop:20 }, 
} )
