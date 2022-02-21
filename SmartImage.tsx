import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const API_KEY = 'AIzaSyAXnBqYX-PwLD2sX2R5YkfP67vMxA1R-pw';
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

async function callGoogleVisionAsync(image: any) {
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

export default function SmartImage() {

    type State = {
        label : string|null,
        text : string|null
    };
  const [image, setImage] = useState<string|null>(null);
  const [permissions, setPermissions] = useState<boolean>(false);
  const [status, setStatus] = useState<State>({label: null, text: null});


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
    setStatus({label: null, text: null});
    const { cancelled, uri, base64 } = await ImagePicker.launchCameraAsync({
      base64: true,
    });

    if (!cancelled) {
      setImage(uri);
      setStatus({label: 'Loading...', text: null});
      
      try {
        const result = await callGoogleVisionAsync(base64);
        setStatus({label: result.label, text: result.text});
      } catch (error: unknown) {
        setStatus({label: `Error: ${(error instanceof Error?error.message:error)}`, text: null});
      }
    } else {
      setImage(null);
      setStatus({label:null, text:null});
    }
  };




  const launchImageLibraryAsync = async () => {
    setStatus({label:null, text:null});
    const { cancelled, uri, base64 } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        aspect: [1, 1],
        quality: 1,
    });

    if (!cancelled) {
      setImage(uri);
      setStatus({label:'Loading...', text:null});
      try {
        const result = await callGoogleVisionAsync(base64);
        setStatus({label:result.label, text:result.text});
      } catch (error: unknown) {
        setStatus({label:`Error: ${(error instanceof Error?error.message:error)}`, text:null});
      }
    } else {
      setImage(null);
      setStatus({label:null, text:null});
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
          {status.label && <Text style={styles.boldtext}>{status.label}</Text>}
          {status.text && 
            
            <ScrollView style ={styles.scrollView}>
                <Text style={styles.text}>{status.text}</Text>
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
    marginTop: 50,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: "#0dd4db",
    borderRadius: 30,
    //backgroundColor: "#61dafb",
    color: "#0dd4db",
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    justifyContent: 'center',
    
  },
  scrollView: {
    flex: 1,
    //backgroundColor: 'lightgray',
    marginHorizontal: 20,
    
  },
});