
import React, { useState, useEffect , useRef } from 'react';
import { StyleSheet, View, Button, Image, Text } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { SetStateAction } from 'react';

export default function Screen() {

    const [cameraPermission, setCameraPermission] = useState(true);
    const [galleryPermission, setGalleryPermission] = useState(true);
  
    const [camera, setCamera]  = useState<Camera|null>(null);
    const [imageUri, setImageUri] = useState('');
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [text, setText] = useState<string>('');

    const[response, setResponse] = useState(null);

    const [image, setImage] = useState<string>('');

    const imgRef = useRef(null);
  
    const permisionFunction = async () => {
        // here is how you can get the camera permission
        //const cameraPermission = await Camera.requestCameraPermissionsAsync();
    
        //setCameraPermission(cameraPermission.status === 'granted');
    
        /*setCameraPermission(true);
    
    
        const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
        console.log(imagePermission.status);
    
        setGalleryPermission(imagePermission.status === 'granted');
    
        if (
          imagePermission?.status !== 'granted' //&&
          //cameraPermission?.status !== 'granted'
        ) {
          alert('Permission for media access needed.');
        } */
      };

      useEffect(() => {
        permisionFunction();
      }, []);

      




      const onOCR = () => {

        ////////////////////////////////////////////////
        // GET IMAGE DATA
        ///////////////////////////////////////////////
        const RNFS = require("react-native-fs");
        // response.uri from react-native-camera
        RNFS.readFile(imageUri, "base64").then((data: string) => {
            // binary data
            data = 'data:image/png;base64,' + data;
            console.log(data);
            setImage(data);

        });

        ////////////////////////////////////////////////
        // POST JSON
        ///////////////////////////////////////////////
        //var dataToSend : { [key: string]: string }= { 
        //    base64image : image,
        //    apikey: 'K81776802388957'

                             
        //};

        //making data to send on server
         /*var formBody = [];
       for (var key in dataToSend) {
          var encodedKey = encodeURIComponent(key);
          var s: string = dataToSend[key]??'';
          var encodedValue = encodeURIComponent(s);
          formBody.push(encodedKey + '=' + encodedValue);
        }*/
        //formBody = formBody.join('&');

        //var formBody: string = encodeURIComponent('apikey') + "='K81776802388957'&base64image=" //+ image;
        //formBody.join('&')

        var formBody =  image;
        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';
        const formData = new FormData();

        formData.append('base64image', formBody);
        
        //console.log('formBody', formBody);
        
        
        //POST request
        fetch('https://api.ocr.space/Parse/Image', {
          method: 'POST', //Request Type
          body: formData, //post body
          headers: {
            //Header Defination
            //'Content-Type': 'image/png',
            'apikey':'K81776802388957'
          },
        })
          .then((response) => response.json())
          //If response is in json then in success
          .then((responseJson) => {
           // alert(JSON.stringify(responseJson));
            console.log('response', responseJson);
            console.log('response1', responseJson.ParsedResults);
            console.log('response2', responseJson.ParsedResults[0].ParsedText);
            
            //setText(JSON.stringify(responseJson));
            //var data = JSON.parse(responseJson);
            //setText(data.ParsedResults.ParsedText);
            setText(JSON.stringify(responseJson.ParsedResults[0].ParsedText.replace(/(\r\n|\n|\r)/gm, "")));
            //setResponse(responseJson)
          })
          //If response is not in json then in error
          .catch((error) => {
           // alert(JSON.stringify(error));
            console.error(error);
          });
      };







      const takePicture = async () => {
        if (camera) {
          const data = await camera.takePictureAsync(undefined);
          //console.log(data.uri);
          setImageUri(data.uri);
    
        }
        setText("");
      };

      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
        //console.log(result);
        if (!result.cancelled) {
          setImageUri(result.uri);
        }
        setText("");
      };
    
      

      return (
        <View style={styles.container}>
 
          <View style={styles.cameraContainer}>
            <Camera
              ref={(ref) => setCamera(ref)}
              style={styles.fixedRatio}
              type={type}
              ratio='1:1'
            />
          </View>
    
          <View style={styles.meow}>
            <Button  title={'Take Picture'} onPress={takePicture} />
            <Button  title={'Gallery'} onPress={pickImage} />
           
          </View>
          {(imageUri!='') && 
            <Image source={{ uri: imageUri }} style={styles.cameraContainer} ref={imgRef}/>
          }
          
    
          <View style={styles.meow}>
            <Button  onPress={onOCR} title={'OCR'}/> 
            <Text>{text}</Text>


          </View>
          
          
     
    
        </View>
      );
}

const styles = StyleSheet.create({
    meow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    mew: {
      flex: 0.5,
      width: '30%',
  
    },
  
    container: {
      flex: 0.5,
      padding: 10,
    },
    cameraContainer: {
      //flex: 0.3,
      aspectRatio: 1,
      flexDirection: 'row',
      width: 'auto',
      borderWidth: 4,
      borderColor: "#61DBFB",
      borderRadius: 6,
  
      
    },
    fixedRatio: {
      flex: 1,
      aspectRatio: 1,
  
    },
    button: {
      flex: 0.1,
      padding: 10,
      alignSelf: 'flex-end',
      alignItems: 'center',
      backgroundColor: "#fffde7",
      color: "#61DBFB",
      borderColor: "#61DBFB",
  
    },
    title: {
      borderWidth: 4,
      borderColor: "#61DBFB",
      borderRadius: 6,
      backgroundColor: "#fffde7",
      color: "#61DBFB",
      textAlign: "center",
      fontSize: 17,
      fontWeight: "bold"
    },
  });