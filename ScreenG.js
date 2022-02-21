import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const API_KEY = 'AIzaSyAXnBqYX-PwLD2sX2R5YkfP67vMxA1R-pw';
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

async function callGoogleVisionAsync(image) {
  const body = {
    requests: [
      {
        image: {
          content: image,
        },
        features: [
          {
            type: 'LABEL_DETECTION', 
            maxResults: 1,
          },
          {
            type: 'TEXT_DETECTION', 
            maxResults: 1,
          },
        ],
      },
    ],
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  console.log('callGoogleVisionAsync -> result', result);

  var txt 
  try{
    txt = result.responses[0].textAnnotations[0].description;
  }
  catch(e){
      txt = null;
  }
  return {label: result.responses[0].labelAnnotations[0].description,
    text: txt};
}

export default function ScreenG() {
  const [image, setImage] = React.useState(null);
  const [statusL, setStatusL] = React.useState(null);
  const [statusT, setStatusT] = React.useState(null);
  const [permissions, setPermissions] = React.useState(false);

  
  const setStatus = (l, t) => {
    setStatusL(l);
    setStatusT(t);
}


  const askPermissionsAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    } else {
      setPermissions(true);
    }
  };

  const takePictureAsync = async () => {
    setStatus(null, null);
    const { cancelled, uri, base64 } = await ImagePicker.launchCameraAsync({
      base64: true,
    });

    if (!cancelled) {
      setImage(uri);
      setStatus('Loading...', null);
      
      try {
        const result = await callGoogleVisionAsync(base64);
        setStatus(result.label, result.text);
      } catch (error) {
        setStatus(`Error: ${error.message}`, null);
      }
    } else {
      setImage(null);
      setStatus(null, null);
    }
  };




  const launchImageLibraryAsync = async () => {
    setStatus(null);
    const { cancelled, uri, base64 } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        aspect: [1, 1],
        quality: 1,
    });

    if (!cancelled) {
      setImage(uri);
      setStatus('Loading...', null);
      try {
        const result = await callGoogleVisionAsync(base64);
        setStatus(result.label, result.text);
      } catch (error) {
        setStatus(`Error: ${error.message}`, null);
      }
    } else {
      setImage(null);
      setStatus(null, null);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>CORAL </Text>
      {permissions === false ? (
        <Button onPress={askPermissionsAsync} title="Ask permissions" />
      ) : (
        <>
          {image && <Image style={styles.image} source={{ uri: image }} />}
          {statusL && <Text style={styles.boldtext}>{statusL}</Text>}
          {statusT && 
            
            <ScrollView style ={styles.scrollView}>
                <Text style={styles.text}>{statusT}</Text>
            </ScrollView>
            
           }
          <Button onPress={takePictureAsync} title="Take a Picture" />
          <Button onPress={launchImageLibraryAsync} title="Load from Library" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 25,
  },
  text: {
    margin: 5,
    color: "#0dd4db",
  },
  boldtext: {
    margin: 5,
    color: "#0dd4db",
    fontWeight: "bold",

  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: "#0dd4db",
    borderRadius: 30,
    //backgroundColor: "#61dafb",
    color: "#0dd4db",
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    
  },
  scrollView: {
    flex: 1,
    //backgroundColor: 'lightgray',
    marginHorizontal: 20,
    
  },
});