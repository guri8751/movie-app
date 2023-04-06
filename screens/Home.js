import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, TextInput, Button } from 'react-native';
import { Icon } from 'react-native-elements'
import {REACT_APP_API_KEY} from "@env"

export default function Home({navigation}) {
	
	const [batmanMoviesJson, setBatmanMoviesJson] = useState([]);
	const [supermanMoviesJson, setSupermanMoviesJson] = useState([]);
	const [marvelMoviesJson, setMarvelMoviesJson] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchActivated, setSearchActivated] = useState(false);
	const [searchInputText, setSearchInputText] = useState();
	const [searchedMovieJson, setSearchedMovieJson] = useState([]);
	const [error, setError] = useState(false);
	

	useEffect(() => {
		Promise.all([
			fetch(`http://www.omdbapi.com/?s=batman&apikey=${REACT_APP_API_KEY}`),
			fetch(`http://www.omdbapi.com/?s=marvel&apikey=${REACT_APP_API_KEY}`),
			fetch(`http://www.omdbapi.com/?s=superman&apikey=${REACT_APP_API_KEY}`),
		])
		.then(([firstResponse, secondResponse, thirdResponse]) => 
				Promise.all([firstResponse.json(), secondResponse.json(), thirdResponse.json()])
			)
			.then(([firstJson, secondJson, thirdResponse]) => {
				setBatmanMoviesJson(firstJson["Search"]);
				setMarvelMoviesJson(secondJson["Search"]);
				setSupermanMoviesJson(thirdResponse["Search"]);
				setLoading(false);
			});
	}, [])

	//Fetching movies from the keyword in the search bar
	fetchSearchedMovie = () => {
		setError(false);
		fetch(`http://www.omdbapi.com/?s=${searchInputText}&apikey=${REACT_APP_API_KEY}`)
		.then(response => response.json())
		.then(json => {
			setSearchedMovieJson(json["Search"])
		})
	}

	//When the search bar is closed, execute the following commands
	closeSearch = () => {
		setSearchActivated(false);
		setSearchInputText(null);
		setSearchedMovieJson([]);
	}

	//While we fetch the data from API, render null
	if(loading){
		return null;
	}
	//As soon as we get the data from the API, render the movies
	else{
		const viewMovieList = (moviesArray) => {
			if(moviesArray == undefined){
				setError(true);
				return;
			}
			return(moviesArray.map((item, key) => {
				return(
				<TouchableOpacity onPress={() => {
					navigation.navigate('Movie', {
						itemPassed: item
					})
				}} style={styles.movie} key={key}>
					<View>
					<Image source={{uri: item["Poster"]}} style={{width: 150, height: 150, borderRadius:10}}/>
					<Text style={styles.movieTitle}>{item["Title"]}</Text>
					<Text style={styles.movieTitle}>{item["Year"]}</Text>
					</View>
				</TouchableOpacity>)
					
			}))
			
		} 
		return (
			<ScrollView style={styles.container}>
				<View style={styles.innerContainer}>
				<View style={styles.topContainer}>
					<Image source={require('../assets/profile.png')} style={styles.profileImage}/>
					<View>
						<Text style={{color: "#fff"}}>Hello <Text style={{fontWeight:800}}>User</Text></Text>
						<Text style={{color: "#F5F5F5", opacity:0.5}}>Enjoy your favourite movies</Text>
					</View>
					
				</View>	
				<View style={styles.searchContainer}>
					{searchActivated && <View style={styles.backButtonContainer}>
						<Icon name='arrow-back' color="#fff" onPress={closeSearch}/>
					</View> }
					<TextInput 
						style={styles.input}
						autoCapitalize='none'
						placeholder='Search movies...'
						placeholderTextColor="white" 
						value={searchInputText}
						onChangeText={(text) => {
							setSearchActivated(true);
							setSearchInputText(text);
						}}
					/>
				</View>
				
				{(searchActivated) && <>
					<TouchableOpacity style={styles.searchButtonContainer} onPress={fetchSearchedMovie}>
						<Text style={styles.Text}>Search</Text>
					</TouchableOpacity>
					{!error ? <View style={styles.searchView}> 
							{viewMovieList(searchedMovieJson)}
					</View> : <Text style={styles.errorText}>Sorry, we couldn't find the movie you're searching for</Text>}
				</>}

				{!searchActivated && <>
					<Text style={styles.title}>Popular Movies</Text>
					<View style={styles.searchView}>
						{viewMovieList(batmanMoviesJson)}
					</View>
				</>}
				</View>

				{!searchActivated && <TouchableOpacity  style={styles.playButton} onPress={() => {
					setBatmanMoviesJson([...batmanMoviesJson, ...supermanMoviesJson])
				}}>
					<Text style={styles.playText}>Load more</Text>
				</TouchableOpacity>}
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
  container: {
		height:"100%",
    backgroundColor: '#000',
  },
	innerContainer: {
		marginTop: 25
	},
	movieTitle:{
		color: "#fff",
		marginTop:5,
		maxWidth: 150,
		fontWeight: 600
	},
	title:{
		fontSize:25,
		fontWeight: 600,
		color: "#fff",
		margin:15
	},
	movie:{
		margin:10,
	},
	topContainer:{
		flexDirection: 'row',
    alignItems: 'center',
		alignSelf:"left"
	},
	profileImage:{
		width: 50, 
		height: 50,
		margin: 15,
	},
	Text:{
		color: "#fff",
		fontSize: 20
	},
	input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
		borderColor: "#fff",
		borderRadius: 10,
		color: "#fff"
  },
	searchView:{
		flex: 1,
		flexDirection: 'row',
    justifyContent: "space-evenly", 
    flexWrap: 'wrap',
		marginTop: 10
	},
	backButtonContainer:{
		backgroundColor: "#2a363b",
		borderRadius: "50%",
		padding: 10,
		alignSelf: "flex-start"
	},
	searchButtonContainer:{
		backgroundColor: "#2a363b",
		borderRadius: 10,
		padding: 10,
		fon: "#fff",
		alignSelf: 'center',
	},
	playButton:{
		backgroundColor: "red",
		borderRadius: 20,
		margin:20
	},
	playText:{
		fontSize: 20,
		color: "#fff",
		alignSelf: 'center',
		padding: 10,
		fontWeight:600	
	},
	errorText: {
		color: "#fff",
		fontSize: 18,
		marginTop:10,
		alignSelf:"center"
	}
});
