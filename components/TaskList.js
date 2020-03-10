import React, {useState} from 'react';
import {StyleSheet, View, Button, FlatList} from 'react-native';
import TaskItem from './TaskItem';

function TaskList({navigation}) {
  const [tasks, setTasks] = useState([]);

  const addTaskHandler = newTask => {
    setTasks(currentTasks => [
      ...currentTasks,
      {id: newTask.id, title: newTask.title},
    ]);
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
  };

  const deleteItemHandler = id => {
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

  const openAddScreenHandler = () => {
    navigation.navigate('TaskDetails', {
      addButtonPressed: addTaskHandler,
      id: -1,
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
});
