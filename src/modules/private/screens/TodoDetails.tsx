import {InputBox} from '@/components/atoms';
import {DateRangePicker} from '@components/molecules';
import {yupResolver} from '@hookform/resolvers/yup';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import * as yup from 'yup';

const reminderSchema = yup.object().shape({
  enabled: yup.boolean(),
  date: yup
    .date()
    .nullable()
    .when('enabled', {
      is: true,
      then: yup.date().required('Reminder date is required'),
    }),
  time: yup
    .date()
    .nullable()
    .when('enabled', {
      is: true,
      then: yup.date().required('Reminder time is required'),
    }),
});

const schema = yup.object().shape({
  title: yup.string().required('Todo title is required').trim(),
  description: yup.string().trim(),
  reminder: reminderSchema,
});

const AddEditTodoScreen = ({navigation, route}) => {
  const {todo: initialTodo} = route.params || {}; // Get todo data if editing
  const isEditing = !!initialTodo;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: initialTodo?.title || '',
      description: initialTodo?.description || '',
      reminder: {
        enabled: !!initialTodo?.reminder,
        date: initialTodo?.reminder?.date
          ? new Date(initialTodo.reminder.date)
          : null,
        time: initialTodo?.reminder?.time
          ? new Date(`2000-01-01T${initialTodo.reminder.time}`)
          : null,
      },
    },
  });

  const reminderValue = watch('reminder');

  useEffect(() => {
    if (isEditing && initialTodo.reminder) {
      setValue('reminder.enabled', true);
      if (initialTodo.reminder.date) {
        setValue('reminder.date', new Date(initialTodo.reminder.date));
      }
      if (initialTodo.reminder.time) {
        const [hours, minutes] = initialTodo.reminder.time.split(':');
        const time = new Date();
        time.setHours(parseInt(hours, 10));
        time.setMinutes(parseInt(minutes, 10));
        setValue('reminder.time', time);
      }
    } else if (!isEditing) {
      setValue('reminder.enabled', false);
      setValue('reminder.date', null);
      setValue('reminder.time', null);
    }
  }, [initialTodo, isEditing, setValue]);

  const handleSaveTodo = data => {
    const reminderData = data.reminder.enabled
      ? {
          date: data.reminder.date?.toISOString().split('T')[0],
          time: data.reminder.time?.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
          }),
        }
      : null;

    const newTodo = {
      id: isEditing ? initialTodo.id : Date.now(), // Simple ID generation
      title: data.title,
      description: data.description,
      completed: initialTodo?.completed || false, // Preserve completed status if editing
      reminder: reminderData,
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
        <Appbar.Content title={isEditing ? 'Edit Todo' : 'Add New Todo'} />
        <Appbar.Action icon="check" onPress={handleSubmit(handleSaveTodo)} />
      </Appbar.Header>

      <View style={styles.content}>
        <InputBox
          control={control}
          name="title"
          label="Title"
          placeholder="Enter todo title"
          errors={errors}
        />
        <InputBox
          control={control}
          name="description"
          label="Description"
          placeholder="Enter todo description"
          errors={errors}
        />
        <Controller
          name="reminder"
          control={control}
          render={({field: {onChange, value}}) => (
            <DateRangePicker
              initialReminder={value}
              onReminderChange={onChange}
              errors={errors.reminder}
            />
          )}
        />
        {errors.reminder?.date && (
          <Text style={styles.errorText}>{errors.reminder.date?.message}</Text>
        )}
        {errors.reminder?.time && (
          <Text style={styles.errorText}>{errors.reminder.time?.message}</Text>
        )}
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default AddEditTodoScreen;
