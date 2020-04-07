import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import {Container, Content, Button} from 'native-base';

import TaskItem from './TaskItem';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {URI} from '../constants';

const TaskList = props => {
  const [tasks, setTasks] = useState([]);
  const [removedTasks, setRemovedTasks] = useState([]);
  const [loadingBarVisible, setLoadingBarVisible] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const {token} = props;
  const {user} = props;
  console.log('Tasklist: user in tasklist is', user);

  useEffect(() => {
    getTasksFromLocalStorage();
    getDeletedTasksFromLocalStorage();
    // setTimeout(postTasksToApiAsync, 1000);
    // setTimeout(removeTasksFromApi, 2000);
    // setTimeout(getTasksFromApiAsync, 3000);

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
      removeItemValue(user);
      await AsyncStorage.setItem(user, JSON.stringify(tasks));
      console.log('TaskList: tasks after store in local storage', tasks);
    } catch (e) {
      console.log(e);
    }
  };

  //get data from local storage.
  const getTasksFromLocalStorage = async () => {
    try {
      const value = await AsyncStorage.getItem(user);
      if (value !== null) {
        setTasks(JSON.parse(value));
        console.log('tasks from loca storage is', value);
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
    setLoadingBarVisible(true);
    try {
      const response = await fetch(URI + '/tasks/get', {
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
    setLoadingBarVisible(true);
    try {
      await fetch(URI + '/tasks/delete', {
        method: 'POST',
        headers: {
          Authorization: token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(removedTasks),
      });
      setRemovedTasks([]);
    } catch (e) {
      console.log(e);
    }
  }

  async function postTasksToApiAsync() {
    setLoadingBarVisible(true);
    try {
      const response = await fetch(URI + '/tasks/add', {
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
    props.navigation.navigate('TaskDetails', {
      addButtonPressed: editTaskHandler,
      deleteButtonPressed: deleteItemHandler,
      isDeleteButtonVisible: true,
      title: tempTask.title,
      id: tempTask.id,
    });
  };

  const syncData = () => {
    checkConnection();
    if (isOnline) {
      setLoadingBarVisible(true);
      postTasksToApiAsync();
      setTimeout(removeTasksFromApi, 1000);
      setTimeout(getTasksFromApiAsync, 2000);
    }
  };

  const openAddScreenHandler = () => {
    props.navigation.navigate('TaskDetails', {
      addButtonPressed: addTaskHandler,
      id: -1,
    });
  };

  return (
    <Container>
      <Content padder>
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
        <Button
          style={{margin: 10}}
          full
          rounded
          primary
          onPress={openAddScreenHandler}>
          <Text style={{color: 'white'}}>Add new task</Text>
        </Button>
        <Button style={{margin: 10}} full rounded light onPress={syncData}>
          <Text style={{color: 'white'}}>Sync data...</Text>
        </Button>

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
      </Content>
    </Container>
  );
};

export default TaskList;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
    justifyContent: 'flex-end',
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
