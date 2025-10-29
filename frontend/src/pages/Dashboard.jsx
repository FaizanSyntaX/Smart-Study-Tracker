import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, Plus, Edit2, Trash2, Check, Moon, Sun, PlayCircle, PauseCircle, RotateCcw, Search, Filter, ChevronDown, Timer, BookOpen, Target, TrendingUp, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPomodoroModal, setShowPomodoroModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('None');
  
  // Form state
  const [formData, setFormData] = useState({
    taskName: '',
    subject: '',
    estimatedTime: '',
    priority: 'medium'
  });

  // Pomodoro state
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState('work');
  const [progress, setProgress] = useState(0);

  const API_URL = 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  const axiosConfig = {
    headers: { Authorization: token }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tasks`, axiosConfig);
      setTasks(response.data);
      toast.success('Tasks loaded successfully!', { position: 'top-right', autoClose: 2000 });
    } catch (error) {
      toast.error('Failed to fetch tasks', { position: 'top-right' });
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Pomodoro timer effect
  useEffect(() => {
    let interval;
    if (isRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(prev => {
          const newTime = prev - 1;
          const totalTime = pomodoroMode === 'work' ? 25 * 60 : pomodoroMode === 'shortBreak' ? 5 * 60 : 15 * 60;
          setProgress(((totalTime - newTime) / totalTime) * 100);
          return newTime;
        });
      }, 1000);
    } else if (pomodoroTime === 0) {
      setIsRunning(false);
      toast.success(`${pomodoroMode === 'work' ? 'Work' : 'Break'} session completed!`, { 
        position: 'top-center',
        autoClose: 5000 
      });
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isRunning, pomodoroTime, pomodoroMode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePomodoroMode = (mode) => {
    setPomodoroMode(mode);
    setIsRunning(false);
    setProgress(0);
    if (mode === 'work') setPomodoroTime(25 * 60);
    else if (mode === 'shortBreak') setPomodoroTime(5 * 60);
    else setPomodoroTime(15 * 60);
  };

  const handleAddTask = async () => {
    if (!formData.taskName || !formData.subject || !formData.estimatedTime) {
      toast.warning('Please fill all fields', { position: 'top-right' });
      return;
    }

    try {
      const taskData = {
        taskName: formData.taskName,
        subject: formData.subject,
        estimatedTime: parseFloat(formData.estimatedTime),
        priority: formData.priority,
        status: 'pending'
      };

      await axios.post(`${API_URL}/tasks`, taskData, axiosConfig);
      toast.success('Task added successfully!', { position: 'top-right', autoClose: 2000 });
      setFormData({ taskName: '', subject: '', estimatedTime: '', priority: 'medium' });
      setShowAddTask(false);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to add task', { position: 'top-right' });
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async () => {
    if (!formData.taskName || !formData.subject || !formData.estimatedTime) {
      toast.warning('Please fill all fields', { position: 'top-right' });
      return;
    }

    try {
      const taskData = {
        taskName: formData.taskName,
        subject: formData.subject,
        estimatedTime: parseFloat(formData.estimatedTime),
        priority: formData.priority
      };

      await axios.put(`${API_URL}/tasks/${editingTask._id}`, taskData, axiosConfig);
      toast.success('Task updated successfully!', { position: 'top-right', autoClose: 2000 });
      setShowEditModal(false);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task', { position: 'top-right' });
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, axiosConfig);
      toast.success('Task deleted successfully!', { position: 'top-right', autoClose: 2000 });
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task', { position: 'top-right' });
      console.error('Error deleting task:', error);
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await axios.put(`${API_URL}/tasks/${task._id}`, { status: newStatus }, axiosConfig);
      toast.success(`Task marked as ${newStatus}!`, { position: 'top-right', autoClose: 2000 });
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task status', { position: 'top-right' });
      console.error('Error updating task status:', error);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      taskName: task.taskName,
      subject: task.subject,
      estimatedTime: task.estimatedTime.toString(),
      priority: task.priority.toLowerCase()
    });
    setShowEditModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info('Logged out successfully!', { position: 'top-right' });
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  };

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'All' || task.priority.toLowerCase() === priorityFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Analytics
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const completedTime = tasks.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.estimatedTime, 0);
  const progressPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const subjectData = tasks.reduce((acc, task) => {
    const existing = acc.find(item => item.subject === task.subject);
    if (existing) {
      existing.hours += task.estimatedTime;
    } else {
      acc.push({ subject: task.subject, hours: task.estimatedTime });
    }
    return acc;
  }, []);

  const priorityColors = {
    high: { bg: 'bg-red-500', border: 'border-red-500', dot: '🔴' },
    medium: { bg: 'bg-yellow-500', border: 'border-yellow-500', dot: '🟡' },
    low: { bg: 'bg-green-500', border: 'border-green-500', dot: '🟢' }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-[#1B4965]' : 'bg-[#BEE9E8]'}`}>
      <ToastContainer />
      
      {/* Header */}
      <header className={`${darkMode ? 'bg-[#1B4965]' : 'bg-[#62B6CB]'} sticky top-0 z-40 shadow-lg transition-all duration-500`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-[#1B4965]" />
              </div>
              <h1 className="text-2xl font-bold text-white">Smart Study Tracker</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-lg transition-all duration-300 ${darkMode ? 'bg-[#CAE9FF] text-[#1B4965]' : 'bg-[#1B4965] text-white'} hover:scale-110`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={handleLogout}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-[#1B4965] hover:bg-[#133a52]'} text-white hover:scale-105`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`${darkMode ? 'bg-white/10 backdrop-blur-md' : 'bg-white'} rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Tasks</p>
                <p className="text-4xl font-bold mt-2">{tasks.length}</p>
              </div>
              <div className="bg-[#62B6CB] p-3 rounded-xl">
                <Target className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-white/10 backdrop-blur-md' : 'bg-white'} rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Completed</p>
                <p className="text-4xl font-bold mt-2 text-green-500">{completedTasks}</p>
              </div>
              <div className="bg-green-500 p-3 rounded-xl">
                <Check className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-white/10 backdrop-blur-md' : 'bg-white'} rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pending</p>
                <p className="text-4xl font-bold mt-2 text-yellow-500">{pendingTasks}</p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-xl">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-white/10 backdrop-blur-md' : 'bg-white'} rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Progress</p>
                <p className="text-4xl font-bold mt-2 text-[#5FA8D3]">{progressPercentage}%</p>
              </div>
              <div className="bg-[#5FA8D3] p-3 rounded-xl">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`${darkMode ? 'bg-white/10 backdrop-blur-md' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Overall Progress</h3>
            <span className="text-sm font-medium">{completedTasks}/{tasks.length} tasks</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#62B6CB] to-[#5FA8D3] h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Study Analytics */}
        <div className={`${darkMode ? 'bg-white/10 backdrop-blur-md' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              📊 Study Analytics
            </h2>
            <button className={`text-sm font-medium ${darkMode ? 'text-[#CAE9FF]' : 'text-[#1B4965]'}`}>
              Show
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff20' : '#00000020'} />
                  <XAxis dataKey="subject" stroke={darkMode ? '#fff' : '#1B4965'} />
                  <YAxis stroke={darkMode ? '#fff' : '#1B4965'} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#1B4965' : '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Bar dataKey="hours" fill="#62B6CB" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Completed', value: completedTasks },
                      { name: 'Pending', value: pendingTasks }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#1B4965' : '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Add Task Section */}
        {showAddTask && (
          <div className={`${darkMode ? 'bg-white/10 backdrop-blur-md' : 'bg-white'} rounded-2xl p-6 shadow-lg animate-fadeIn`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" /> Add New Task
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Task Name *"
                value={formData.taskName}
                onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                className={`px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-white/5 border-white/20 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#62B6CB] transition-all`}
              />
              <input
                type="text"
                placeholder="Subject *"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className={`px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-white/5 border-white/20 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#62B6CB] transition-all`}
              />
              <input
                type="number"
                placeholder="Estimated Time (hrs) *"
                value={formData.estimatedTime}
                onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                className={`px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-white/5 border-white/20 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#62B6CB] transition-all`}
              />
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className={`px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#62B6CB] transition-all`}
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
            </div>
            <button
              onClick={handleAddTask}
              className="mt-4 w-full bg-[#62B6CB] hover:bg-[#5FA8D3] text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
            >
              Add Task
            </button>
          </div>
        )}

        {/* Tasks Section */}
        <div className={`${darkMode ? 'bg-white/10 backdrop-blur-md' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              📚 Your Tasks
            </h2>
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="bg-[#62B6CB] hover:bg-[#5FA8D3] text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add New Task
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-white/5 border-white/20 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#62B6CB] transition-all`}
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <div className="flex gap-2">
                  {['All', 'Pending', 'Completed'].map(status => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        statusFilter === status
                          ? 'bg-[#62B6CB] text-white'
                          : darkMode
                          ? 'bg-white/5 hover:bg-white/10'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Priority:</span>
                <div className="flex gap-2">
                  {['All', 'High', 'Medium', 'Low'].map(priority => (
                    <button
                      key={priority}
                      onClick={() => setPriorityFilter(priority)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        priorityFilter === priority
                          ? 'bg-[#62B6CB] text-white'
                          : darkMode
                          ? 'bg-white/5 hover:bg-white/10'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {priority === 'High' && '🔴'} {priority === 'Medium' && '🟡'} {priority === 'Low' && '🟢'} {priority}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}
                >
                  <option value="None">None</option>
                  <option value="Priority">Priority</option>
                  <option value="Time">Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#62B6CB] border-t-transparent mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading tasks...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No tasks found. Add your first task!</p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div
                  key={task._id}
                  className={`${darkMode ? 'bg-white/5' : 'bg-gray-50'} border-l-4 ${priorityColors[task.priority.toLowerCase()].border} rounded-lg p-4 hover:shadow-md transition-all duration-300 group`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleTaskStatus(task)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.status === 'completed'
                          ? 'bg-green-500 border-green-500'
                          : darkMode
                          ? 'border-gray-500 hover:border-green-500'
                          : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {task.status === 'completed' && <Check className="w-4 h-4 text-white" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-lg ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                        {task.taskName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm">
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                          📚 {task.subject}
                        </span>
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                          ⏱️ {task.estimatedTime}h estimated
                        </span>
                        <span className={`${priorityColors[task.priority.toLowerCase()].bg} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                          {priorityColors[task.priority.toLowerCase()].dot} {task.priority}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowPomodoroModal(true);
                        }}
                        className="p-2 rounded-lg bg-[#62B6CB] hover:bg-[#5FA8D3] text-white transition-all"
                        title="Start Pomodoro"
                      >
                        <Timer className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openEditModal(task)}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                      >
                        <Edit2 className="w-5 h-5 text-orange-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Edit Task Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className={`${darkMode ? 'bg-[#1B4965]' : 'bg-white'} rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Edit2 className="w-6 h-6 text-orange-500" /> Edit Task
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTask(null);
                }}
                className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-red-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Task Name *</label>
                <input
                  type="text"
                  value={formData.taskName}
                  onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#62B6CB] transition-all`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#62B6CB] transition-all`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Estimated Time (hours) *</label>
                <input
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#62B6CB] transition-all`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#62B6CB] transition-all`}
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTask(null);
                  }}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditTask}
                  className="flex-1 bg-[#62B6CB] hover:bg-[#5FA8D3] text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pomodoro Modal */}
      {showPomodoroModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className={`${darkMode ? 'bg-[#1B4965]' : 'bg-white'} rounded-3xl p-8 max-w-lg w-full shadow-2xl`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                ⏰ Pomodoro Timer
              </h3>
              <button
                onClick={() => {
                  setShowPomodoroModal(false);
                  setIsRunning(false);
                  handlePomodoroMode('work');
                }}
                className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {selectedTask && (
              <div className={`${darkMode ? 'bg-white/10' : 'bg-gray-50'} rounded-2xl p-4 mb-6`}>
                <h4 className="font-semibold text-lg">{selectedTask.taskName}</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                  {selectedTask.subject} • {selectedTask.estimatedTime}h estimated
                </p>
              </div>
            )}

            <div className="text-center mb-8">
              <div className="mb-4">
                <button
                  onClick={() => handlePomodoroMode('work')}
                  className={`px-6 py-2 rounded-l-xl font-medium transition-all ${
                    pomodoroMode === 'work'
                      ? 'bg-[#62B6CB] text-white'
                      : darkMode
                      ? 'bg-white/10 hover:bg-white/20'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  🎯 Focus Time
                </button>
                <button
                  onClick={() => handlePomodoroMode('shortBreak')}
                  className={`px-6 py-2 font-medium transition-all ${
                    pomodoroMode === 'shortBreak'
                      ? 'bg-green-500 text-white'
                      : darkMode
                      ? 'bg-white/10 hover:bg-white/20'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  ☕ Break
                </button>
                <button
                  onClick={() => handlePomodoroMode('longBreak')}
                  className={`px-6 py-2 rounded-r-xl font-medium transition-all ${
                    pomodoroMode === 'longBreak'
                      ? 'bg-blue-500 text-white'
                      : darkMode
                      ? 'bg-white/10 hover:bg-white/20'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  🌟 Long Break
                </button>
              </div>

              <div className="relative w-64 h-64 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke={darkMode ? '#ffffff20' : '#00000010'}
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke={pomodoroMode === 'work' ? '#62B6CB' : '#10b981'}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 120}`}
                    strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-6xl font-bold ${pomodoroMode === 'work' ? 'text-[#62B6CB]' : 'text-green-500'}`}>
                      {formatTime(pomodoroTime)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center mb-6">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`${pomodoroMode === 'work' ? 'bg-[#62B6CB] hover:bg-[#5FA8D3]' : 'bg-green-500 hover:bg-green-600'} text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2`}
                >
                  {isRunning ? (
                    <>
                      <PauseCircle className="w-6 h-6" /> Pause
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-6 h-6" /> Start
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsRunning(false);
                    handlePomodoroMode(pomodoroMode);
                  }}
                  className={`${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'} px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2`}
                >
                  <RotateCcw className="w-6 h-6" /> Reset
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>MODE</p>
                  <p className="font-semibold capitalize">{pomodoroMode === 'work' ? 'Work' : pomodoroMode === 'shortBreak' ? 'Short Break' : 'Long Break'}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>DURATION</p>
                  <p className="font-semibold">{pomodoroMode === 'work' ? '25' : pomodoroMode === 'shortBreak' ? '5' : '15'} min</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>PROGRESS</p>
                  <p className="font-semibold">{Math.round(progress)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;