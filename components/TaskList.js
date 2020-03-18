import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Button,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import TaskItem from './TaskItem';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';

function TaskList({navigation}) {
  const [tasks, setTasks] = useState([]);
  const [removedTasks, setRemovedTasks] = useState([]);
  const [loadingBarVisible, setLoadingBarVisible] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const token =
    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJyZWRhdGF3ZmlrIiwiZXhwIjoxNTg1MzM5OTAzfQ.LUDZY-nQnA7OkqMsT0XGULAjOkcsuH7SO5i0Hcgv7pQkdSoFSwvBkY5UqIIVJL45OS0qdtOIInSh9rWIyQj4QA';
  const uri = 'http://todo-env-1.eba-e7hpambk.us-east-1.elasticbeanstalk.com';

  useEffect(() => {
    getTasksFromLocalStorage();
    getDeletedTasksFromLocalStorage();
    checkConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    storeTasksInLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  useEffect(() => {
    storeDeleteTasksInLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removedTasks]);

  const checkConnection = () => {
    NetInfo.fetch().then(state => {
      setIsOnline(state.isConnected);
    });
  };

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
        console.log(tasks);
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
      const response = await fetch(uri + '/tasks/get', {
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
    setLoadingBarVisible(false);
  }

  async function removeTasksFromApi() {
    await fetch(uri + '/tasks/delete', {
      method: 'POST',
      headers: {
        Authorization: token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(removedTasks),
    }).catch(e => {
      console.log(e);
    });
  }
  async function postTasksToApiAsync() {
    try {
      const response = await fetch(uri + '/tasks/add', {
        method: 'POST',
        headers: {
          Authorization: token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tasks),
      });
    } catch (e) {
      console.log(e);
    }
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
    checkConnection();
    if (isOnline) {
      setLoadingBarVisible(true);
      postTasksToApiAsync();
      setTimeout(removeTasksFromApi, 1000);
      setTimeout(getTasksFromApiAsync, 2000);
    }
  };

  const openAddScreenHandler = () => {
    navigation.navigate('TaskDetails', {
      addButtonPressed: addTaskHandler,
      id: -1,
    });
  };

  return (
    <View style={styles.screen}>
      {!isOnline ? (
        <View style={{backgroundColor: 'yellow', alignContent: 'center'}}>
          <Text style={{alignSelf: 'center'}}> 'offline'</Text>
        </View>
      ) : null}
      {loadingBarVisible ? (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : null}
      <View style={styles.buttonStyle}>
        <Button title={'Add new task'} onPress={openAddScreenHandler} />
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
            onDeleteClick={deleteItemHandler}
          />
        )}
        keyExtractor={item => item.id}
      />
      <View style={{padding: 10}}>
        <Button title={'Sync data...'} onPress={syncButtonHandler} />
      </View>
    </View>
  );
}
export default TaskList;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
  buttonStyle: {
    padding: 10,
  },
  noConnected: {
    marginBottom: 10,
    textDecorationLine: 'underline',
    color: 'blue',
    fontWeight: 'bold',
    backgroundColor: 'yellow',
  },
});
