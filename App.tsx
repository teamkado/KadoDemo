import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Alert, Linking } from 'react-native';
import { WebView } from 'react-native-webview';

// Define the type for the props if needed (not used in this example)
interface Props {}

const App: React.FC<Props> = () => {
  const [webviewVisible, setWebviewVisibleVisible] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const WIDGET_ID = 'YOUR_WIDGET_ID'; // Replace with your widget ID

  const urls = [
    'https://sandbox--kado.netlify.app/',
    `https://sandbox--kado.netlify.app/?apiKey=${WIDGET_ID}&isMobileWebview=true`,
    `https://sandbox--kado.netlify.app/?apiKey=${WIDGET_ID}&onPayCurrency=USD&onPayAmount=15&onToAddress=0xC2e4a0E882eaaE993087954c59aC8031cF6bd19d&network=ETHEREUM&onRevCurrency=USDC`,
    `https://sandbox--kado.netlify.app/?apiKey=${WIDGET_ID}&isMobileWebview=true&onPayCurrency=USD&onPayAmount=15&onToAddress=0xC2e4a0E882eaaE993087954c59aC8031cF6bd19d&network=ETHEREUM&onRevCurrency=USDC&mode=minimal`,
  ];

  const titles = [
    'Basic Demo',
    'ACH Linking Demo',
    'Params Demo',
    'Post Message Demo',
  ];

  const handlePress = (index: number) => () => {
    if (urls[index]) {
      setCurrentUrl(urls[index]);
      setWebviewVisibleVisible(true);
    } else {
      Alert.alert('Error', 'Invalid URL');
    }
  };

  if(!!currentUrl && webviewVisible) {
    return (
      <>
        <WebView
          containerStyle={styles.modalContainer}
          onMessage={(event) => {
            const eventData = event?.nativeEvent?.data;
            try {
              const message = JSON.parse(eventData);
              console.log('Post Message Logs', message);
              if (message && message?.type === 'PLAID_NEW_ACH_LINK') {
                console.log('ACH Message Log', message);
                const achLink = message?.payload?.link;
                Linking.openURL(achLink);
              }
            } catch (error) {
              // Handle parsing errors gracefully
              console.error('Error parsing message:', error);
            }
          }}
          allowUniversalAccessFromFileURLs
          geolocationEnabled
          javaScriptEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          originWhitelist={['*']}
          source={{ uri: currentUrl || urls[0]}}
          allowsBackForwardNavigationGestures
          onError={(e) => {
            console.warn('error occured', e);
          }}
          style={styles.webview}
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setWebviewVisibleVisible(false)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.grid}>
        {titles.map((title, index) => (
          <TouchableOpacity
            key={index}
            style={styles.box}
            onPress={handlePress(index)}
          >
            <Text style={styles.text}>{title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Optional: background color for better visibility
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '90%', // Adjust width as needed
    maxWidth: 400, // Optional: Maximum width to control the grid size
  },
  box: {
    width: '45%', // Adjust width to control the size of the boxes
    aspectRatio: 1, // Ensures the height is the same as the width
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
    elevation: 3, // Optional: Adds shadow for Android
    shadowColor: '#000', // Optional: Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Optional: Shadow offset
    shadowOpacity: 0.2, // Optional: Shadow opacity
    shadowRadius: 4, // Optional: Shadow blur radius
  },
  text: {
    fontSize: 15,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    marginTop: Platform.OS === 'ios' ? 45 : 0, // Adjust for iOS safe area
  },
  webview: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 45 : 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    elevation: 3, // Optional: Adds shadow for Android
    shadowColor: '#000', // Optional: Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Optional: Shadow offset
    shadowOpacity: 0.2, // Optional: Shadow opacity
    shadowRadius: 4, // Optional: Shadow blur radius
  },
  closeButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default App;
