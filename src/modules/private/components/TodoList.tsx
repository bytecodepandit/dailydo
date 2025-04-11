import {Text} from '@components/atoms';
import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import TodoItem, {Todo} from './TodoItem';

interface TodoListProps {
  todos: Todo[]; // Array of todo items
  onToggleComplete: (id: number) => void; // Callback to toggle the completion status
  onDelete: (id: number) => void; // Callback to delete a todo item
  onEdit: (todo: Todo) => void; // Callback to edit a todo item
  completed: boolean; // Whether to show completed or active tasks
}
const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggleComplete,
  onDelete,
  onEdit,
  completed,
}) => {
  const filteredTodos = completed
    ? todos.filter(todo => todo.completed)
    : todos.filter(todo => !todo.completed);

  if (filteredTodos.length === 0) {
    return (
      <Text style={styles.emptyText}>
        No {completed ? 'completed' : 'active'} tasks.
      </Text>
    );
  }

  return (
    <FlatList
      data={filteredTodos}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => (
        <TodoItem
          todo={item}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
      style={styles.list}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 72, // To accommodate the FAB
  },
  emptyText: {
    textAlign: 'center',
    padding: 16,
    color: '#777',
  },
});

export default TodoList;
