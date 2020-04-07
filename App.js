import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import {createDrawerNavigator} from '@react-navigation/drawer';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import {Image, TouchableOpacity, View} from 'react-native';
import Profile from './screens/Profile';
import {URI} from './constants';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = props => {
  const [token, setToken] = useState(props.token);
  const [user, setUser] = useState(props.user);

  const OpenDrawerIcon = () => {
    return (
      <TouchableOpacity onPress={props.navigation.toggleDrawer}>
        <Image
          style={{marginLeft: 10, width: 30, height: 30}}
          source={require('./open-menu.png')}
        />
      </TouchableOpacity>
    );
  };

  const SignOutIcon = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.signOut('');
          setToken('');
          setUser('');
        }}>
        <Image
          style={{marginRight: 10, width: 30, height: 30}}
          source={require('./logout.png')}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen
        name="TaskList"
        options={{
          headerRight: () => <SignOutIcon />,
          headerLeft: () => <OpenDrawerIcon />,
        }}>
        {props => (
          <TaskList
            {...props}
            token={token}
            user={user}
            onSignOut={props.signOut}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="TaskDetails"
        component={TaskInput}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default function App({navigation}) {
  const [token, setToken] = useState('');
  const [user, setUser] = useState('');

  async function getUser() {
    try {
      const response = await fetch(URI + '/users/getUser', {
        method: 'GET',
        headers: {
          Authorization: token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const userResponse = await response.json();
      setUser(userResponse.username);
      console.log('username is: ', user);
    } catch (e) {
      console.log(e);
    }
  }

  if (token.length > 1) {
    getUser();
  }

  const tokenChangeHandler = newToken => {
    setUser('');
    setToken(newToken);
  };

  return (
    <NavigationContainer>
      {token.length > 1 && user.length > 1 ? (
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home">
            {props => (
              <HomeStack
                {...props}
                token={token}
                user={user}
                signOut={tokenChangeHandler}
              />
            )}
          </Drawer.Screen>
          <Drawer.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Sign out">
            {() => {
              tokenChangeHandler('');
              return <View />;
            }}
          </Stack.Screen>
        </Drawer.Navigator>
      ) : (
        <Stack.Navigator initialRouteName={'Login'}>
          <Stack.Screen name="Login">
            {props => <Login {...props} onLogin={tokenChangeHandler} />}
          </Stack.Screen>
          <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
