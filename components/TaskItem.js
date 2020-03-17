import React, {useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const TaskItem = props => {
  const [checked, setChecked] = useState(props.done);

  const textStyle = () => {
    return {
      textAlign: 'center',
      fontSize: 20,
      textDecorationLine: props.done ? 'line-through' : 'none',
      textDecorationStyle: 'solid',
      fontWeight: 'normal',
    };
  };

  const onDeleteClick = () => {};

  const stateChangeHandler = () => {
    setChecked(!checked);
    if (!checked) {
      props.onStateChange({id: props.id, title: props.title, done: true});
    } else {
      props.onStateChange({id: props.id, title: props.title, done: false});
    }
  };

  return (
    <TouchableOpacity
      onPress={() => props.onClickItem({id: props.id, title: props.title})}>
      <View style={styles.listItem}>
        <View style={{alignSelf: 'center'}}>
          <CheckBox value={checked} onValueChange={stateChangeHandler} />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignContent: 'center',
          }}>
          <Text style={textStyle()}>{props.title}</Text>
        </View>
        <View style={{alignSelf: 'center', paddingLeft: 5}}>
          <Button
            title={'Delete'}
            onPress={() => props.onDeleteClick(props.id)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    padding: 10,
    margin: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
});

export default TaskItem;
