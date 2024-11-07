// src/schemas/taskSchema.js
export default {
    title: 'task schema',
    version: 1,
    description: 'Schema para las tareas',
    type: 'object',
    properties: {
        id: { type: 'string', primary: true },
        title: { type: 'string', maxLength: 100 },
        description: { type: 'string', maxLength: 300 },
        completed: { type: 'boolean', default: false },
        createdAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'title', 'createdAt'],
};
