import { Image } from 'expo-image';
import {
  StyleSheet,
  View,
  Pressable,
  Animated,
  Dimensions,
  Text,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { ThemedText } from '@/components/themed-text';
import { TextInput } from 'react-native';
import { router } from 'expo-router';




const SCREEN_WIDTH = Dimensions.get('window').width;
const MENU_WIDTH = SCREEN_WIDTH * 0.7;


export default function ExploreScreen() {
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const [menuOpen, setMenuOpen] = useState(false);
  const [todos, setTodos] = useState<
  { id: number; text: string; done: boolean }[]
>([]);


  const toggleTodo = (id: number) => {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  };
  const [showInput, setShowInput] = useState(false);
  const [newTask, setNewTask] = useState('');
  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };


  const openMenu = () => {
    setMenuOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -MENU_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setMenuOpen(false));
  };
  const closeInput = () => {
    setNewTask('');
    setShowInput(false);
  };



  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        closeInput();
      }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >

        {/* Background */}
        <Image
          source={require('../../assets/images/bg.jpg')}
          style={styles.background}
          contentFit="cover"
        />

        {/* Hamburger Menu */}
        <Pressable style={styles.menuButton} onPress={openMenu}>
          <View style={styles.line} />
          <View style={styles.line} />
          <View style={styles.line} />
        </Pressable>

        {/* Profile Circle */}
        <View style={styles.Pcircle} />
        {/* TODO CARD */}
        <View style={styles.todoCard}>

          {/* Header */}
          <View style={styles.todoHeader}>
            <Text style={styles.todoTitle}>Today</Text>

            <Pressable
              style={styles.addButton}
              onPress={() => setShowInput(true)}
            >
              <Text style={styles.addIcon}>＋</Text>
            </Pressable>
          </View>

          {/* Todo List */}
          {todos.map(todo => (
            <Pressable
              key={todo.id}
              style={styles.todoItem}
              onPress={() => toggleTodo(todo.id)} //complete on press
              onLongPress={() => deleteTodo(todo.id)} //delete on long press
              delayLongPress={400}
            >

              <View
                style={[
                  styles.checkbox,
                  todo.done && styles.checkboxDone,
                ]}
              />
              <Text
                style={[
                  styles.todoText,
                  todo.done && styles.todoDone,
                ]}
              >
                {todo.text}
              </Text>
            </Pressable>
          ))}

          {/* Inline Input */}
          {showInput && (
            <Pressable onPress={() => { }}>
              <TextInput
                autoFocus
                value={newTask}
                onChangeText={setNewTask}
                placeholder="New task"
                style={styles.inlineInput}

                onSubmitEditing={() => {
                  if (!newTask.trim()) {
                    setShowInput(false);
                    return;
                  }

                  setTodos(prev => [
                    ...prev,
                    { id: Date.now(), text: newTask.trim(), done: false },
                  ]);
                  setNewTask('');
                  setShowInput(false);
                }}
              />
            </Pressable>
          )}
        </View>


        {/* Overlay */}
        {menuOpen && (
          <Pressable style={styles.overlay} onPress={closeMenu} />
        )}
        {/* Slide Menu */}
        <Animated.View
          style={[
            styles.menu,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <ThemedText type="title" style={styles.title}>
            Menu
          </ThemedText>
          <Pressable style={[styles.menuItem]}
          onPress={() => router.push('/(tabs)/planner')}
          >
            <Text style={styles.menuIcon}>🗓️</Text>
            <Text style={styles.menuText}>Planner</Text>
          </Pressable>

          <Pressable style={styles.menuItem}
          onPress={() => router.push('/(tabs)/streak')}>
            <Text style={styles.menuIcon}>🔥</Text>
            <Text style={styles.menuText}>Streak</Text>
          </Pressable>

          <Pressable style={[styles.menuItem]}
          onPress={() => router.push('/(tabs)/milestone')}>
            <Text style={styles.menuIcon}>🪨</Text>
            <Text style={styles.menuText}>Milestone</Text>
          </Pressable>

          <Pressable 
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/petshop')}
          >
            <Text style={styles.menuIcon}>🐾</Text>
            <Text style={styles.menuText}>Pet Shop</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={styles.menuText}>Settings</Text>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  /* Hamburger */
  menuButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    gap: 5,
    zIndex: 20,
  },

  line: {
    width: 25,
    height: 3,
    backgroundColor: '#000',
    borderRadius: 2,
  },

  /* Profile Circle */
  Pcircle: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: 'grey',
    position: 'absolute',
    top: 45,
    right: 20,
    zIndex: 10,
  },

  /* Overlay */
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 15,
  },

  /* Slide Menu */
  menu: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: MENU_WIDTH,
    height: '100%',
    backgroundColor: '#ffffff',
    paddingTop: 90,
    paddingHorizontal: 16,
    zIndex: 30,
    elevation: 10, // Android shadow
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 14,
    backgroundColor: '#f2f2f2',
  },

  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },

  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  title: {
    position: 'absolute',
    top: 40,
    left: 16,
    fontSize: 26,
    fontWeight: '700',
    color: '#000',
  },
  /* TODO CARD */
  todoCard: {
    marginTop: 120,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },

  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  todoTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addIcon: {
    color: '#fff',
    fontSize: 26,
    lineHeight: 26,
    fontWeight: '600',
  },

  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#aaa',
    marginRight: 12,
  },

  checkboxDone: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
  },

  todoText: {
    fontSize: 16,
    color: '#333',
  },

  todoDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },

  inlineInput: {
    height: 42,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 14,
    marginTop: 6,
  },
});
