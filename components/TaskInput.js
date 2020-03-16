import React, {useState} from 'react';
import {View, StyleSheet, Button, TextInput, Modal} from 'react-native';

const TaskInput = props => {
  const [enteredTaskTitle, setEnteredTaskTitle] = useState(
    props.navigation.getParam('title'),
  );
  const [textInputBorderColor, setTextInputBorderColor] = useState('black');
  const [deleteButtonVisible, setDeleteButtonVisible] = useState(
    props.navigation.getParam('isDeleteButtonVisible'),
  );

  const addButtonHandler = () => {
    if (enteredTaskTitle) {
      const addHandler = props.navigation.getParam('addButtonPressed');

      if (props.navigation.getParam('id') === -1) {
        addHandler({
          id: Math.floor(Math.random() * 10000) + 1,
          title: enteredTaskTitle,
        });
      } else {
        addHandler({
          id: props.navigation.getParam('id'),
          title: enteredTaskTitle,
        });
      }

      closeScreen();
    } else {
      setTextInputBorderColor('red');
    }
  };

  const closeScreen = () => {
    props.navigation.goBack();
  };

  const deleteTask = () => {
    const deleteFunc = props.navigation.getParam('deleteButtonPressed');
    deleteFunc(props.navigation.getParam('id'));
    props.navigation.goBack();
  };

  const inputStyle = () => {
    return {
      borderColor: textInputBorderColor,
      width: 300,
      borderWidth: 1,
      padding: 10,
      marginBottom: 10,
    };
  };

  return (
    <View style={styles.containerStyle}>
      <View>
        <TextInput
          multiline
          value={enteredTaskTitle}
          style={inputStyle()}
          placeholder={'Add task title...'}
          onChangeText={text => setEnteredTaskTitle(text)}
        />
      </View>
      <View style={styles.addButtonStyle}>
        <Button title={'Save'} onPress={addButtonHandler} />
      </View>
      <View style={styles.addButtonStyle}>
        <Button title={'Cancel'} onPress={closeScreen} />
      </View>
      {deleteButtonVisible ? (
        <View style={styles.addButtonStyle}>
          <Button title={'Delete'} onPress={deleteTask} />
        </View>
      ) : null}
    </View>
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
