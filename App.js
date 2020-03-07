import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Button, FlatList, AsyncStorage} from 'react-native';
import TaskInput from './components/TaskInput';
import TaskItem from './components/TaskItem';

const App: () => React$Node = () => {
  const [tasks, setTasks] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);
  //AsyncStorage.setItem('user', JSON.stringify(tasks));

  // useEffect(() => {
  //   retrieveData();
  // });
  // //
  // const storeData = async () => {
  //   try {
  //     await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const retrieveData = async () => {
  //   try {
  //     AsyncStorage.getItem('tasks').then(response => {
  //       const currentTasks = JSON.parse(response);
  //       setTasks(currentTasks);
  //       console.log('Current tasks data will be: ' + currentTasks);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const addTaskHandler = taskTitle => {
    setTasks(currentTasks => [
      ...currentTasks,
      {id: Math.random().toString(), title: taskTitle},
    ]);
    setIsAddMode(false);
    //storeData();
  };

  const deleteItemHandler = id => {
    setTasks(currentTasks => {
      return currentTasks.filter(task => task.id !== id);
    });
  };

  const cancelHandler = () => {
    setIsAddMode(false);
  };

  return (
    <View style={styles.screen}>
      <Button title={'Add new task'} onPress={() => setIsAddMode(true)} />
      <TaskInput
        isAppear={isAddMode}
        addButtonPressed={addTaskHandler}
        cancelButtonPressed={cancelHandler}
      />
      <FlatList
        data={tasks}
        renderItem={({item}) => (
          <TaskItem
            id={item.id}
            title={item.title}
            onDelete={deleteItemHandler}
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};
export default App;

const styles = StyleSheet.create({
  screen: {
    padding: 10,
  },
});
