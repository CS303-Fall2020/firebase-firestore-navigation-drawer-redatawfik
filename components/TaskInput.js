import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Input, Item, Label, Button} from 'native-base';

const TaskInput = ({navigation, route}) => {
  const [enteredTaskTitle, setEnteredTaskTitle] = useState(route.params.title);
  const [deleteButtonVisible, setDeleteButtonVisible] = useState(
    route.params.isDeleteButtonVisible,
  );

  const addButtonHandler = () => {
    const addHandler = route.params.addButtonPressed;

    if (route.params.id === -1) {
      addHandler({
        id: Math.floor(Math.random() * 10000) + 1,
        title: enteredTaskTitle,
      });
    } else {
      addHandler({
        id: route.params.id,
        title: enteredTaskTitle,
      });
    }

    closeScreen();
  };

  const closeScreen = () => {
    navigation.goBack();
  };

  const deleteTask = () => {
    const deleteFunc = route.params.deleteButtonPressed;
    deleteFunc(route.params.id);
    navigation.goBack();
  };

  return (
    <View style={styles.containerStyle}>
      <Item floatingLabel>
        <Label>Enter task title...</Label>
        <Input
          value={enteredTaskTitle}
          autocorrect={false}
          autoCapitalize="none"
          onChangeText={text => setEnteredTaskTitle(text)}
        />
      </Item>
      <Button
        style={{marginTop: 10}}
        full
        rounded
        primary
        onPress={addButtonHandler}>
        <Text style={{color: 'white'}}>Save</Text>
      </Button>

      <Button
        style={{marginTop: 10}}
        full
        rounded
        warning
        onPress={closeScreen}>
        <Text style={{color: 'white'}}>Cancel</Text>
      </Button>

      {deleteButtonVisible ? (
        <Button
          style={{marginTop: 10}}
          full
          rounded
          danger
          onPress={deleteTask}>
          <Text style={{color: 'white'}}>Delete</Text>
        </Button>
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
