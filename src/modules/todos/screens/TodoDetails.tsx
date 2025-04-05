import {DateRangePicker} from '@components/molecules';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import TitleInput from '../components/TitleInput';

const AddEditTodoScreen = ({navigation, route}) => {
  const {todo} = route.params || {}; // Get todo data if editing
  const isEditing = !!todo;

  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [reminderEnabled, setReminderEnabled] = useState(!!todo?.reminder);
  const [reminderDate, setReminderDate] = useState(
    todo?.reminder?.date ? new Date(todo.reminder.date) : null,
  );
  const [reminderTime, setReminderTime] = useState(
    todo?.reminder?.time ? new Date(`2000-01-01T${todo.reminder.time}`) : null,
  );
  const [reminder, setReminder] = useState({
    enabled: false,
    date: null,
    time: null,
  });

  const handleTitleChange = (text: string) => {
    setTitle(text);
    console.log('Title:', text);
    // You can perform other actions here when the text changes
  };

  const handleReminderChange = newReminder => {
    setReminder(newReminder);
    console.log('Reminder updated:', newReminder);
  };

  useEffect(() => {
    if (isEditing && todo.reminder) {
      setReminderEnabled(true);
      if (todo.reminder.date) {
        setReminderDate(new Date(todo.reminder.date));
      }
      if (todo.reminder.time) {
        const [hours, minutes] = todo.reminder.time.split(':');
        const time = new Date();
        time.setHours(parseInt(hours, 10));
        time.setMinutes(parseInt(minutes, 10));
        setReminderTime(time);
      }
    } else if (!isEditing) {
      setReminderEnabled(false);
      setReminderDate(null);
      setReminderTime(null);
    }
  }, [todo, isEditing]);

  const handleSaveTodo = () => {
    if (!title.trim()) {
      // Basic validation: Title is required
      alert('Please enter a todo title.');
      return;
    }

    const reminder = reminderEnabled
      ? {
          date: reminderDate?.toISOString().split('T')[0],
          time: reminderTime?.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
          }),
        }
      : null;

    const newTodo = {
      id: isEditing ? todo.id : Date.now(), // Simple ID generation
      title: title.trim(),
      description: description.trim(),
      completed: todo?.completed || false, // Preserve completed status if editing
      reminder: reminder,
    };

    // In a real app, you would likely dispatch an action to update your todo list
    console.log('Saving todo:', newTodo);
    navigation.goBack(); // Go back to the Todo List screen
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Action icon="close" onPress={handleCancel} />
        <Appbar.Content
          title={isEditing ? `Edit Todo: ${todo?.title}` : 'Add New Todo'}
        />
        <Appbar.Action icon="check" onPress={handleSaveTodo} />
      </Appbar.Header>

      <View style={styles.content}>
        <TitleInput
          label="Title"
          value={title}
          onChangeText={handleTitleChange}
        />
        <TitleInput
          label="Description"
          placeholder="Add details about your todo (optional)"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          style={styles.input}
          numberOfLines={10}
        />
        <DateRangePicker
          initialReminder={reminder}
          onReminderChange={handleReminderChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  reminderSection: {
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  reminderOptions: {
    paddingHorizontal: 16,
  },
  reminderButton: {
    marginBottom: 8,
  },
});

export default AddEditTodoScreen;
