import {InputBox} from '@/components/atoms';
import {createTodoItem} from '@/services/api/todos';
import {DateRangePicker} from '@components/molecules';
import {yupResolver} from '@hookform/resolvers/yup';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
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
  // const {setStatusBar} = useStatusBar();
  const {todo: initialTodo} = route.params || {}; // Get todo data if editing
  const isEditing = !!initialTodo;

  const {
    control,
    handleSubmit,
    setValue,
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

  useEffect(() => {
    // setStatusBar({backgroundColor: 'blue'});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleSaveTodo = async data => {
    const reminderData = data.reminder.enabled
      ? {
          reminderDate: data.reminder.date?.toISOString().split('T')[0],
          reminderTime: data.reminder.time?.toLocaleTimeString('en-US', {
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
      ...reminderData,
    };

    try {
      await createTodoItem(newTodo);
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }

    // In a real app, you would likely dispatch an action to update your todo list // Go back to the Todo List screen
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="blue" translucent={false} />
      <Appbar.Header>
        <Appbar.Action icon="close" onPress={handleCancel} />
        <Appbar.Content
          title={isEditing ? 'Edit Todo' : 'Add New Todo'}
          titleStyle={{textAlign: 'center'}}
        />
        <Appbar.Action icon="check" onPress={handleSubmit(handleSaveTodo)} />
      </Appbar.Header>

      <View style={styles.content}>
        <View style={{backgroundColor: '#fff', padding: 15, borderRadius: 10}}>
          <InputBox
            control={control}
            name="title"
            label="Title"
            placeholder="Enter todo title"
            errors={errors}
          />
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            padding: 15,
            borderRadius: 10,
            marginVertical: 15,
          }}>
          <InputBox
            control={control}
            name="description"
            label="Description"
            multiline={true}
            inputStyle={{height: 100}}
            placeholder="Enter todo description"
            errors={errors}
          />
        </View>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
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
