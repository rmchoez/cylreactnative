// src/components/TaskItem.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TaskItem = ({ task }) => {
    return (
        <View style={styles.taskContainer}>
            <Text style={styles.title}>{task.title}</Text>
            <Text style={styles.description}>{task.description}</Text>
            <Text style={styles.completed}>{task.completed ? "Completed" : "Pending"}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    taskContainer: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    completed: {
        fontSize: 12,
        color: 'green',
    },
});

export default TaskItem;
