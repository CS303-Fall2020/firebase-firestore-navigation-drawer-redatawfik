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
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {URI} from '../constants';

function SignUp({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateDate = () => {
    if (email.length === 0) {
      Alert.alert('Error', 'Please enter email');
      return 1;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return 1;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Passwords must be at least 8 characters');
      return 1;
    }

    return 0;
  };

  const signUpUser = () => {
    if (validateDate() === 1) {
      return;
    }

    setLoading(true);

    fetch(URI + '/users/sign-up', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password,
        confirmPassword: confirmPassword,
      }),
    })
      .then(response => {
        setLoading(false);
        if (response.status === 200) {
          navigation.navigate('Login');
        } else {
          console.log(response);
          Alert.alert('Error', 'SOMETHING WENT WRONG');
        }
      })
      .catch(error => {
        console.error(error);
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
              autocorrect={false}
              autoCapitalize="none"
              onChangeText={e => setEmail(e)}
            />
          </Item>

          <Item floatingLabel>
            <Label>Password</Label>
            <Input
              secureTextEntry
              autocorrect={false}
              autoCapitalize="none"
              onChangeText={p => setPassword(p)}
            />
          </Item>

          <Item floatingLabel>
            <Label>Confirm Password</Label>
            <Input
              secureTextEntry
              autocorrect={false}
              autoCapitalize="none"
              onChangeText={p => setConfirmPassword(p)}
            />
          </Item>

          <Button
            style={{marginTop: 10}}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10,
  },
});

export default SignUp;
