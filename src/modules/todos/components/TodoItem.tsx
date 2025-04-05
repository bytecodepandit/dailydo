import {Checkbox, IconButton, Text} from '@components/atoms';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

const TodoItem = ({todo, onToggleComplete, onDelete, onEdit}) => {
  const {colors} = useTheme();

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
            <Text variant="caption">{todo.time}</Text>
          </View>
        )}
      </View>
      <IconButton
        icon="dots-vertical"
        onPress={() => console.log('More options')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 4,
    marginBottom: 8,
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
