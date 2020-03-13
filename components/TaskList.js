import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Button, FlatList} from 'react-native';
import TaskItem from './TaskItem';
import AsyncStorage from '@react-native-community/async-storage';

function TaskList({navigation}) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const storeData = async () => {
    try {
      await AsyncStorage.clear();
      await AsyncStorage.setItem('tasks_key', JSON.stringify(tasks));
      console.log(JSON.stringify(tasks));
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async () => {
    console.log('inside getData()');
    try {
      const value = await AsyncStorage.getItem('tasks_key');
      if (value !== null) {
        console.log(JSON.parse(value));
        setTasks(JSON.parse(value));
      }
    } catch (e) {
      console.log(e);
    }
  };
  async function getTasksFromApiAsync() {
    try {
      const response = await fetch('http://192.168.43.2:8080/tasks');
      const tasksResponse = await response.json();
      setTasks(tasksResponse);
      storeData();
      console.log(tasksResponse);
    } catch (e) {
      console.log(e);
    }
  }

  async function postTasksToApiAsync() {
    try {
      const response = await fetch('http://192.168.43.2:8080/tasks', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tasks),
      });
      console.log(response);
    } catch (e) {
      console.log('in errorrrrrrrrrrrrrrrr');
      console.log(e);
    }
  }

  const addTaskHandler = newTask => {
    setTasks(currentTasks => [
      ...currentTasks,
      {id: newTask.id, title: newTask.title},
    ]);
    storeData();
  };

  const editTaskHandler = newTask => {
    let newArr = [...tasks];
    for (var i in newArr) {
      if (newArr[i].id === newTask.id) {
        newArr[i].title = newTask.title;
        break;
      }
    }
    setTasks(newArr);
    storeData();
  };

  const deleteItemHandler = id => {
    setTasks(currentTasks => {
      return currentTasks.filter(task => task.id !== id);
    });
    storeData();
  };

  const clickItemHandler = tempTask => {
    navigation.navigate('TaskDetails', {
      addButtonPressed: editTaskHandler,
      deleteButtonPressed: deleteItemHandler,
      isDeleteButtonVisible: true,
      title: tempTask.title,
      id: tempTask.id,
    });
  };

  const getButtonHandler = () => {
    getTasksFromApiAsync();
  };

  const postButtonHandler = () => {
    postTasksToApiAsync();
  };

  const clearButtonHandler = () => {
    setTasks([]);
  };

  const openAddScreenHandler = () => {
    navigation.navigate('TaskDetails', {
      addButtonPressed: addTaskHandler,
      id: -1,
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.buttonStyle}>
        <Button title={'Add new task'} onPress={openAddScreenHandler} />
      </View>
      <View style={styles.buttonStyle}>
        <Button title={'Get data...'} onPress={getButtonHandler} />
      </View>
      <View style={styles.buttonStyle}>
        <Button title={'Post data...'} onPress={postButtonHandler} />
      </View>
      <View style={styles.buttonStyle}>
        <Button title={'Clear data...'} onPress={clearButtonHandler} />
      </View>
      <FlatList
        data={tasks}
        renderItem={({item}) => (
          <TaskItem
            id={item.id.toString()}
            title={item.title}
            onClickItem={clickItemHandler}
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}
export default TaskList;

const styles = StyleSheet.create({
  screen: {
    padding: 10,
  },
  buttonStyle: {
    padding: 10,
  },
});
