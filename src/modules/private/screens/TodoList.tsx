import {SegmentedButtons} from '@/components/molecules';
import {Text} from '@components/atoms';
import {NavigationProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {FAB} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScreenName} from '../../../app/navigation/ScreenName';
import Header from '../components/Header';
import {Todo} from '../components/TodoItem';
import TodoList from '../components/TodoList';

// Dummy todo data
const initialTodos = [
  {
    id: 1,
    title: 'Review project proposal',
    description: 'Go through the latest version and add comments',
    time: '10:00 AM',
    completed: false,
  },
  {
    id: 2,
    title: 'Team meeting',
    description: 'Weekly sync with design team',
    time: '2:00 PM',
    completed: false,
  },
  {
    id: 3,
    title: 'Update documentation',
    description: 'Add new API endpoints to the docs',
    time: '4:00 PM',
    completed: false,
  },
  {
    id: 4,
    title: 'Send weekly report',
    description: 'Compile and send progress report',
    completed: true,
  },
  {
    id: 5,
    title: 'Code review',
    description: 'Review pull requests from team',
    completed: true,
  },
];

interface TodoListScreenProps {
  navigation: NavigationProp<any>;
}
const TodoListScreen: React.FC<TodoListScreenProps> = ({navigation}) => {
  const [todos, setTodos] = useState(initialTodos);
  const [filter, setFilter] = useState<string | number>('active');

  const handleToggleComplete = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? {...todo, completed: !todo.completed} : todo,
      ),
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const handleEditTodo = (todo: Todo) => {
    console.log('Edit todo:', todo);
    navigation.navigate(ScreenName.TodoDetails, {
      todo, // Pass the todo data to the edit screen
    });
    // Navigate to Add/Edit screen with todo data
  };

  const filteredTodos = () => {
    if (filter === 'active') {
      return todos.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      return todos.filter(todo => todo.completed);
    }
    return todos; // 'all'
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        navigation={navigation}
        profileImage={{
          uri: 'https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg',
        }}
      />

      <SegmentedButtons
        initialValue={filter}
        onValueChange={setFilter}
        options={[
          {value: 'all', label: 'All'},
          {value: 'active', label: 'Today'}, // Renamed to match the screenshot
          {value: 'upcoming', label: 'Upcoming', disabled: true}, // Placeholder
          {value: 'completed', label: 'Completed'},
        ]}
      />

      <ScrollView style={styles.listContainer}>
        {filter === 'active' || filter === 'all' ? (
          <View>
            {filteredTodos().filter(todo => !todo.completed).length > 0 && (
              <Text style={styles.sectionTitle}>TODAY</Text>
            )}
            <TodoList
              todos={filteredTodos().filter(todo => !todo.completed)}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTodo}
              onEdit={handleEditTodo}
              completed={false}
            />
          </View>
        ) : null}

        {filter === 'completed' || filter === 'all' ? (
          <View>
            {filteredTodos().filter(todo => todo.completed).length > 0 && (
              <Text style={styles.sectionTitle}>COMPLETED</Text>
            )}
            <TodoList
              todos={filteredTodos().filter(todo => todo.completed)}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTodo}
              onEdit={handleEditTodo}
              completed={true}
            />
          </View>
        ) : null}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        color={'#fff'}
        onPress={() => navigation.navigate(ScreenName.TodoDetails)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  listContainer: {
    flex: 1,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 50,
    backgroundColor: '#007bff',
    elevation: 0,
  },
});

export default TodoListScreen;
