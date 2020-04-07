import React, {useState} from 'react';
import {
  Button,
  Container,
  Form,
  Input,
  Item,
  Label,
  Spinner,
} from 'native-base';
import {
  StyleSheet,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {URI} from '../constants';

const Login = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const clear = () => {
    setEmail('');
    setPassword('');
  };

  const signUpUser = () => {
    props.navigation.navigate('SignUp');
    clear();
  };

  const loginUser = () => {
    setLoading(true);
    fetch(URI + '/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    })
      .then(response => {
        setLoading(false);
        if (response.status === 200) {
          clear();
          props.onLogin(response.headers.map.authorization);
        } else {
          Alert.alert('Error', 'SOMETHING WENT WRONG');
        }
      })
      .catch(error => {
        console.log(error.message + '         =====   ');
        setLoading(false);
        Alert.alert('Error', error.message);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container style={styles.container}>
        <Form>
          {loading ? <Spinner /> : null}
          <Item floatingLabel>
            <Label>Email</Label>
            <Input
              value={email}
              autocorrect={false}
              autoCapitalize="none"
              onChangeText={e => setEmail(e)}
            />
          </Item>

          <Item floatingLabel>
            <Label>Password</Label>
            <Input
              value={password}
              secureTextEntry
              autocorrect={false}
              autoCapitalize="none"
              onChangeText={p => setPassword(p)}
            />
          </Item>

          <Button
            style={{marginTop: 10}}
            full
            rounded
            success
            onPress={loginUser}>
            <Text style={{color: 'white'}}>Login</Text>
          </Button>

          <Button
            style={{marginTop: 20}}
            full
            rounded
            primary
            onPress={signUpUser}>
            <Text style={{color: 'white'}}>Sign up</Text>
          </Button>
        </Form>
      </Container>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10,
  },
});

export default Login;
