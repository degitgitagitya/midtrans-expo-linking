import * as React from 'react';
import * as Linking from 'expo-linking';

import usePaymentGateway from './hooks/usePaymentGateway';

import { View, Text, StyleSheet, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function PaymentScreen({ navigation }) {
  const { handleOpenBrowser } = usePaymentGateway();

  React.useEffect(() => {
    handleOpenBrowser(
      'https://app.sandbox.midtrans.com/snap/v2/vtweb/2f8a08bf-aca1-4cbd-893d-66863778cbb3'
    );
  }, [handleOpenBrowser]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title='Continue to Payment'
        onPress={() => {
          handleOpenBrowser(
            'https://app.sandbox.midtrans.com/snap/v2/vtweb/2f8a08bf-aca1-4cbd-893d-66863778cbb3'
          );
        }}
      />
      <Button
        title='Back to App'
        onPress={() => {
          navigation.navigate('Home');
        }}
      />
    </View>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title='Go to Profile'
        onPress={() => {
          navigation.navigate('Payment');
        }}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

const prefix = Linking.createURL('/');

function App() {
  const linking = {
    prefixes: [prefix],
  };

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Payment' component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
