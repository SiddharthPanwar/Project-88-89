import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'

export default class MyDonationScreen extends Component {
  static navigationOptions = { header: null };

   constructor(){
     super()
     this.state = {
       userId : firebase.auth().currentUser.email,
       allDonations : [],
       donorName : ''
     }
     this.requestRef= null
   }

   getDonorDetails=()=>{
     db.collection("users").where("email_id",'==',donorId).get()
     .then((snapshot)=>{
      snapshot.forEach((doc) => {
        this.setState({
          donorName  :doc.data().first_name + " " + doc.data().last_name
        })
      })
    })
   }

   sendItem=(itemDetails)=>{
     if (itemDetails.request_status==="Item Sent") {
       var requestStatus = "Donor Interested"
       db.collection("all_donations").doc(itemDetails.doc_id).update({
         "request_status" : "Donor Interested"
       })
       this.sendNotification(itemDetails,requestStatus)
     } else {
      var requestStatus = "item Sent"
      db.collection("all_donations").doc(itemDetails.doc_id).update({
        "request_status" : "item Sent"
      })
      this.sendNotification(itemDetails,requestStatus)
     }
   }

   sendNotification=(itemDetails,requestStatus)=>{
     var requestId = itemDetails.request_id
     var donorId = itemDetails.donor_id
     db.collection("all_notifications").where("request_id","==",requestId).where("donor_id","==",donorId).get()
     .then((snapshot)=>{
       snapshot.forEach((doc)=>{
         var message = ""
         if (requestStatus==="Item Sent") {
           message = this.state.donorName + "Has Sent You a Item"
         } else {
          message = this.state.donorName + "Has Shown Interest in Donating the Item"
         }
         db.collection("all_notifications").doc(doc.id).update({
           "message" : message,
           "notification_status" : "unread",
           "date" : firebase.firestore.FieldValue.serverTimestamp()
         })
       })
     })
   }
   getAllDonations =()=>{
     this.requestRef = db.collection("all_donations").where("donor_id" ,'==', this.state.userId)
     .onSnapshot((snapshot)=>{
       var allDonations = snapshot.docs.map(document => document.data());
       this.setState({
         allDonations : allDonations,
       });
     })
   }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
       key={i}
       title={item.item_name}
       subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
       leftElement={<Icon name="item" type="font-awesome" color ='#696969'/>}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
           <TouchableOpacity style={styles.button} onPress={()=>{
             this.sendItem(item)
           }}>
             <Text style={{color:'#ffff'}}>Send Item</Text>
           </TouchableOpacity>
         }
       bottomDivider
     />
   )


   componentDidMount(){
     this.getDonorDetails(this.state.donorId)
     this.getAllDonations()
     this.getNumberOfUnreadNotifications();
   }

   componentWillUnmount(){
     this.requestRef();
   }

   getNumberOfUnreadNotifications=()=>{
    db.collection("all_notifications").where('notification_status','==','unread')
    .onSnapshot((snapshot)=>{
        var unreadNotifications = snapshot.docs.map((doc)=>{
            doc.data()
        })
        this.setState({
            value : unreadNotifications.length
        })
    })
}

BellIconWithBadge=()=>{
    return(
        <View>
        <Icon
        name = 'bell'
        type = 'font-awesome'
        color = '#696969'
        size = {25}
        onPress = {()=>{
            this.props.navigation.navigate('Notifications')
        }}
        />
        <Badge
        value = {this.state.value}
        containerStyle = {{position : 'absolute', top : -4, right : -4}}
        />
        </View>
    )
}

   render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Donations"/>
         <View style={{flex:1}}>
           {
             this.state.allDonations.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 20}}>List of all item Donations</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allDonations}
                 renderItem={this.renderItem}
               />
             )
           }
         </View>
       </View>
     )
   }
   }


const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})