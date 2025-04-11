import {Checkbox, Text} from '@components/atoms';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {IconButton, Menu} from 'react-native-paper';

export interface Todo {
  id: number; // Unique identifier for the todo item
  title: string; // Title of the todo item
  description?: string; // Optional description of the todo item
  completed: boolean; // Whether the todo item is completed
  time?: string; // Optional time associated with the todo item
}

interface TodoItemProps {
  todo: Todo; // The todo item to display
  onToggleComplete: (id: number) => void; // Callback to toggle the completion status
  onDelete: (id: number) => void; // Callback to delete the todo item
  onEdit: (todo: Todo) => void; // Callback to edit the todo item
}
const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <View style={styles.container}>
      <Checkbox
        status={todo.completed ? 'checked' : 'unchecked'}
        onPress={() => onToggleComplete(todo.id)}
      />
      <View style={styles.textContainer}>
        <Text
          variant="titleMedium"
          style={[todo.completed && styles.completedText]}>
          {todo.title}
        </Text>
        {todo.description && (
          <Text
            variant="bodyMedium"
            style={[
              styles.description,
              todo.completed && styles.completedText,
            ]}>
            {todo.description}
          </Text>
        )}
        {todo.time && (
          <View style={styles.timeContainer}>
            {/* You might want to use a clock icon here */}
            <Text variant="displaySmall">{todo.time}</Text>
          </View>
        )}
      </View>
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={<IconButton icon="dots-vertical" onPress={openMenu} />}>
        <Menu.Item
          onPress={() => {
            closeMenu();
            onEdit(todo);
          }}
          title="Edit"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            onDelete(todo.id);
          }}
          title="Delete"
        />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#777',
  },
  description: {
    color: '#555',
  },
  timeContainer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TodoItem;
