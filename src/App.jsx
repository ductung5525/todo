import { useState, useEffect } from "react";
import { Tabs, Input, List, Button, Checkbox } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem = { id: uuidv4(), text: newTodo, completed: false };
      setTodos([...todos, newTodoItem]);
      setNewTodo("");
    }
  };

  const toggleComplete = (id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
  };

  const deleteTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };

  const deleteAllCompleted = () => {
    const newTodos = todos.filter((todo) => !todo.completed);
    setTodos(newTodos);
  };

  const filterTodos = (status) => {
    if (status === "all") return todos;
    return todos.filter((todo) =>
      status === "active" ? !todo.completed : todo.completed
    );
  };

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos"));
    if (storedTodos) {
      setTodos(storedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const renderTodoList = (status) => (
    <>
      {status !== "complete" && (
        <div style={{ display: "flex", marginBottom: 10 }}>
          <Input
            placeholder="add details"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onPressEnter={addTodo}
            style={{ marginRight: 10 }}
          />
          <Button type="primary" onClick={addTodo}>
            Add
          </Button>
        </div>
      )}
      <List
        dataSource={filterTodos(status)}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={
              item.completed
                ? [
                    <Button
                      key={item.id}
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => deleteTodo(item.id)}
                    />,
                  ]
                : []
            }
          >
            <Checkbox
              checked={item.completed}
              onChange={() => toggleComplete(item.id)}
              style={{ marginRight: 8 }}
            />
            <List.Item.Meta
              title={item.text}
              style={{
                textDecoration: item.completed ? "line-through" : "none",
              }}
            />
          </List.Item>
        )}
      />
      {status === "complete" && (
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}
        >
          <Button
            danger
            type="primary"
            onClick={deleteAllCompleted}
            icon={<DeleteOutlined />}
          >
            delete all
          </Button>
        </div>
      )}
    </>
  );

  const items = [
    {
      label: "All",
      key: "1",
      children: renderTodoList("all"),
    },
    {
      label: "Active",
      key: "2",
      children: renderTodoList("active"),
    },
    {
      label: "Complete",
      key: "3",
      children: renderTodoList("complete"),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>#todo</h1>
      <div
        style={{
          width: "100%",
          maxWidth: 500,
          padding: 20,
        }}
      >
        <Tabs defaultActiveKey="1" centered items={items} />
      </div>
    </div>
  );
}

export default App;
