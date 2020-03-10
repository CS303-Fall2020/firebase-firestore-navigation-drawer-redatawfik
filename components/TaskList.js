import React, {useState} from 'react';
import {StyleSheet, View, Button, FlatList} from 'react-native';
import TaskItem from './TaskItem';

function TaskList({navigation}) {
  const [tasks, setTasks] = useState([]);

  const addTaskHandler = taskTitle => {
    setTasks(currentTasks => [
      ...currentTasks,
      {id: Math.random().toString(), title: taskTitle},
    ]);
  };

  const deleteItemHandler = id => {
    setTasks(currentTasks => {
      return currentTasks.filter(task => task.id !== id);
    });
  };

  const openAddScreenHandler = () => {
    navigation.navigate('TaskDetails', {
      addButtonPressed: addTaskHandler,
    });
  };

  return (
    <View style={styles.screen}>
      <Button title={'Add new task'} onPress={openAddScreenHandler} />
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
}
export default TaskList;

const styles = StyleSheet.create({
  screen: {
    padding: 10,
  },
});
