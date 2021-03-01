import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View , Alert, FlatList, ListRenderItem } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import db from '../config'
import firebase from 'firebase'
import {ListItem} from 'react-native-elements'

export default class ExchangeScreen extends React.Component{
    constructor(){
        super();
        this.state={
            allRequests : []
        }
        this.requestRef=null
    }

    getExchangeItemsList=()=>{
        this.requestRef=db.collection("exchange_requests")
        .onSnapshot((snapshot)=>{
            var allRequests=snapshot.docs.map(document=>document.data())
            this.setState({
                allRequests : allRequests
            })
        })
    }

    componentDidMount(){
        this.getExchangeItemsList()
    }

    componentWillUnmount(){
        this.requestRef()
    }

    keyExtractor=(item,index)=>index.toString()
    renderItem=({item,i})=>{
        console.log(item.item_name)
        return(
            <ListItem
            key={i}
            title={item.item_name}
            subtitle={item.description}
            rightElement={
                <TouchableOpacity style={styles.button}>
                    <Text style={{color:'#ffff'}}>
                        Exchange
                    </Text>
                </TouchableOpacity>
            }
            bottomDivider
            />
        )
    }


    render(){
        return(
            <View style={{flex:1}}>
                <FlatList
                            keyExtractor={this.keyExtractor}
                            data={this.state.allRequests}
                            renderItem={this.renderItem}
                            />
            </View>
        )
    }
}

const styles = StyleSheet.create({
button:{ width:100, height:30, justifyContent:'center', alignItems:'center', backgroundColor:"#ff5722", shadowColor: "#000", shadowOffset: { width: 0, height: 8 } } 
})
