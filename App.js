import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import Home from './screens/Home';
import Main from './screens/Main';

export default function App() {
	return(
		<Main />
	)
  
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
		margin:60
  },
	movie:{
		margin:10,
	},
	Text:{
		color: "black",
		fontSize: 20
	}
});




