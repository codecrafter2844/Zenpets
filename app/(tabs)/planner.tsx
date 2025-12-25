// planner.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    FlatList,
    ImageBackground,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { Calendar } from "react-native-calendars";

type Task = {
    id: string;
    title: string;
    description: string;
};

const Planner = () => {
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const today = new Date().toISOString().split("T")[0];
    const [selectedDate, setSelectedDate] = useState<string>(today);
    const [tasks, setTasks] = useState<Record<string, Task[]>>({});
    const isPastDate = selectedDate < today;
    const formatDate = (date: string) => {
        const [y, m, d] = date.split("-");
        return `${d}-${m}-${y}`;
    };

    const openAddTaskModal = () => {
        if (!selectedDate) {
            Alert.alert("Select a date first");
            return;
        }
        setShowModal(true);
    };
    const saveTask = () => {
        if (!taskTitle.trim()) {
            Alert.alert("Task name required");
            return;
        }

        const newTask = {
            id: Date.now().toString(),
            title: taskTitle,
            description: taskDesc,
        };

        setTasks(prev => ({
            ...prev,
            [selectedDate]: [...(prev[selectedDate] || []), newTask],
        }));

        setTaskTitle("");
        setTaskDesc("");
        setShowModal(false);
    };

    const deleteTask = (id: string) => {
        setTasks({
            ...tasks,
            [selectedDate]: tasks[selectedDate].filter(t => t.id !== id),
        });
    };

    return (
        <ImageBackground source={require('../../assets/images/bg.jpg')} style={styles.bg}>
            <View style={styles.container}>
                <Text style={styles.plannerTitle}>📅 Planner</Text>

                {/* Calendar */}
                <View style={styles.calendarWrapper}>
                    <View style={styles.calendar}></View>
                    <Calendar
                        onDayPress={day => setSelectedDate(day.dateString)}
                        markedDates={{
                            [selectedDate]: {
                                selected: true,
                                selectedColor: "#6C63FF",
                                selectedTextColor: "#fff",
                            },
                        }}


                        enableSwipeMonths
                        theme={{
                            backgroundColor: "#ffffff",
                            calendarBackground: "#ffffff",

                            // Month header
                            monthTextColor: "#333",
                            textMonthFontSize: 18,
                            textMonthFontWeight: "700",

                            // Week days
                            textSectionTitleColor: "#888",
                            textDayHeaderFontSize: 12,

                            // Day numbers
                            textDayFontSize: 14,
                            textDayFontWeight: "500",
                            textDayTextColor: "#444",

                            // Today
                            todayTextColor: "#6C63FF",

                            // Selected day
                            selectedDayBackgroundColor: "#6C63FF",
                            selectedDayTextColor: "#fff",


                            // Arrows
                            arrowColor: "#6C63FF",
                        } as any}
                        style={styles.calendar}
                    />

                </View>

                {/* Task Section */}
                <View style={styles.taskContainer}>
                    <Text style={styles.dateText}>
                        {selectedDate ? formatDate(selectedDate) : "Select a date"}
                    </Text>

                    <FlatList
                        data={tasks[selectedDate] || []}
                        keyExtractor={item => item.id}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No tasks</Text>
                        }
                        renderItem={({ item }) => {
                            const isExpanded = expandedTaskId === item.id;

                            return (
                                <View style={styles.taskCard}>

                                    {/* 🔹 Task header (always visible) */}
                                    <TouchableOpacity
                                        style={styles.taskHeader}
                                        onPress={() =>
                                            setExpandedTaskId(isExpanded ? null : item.id)
                                        }
                                    >
                                        <Text style={styles.taskText}>{item.title}</Text>

                                        <Ionicons
                                            name={isExpanded ? "chevron-up" : "chevron-down"}
                                            size={20}
                                            color="#6C63FF"
                                        />
                                    </TouchableOpacity>

                                    {/* 🔽 DROPDOWN CONTENT — ADD THIS HERE */}
                                    {isExpanded && (
                                        <View>
                                            <Text style={styles.taskDesc}>
                                                {item.description}
                                            </Text>

                                            <TouchableOpacity onPress={() => deleteTask(item.id)}>
                                                <Text style={{ color: "#FF5252", marginTop: 6 }}>
                                                    Delete
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                </View>
                            );

                        }}

                    />

                    {/* Add Task Button */}
                    <TouchableOpacity
                        style={[
                            styles.addBtn,
                            isPastDate && { backgroundColor: "#ccc" },
                        ]}
                        onPress={openAddTaskModal}
                        disabled={isPastDate}
                    >
                        <Ionicons name="add" size={26} color="#fff" />
                        <Text style={styles.addText}>Add Task</Text>
                    </TouchableOpacity>

                </View>
            </View>
            <Modal visible={showModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalDate}>{formatDate(selectedDate)}</Text>


                        <TextInput
                            placeholder="Title"
                            value={taskTitle}
                            onChangeText={setTaskTitle}
                            style={styles.input}
                        />

                        <TextInput
                            placeholder="Description"
                            value={taskDesc}
                            onChangeText={setTaskDesc}
                            style={[styles.input, { height: 80 }]}
                            multiline
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <Text style={styles.cancel}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={saveTask}>
                                <Text style={styles.save}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </ImageBackground>
    );
};

export default Planner;

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    container: {
        flex: 1,
        paddingTop: 40,
    },
    calendar: {
        borderRadius: 18,
        elevation: 6, // Android
        shadowColor: "#000", // iOS + Web
        overflow: "hidden",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
    },
    taskContainer: {
        flex: 1,
        margin: 12,
        padding: 16,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.95)",
    },
    dateText: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
    },
    taskRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderColor: "#ddd",
    },
    emptyText: {
        textAlign: "center",
        color: "#999",
        marginTop: 20,
    },
    addBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
        padding: 12,
        borderRadius: 12,
        backgroundColor: "#6C63FF",
    },
    addText: {
        color: "#fff",
        marginLeft: 6,
        fontWeight: "600",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
    },
    modalDate: {
        fontWeight: "600",
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
    },
    cancel: {
        marginRight: 20,
        color: "#888",
    },
    save: {
        color: "#6C63FF",
        fontWeight: "600",
    },
    taskCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        elevation: 2,
    },
    taskHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    calendarWrapper: {
        marginHorizontal: 12,   // 👈 SAME as taskContainer
        marginBottom: 12,
    },
    taskText: {
        fontSize: 14,
        fontWeight: "500",
    },
    taskDesc: {
        marginTop: 8,
        fontSize: 13,
        color: "#666",
        lineHeight: 18,
    },
    plannerTitle: {
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 14,
        color: "#2E2E2E",
        letterSpacing: 0.5,
    }
});
