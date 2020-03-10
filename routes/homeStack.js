import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import TaskItem from '../components/TaskItem';

const screens = {
  Home: {
    screen: TaskList,
  },
  TaskDetails: {
    screen: TaskInput,
  },
  TaskItem: {
    screen: TaskItem,
  },
};
const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
