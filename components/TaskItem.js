import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const TaskItem = props => {
  const [checked, setChecked] = useState(false);
  const [line, setLine] = useState('none');

  const textStyle = () => {
    return {
      textAlign: 'center',
      fontSize: 20,
      textDecorationLine: line,
      textDecorationStyle: 'solid',
      fontWeight: 'normal',
    };
  };

  const stateChangeHandler = () => {
    setChecked(!checked);
    if (!checked) {
      setLine('line-through');
    } else {
      setLine('none');
    }
  };

  return (
    <TouchableOpacity
      onPress={() => props.onClickItem({id: props.id, title: props.title})}>
      <View style={styles.listItem}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignContent: 'flex-start',
          }}>
          <Text style={textStyle()}>{props.title}</Text>
        </View>
        <View style={{flexDirection: 'column', alignSelf: 'auto'}}>
          <View style={{flexDirection: 'row'}}>
            <CheckBox value={checked} onValueChange={stateChangeHandler} />
          </View>
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
