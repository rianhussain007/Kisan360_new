import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import FirebaseTestScreen from '../screens/FirebaseTestScreen';
import DiseaseDetectionScreen from '../screens/DiseaseDetectionScreen';

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="FirebaseTest">
      <Stack.Screen
        name="FirebaseTest"
        component={FirebaseTestScreen}
        options={{ title: 'Firebase Connection Test' }}
      />
      <Stack.Screen
        name="DiseaseDetection"
        component={DiseaseDetectionScreen}
        options={{ title: 'Disease Detection' }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
