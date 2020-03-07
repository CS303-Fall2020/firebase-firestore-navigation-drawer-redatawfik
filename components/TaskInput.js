import React, {useState} from 'react';
import {Modal, View, StyleSheet, Button, TextInput} from 'react-native';

const TaskInput = props => {
  const [enteredTaskTitle, setEnteredTaskTitle] = useState();
  const [textInputBorderColor, setTextInputBorderColor] = useState('black');

  const addButtonHandler = () => {
    if (enteredTaskTitle === '') {
      setTextInputBorderColor('red');
    } else {
      props.addButtonPressed(enteredTaskTitle);
      onModalClose();
    }
  };

  const cancelButtonHandler = () => {
    props.cancelButtonPressed();
    onModalClose();
  };

  const onModalClose = () => {
    setEnteredTaskTitle('');
    setTextInputBorderColor('black');
  };

  const inputStyle = () => {
    return {
      borderColor: textInputBorderColor,
      width: '80%',
      borderWidth: 1,
      padding: 10,
      marginBottom: 10,
    };
  };

  return (
    <Modal visible={props.isAppear} animationType={'slide'}>
      <View style={styles.containerStyle}>
        <View>
          <TextInput
            value={enteredTaskTitle}
            style={inputStyle()}
            placeholder={'Add task title...'}
            onChangeText={text => setEnteredTaskTitle(text)}
          />
        </View>
        <View style={styles.addButtonStyle}>
          <Button title={'Add'} onPress={addButtonHandler} />
        </View>
        <View style={styles.addButtonStyle}>
          <Button title={'Cancel'} onPress={cancelButtonHandler} />
        </View>
      </View>
    </Modal>
  );
};

export default TaskInput;

const styles = StyleSheet.create({
  addButtonStyle: {
    width: '80%',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  containerStyle: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
