import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Button, FlatList} from 'react-native';
import TaskItem from './TaskItem';
import AsyncStorage from '@react-native-community/async-storage';

function TaskList({navigation}) {
  const [tasks, setTasks] = useState([]);
  const [removedTasks, setRemovedTasks] = useState([]);

  const token =
    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJyZWRhIiwiZXhwIjoxNTg1MTk0MjUzfQ.uBVhch42IBOT4vHMp3GVKajE36iCaWjhyQfrtucU3hhrZtpXN26jbVF_WFPJsk67FAZS9dlYXRME54GMH-nrvw';
  useEffect(() => {
    getTasksFromLocalStorage();
  }, []);

  useEffect(() => {
    storeTasksInLocalStorage();
  }, [tasks]);

  useEffect(() => {
    getDeletedTasksFromLocalStorage();
  }, []);

  useEffect(() => {
    storeDeleteTasksInLocalStorage();
  }, [removedTasks]);

  //Store data in local storage.
  const storeTasksInLocalStorage = async () => {
    try {
      removeItemValue('tasks_key');
      await AsyncStorage.setItem('tasks_key', JSON.stringify(tasks));
    } catch (e) {
      console.log(e);
    }
  };

  //get data from local storage.
  const getTasksFromLocalStorage = async () => {
    try {
      const value = await AsyncStorage.getItem('tasks_key');
      if (value !== null) {
        setTasks(JSON.parse(value));
      }
    } catch (e) {
      console.log(e);
    }
  };

  //Store data in local storage.
  const storeDeleteTasksInLocalStorage = async () => {
    try {
      removeItemValue('deleted_tasks');
      await AsyncStorage.setItem('deleted_tasks', JSON.stringify(removedTasks));
      //getDeletedTasksFromLocalStorage();
    } catch (e) {
      console.log(e);
    }
  };

  //get data from local storage.
  const getDeletedTasksFromLocalStorage = async () => {
    try {
      const value = await AsyncStorage.getItem('deleted_tasks');
      if (value !== null) {
        setRemovedTasks(JSON.parse(value));
        console.log('deleted tasks from local storage: ' + JSON.parse(value));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const removeItemValue = async key => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (exception) {
      return false;
    }
  };

  async function getTasksFromApiAsync() {
    try {
      const response = await fetch('http://192.168.1.7:8080/tasks', {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      });
      const tasksResponse = await response.json();
      setTasks(tasksResponse);
    } catch (e) {
      console.log(e);
    }
  }

  async function removeTasksFromApi() {
    try {
      const response = await fetch('http://192.168.1.7:8080/delete', {
        method: 'POST',
        headers: {
          Authorization: token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(removedTasks),
      });
    } catch (e) {
      console.log(e);
    }
  }
  async function postTasksToApiAsync() {
    try {
      const response = await fetch('http://192.168.1.7:8080/tasks', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tasks),
      });
    } catch (e) {
      console.log(e);
    }
    removeTasksFromApi();
    getTasksFromApiAsync();
  }

  const addTaskHandler = newTask => {
    setTasks(currentTasks => [
      ...currentTasks,
      {id: newTask.id, title: newTask.title, done: false},
    ]);
  };

  const editTaskHandler = newTask => {
    let newArr = [...tasks];
    for (var i in newArr) {
      if (newArr[i].id === newTask.id) {
        newArr[i].title = newTask.title;
        newArr[i].done = newTask.done;
        break;
      }
    }
    setTasks(newArr);
  };

  const deleteItemHandler = id => {
    setRemovedTasks(current => [...current, {id: id}]);

    setTasks(currentTasks => {
      return currentTasks.filter(task => task.id !== id);
    });
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

  const syncButtonHandler = () => {
    postTasksToApiAsync();
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
        <Button title={'Sync data...'} onPress={syncButtonHandler} />
      </View>
      <FlatList
        data={tasks}
        renderItem={({item}) => (
          <TaskItem
            id={item.id}
            title={item.title}
            done={item.done}
            onClickItem={clickItemHandler}
            onStateChange={editTaskHandler}
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
