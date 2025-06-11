import React from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import KanbanColumnHeader from '@/components/molecules/KanbanColumnHeader';
import TaskCard from '@/components/molecules/TaskCard';

const KanbanBoard = ({ columns, tasks, onDragEnd, onEditTask, onDeleteTask, getStoryTitle, getPriorityColor }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-x-auto">
        {columns.map((column) => {
          const columnTasks = tasks.filter(task => task.status === column.id);

          return (
            <div key={column.id} className={`${column.color} rounded-lg p-4 min-h-96`}>
              <KanbanColumnHeader title={column.title} count={columnTasks.length} />

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-80 ${
                      snapshot.isDraggingOver ? 'bg-surface-100 rounded-lg' : ''
                    }`}
                  >
                    <AnimatePresence>
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(draggableProvided, draggableSnapshot) => (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <TaskCard
                                task={task}
                                index={index}
                                onEdit={onEditTask}
                                onDelete={onDeleteTask}
                                getStoryTitle={getStoryTitle}
                                getPriorityColor={getPriorityColor}
                                draggableProvided={draggableProvided}
                                snapshot={draggableSnapshot}
                                type="kanban"
                              />
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

KanbanBoard.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  })).isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDragEnd: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  getStoryTitle: PropTypes.func.isRequired,
  getPriorityColor: PropTypes.func.isRequired,
};

export default KanbanBoard;