"use client";

import React, { useEffect } from "react";
import axios from "axios";
import TaskView from "../_components/tasks-view";
import { UselessTask } from "../models/UselessTask";

export default function Home() {
  const apiUrl = "http://localhost:5042/api/";
  const [tasks, setTasks] = React.useState<UselessTask[]>([]);

  useEffect(() => {
    updateTasks();
  }, []);

  async function handleTaskAdd(taskName: string) {
    // TODO On invoke la méthode pour ajouter une tâche sur le serveur (Contrôleur d'API)
    let newTasks=[...tasks];
    let result = await axios.post<UselessTask>(apiUrl+'UselessTasks/Add?taskText=' + taskName, null);
    newTasks.push(result.data);
    setTasks(newTasks);
  }

  function onTaskToggle(id: number) {
    // TODO On invoke la méthode pour compléter une tâche sur le serveur (Contrôleur d'API)

    let tasksCopy : UselessTask[] = [...tasks];    
    tasksCopy.find(task => task.id === id)!.completed = true;
    setTasks(tasksCopy);

        return axios.get<any>(apiUrl+'UselessTasks/Complete/' + id);
  }

  async function updateTasks() {
    // let testTasks = new Array<UselessTask>(
    //   { id: 1, text: "Test Task 1", completed: false },
    //   { id: 2, text: "Test Task 2", completed: true });
    // setTasks(testTasks);
    // TODO: Faire une première implémentation simple avec un appel au serveur pour obtenir la liste des tâches
    // TODO: UNE FOIS QUE VOUS AVEZ TESTER AVEC DEUX CLIENTS: Utiliser le polling pour mettre la liste de tasks à jour chaque seconde
    let result = await axios.get<UselessTask[]>(apiUrl+'UselessTasks/GetAll/')
    setTasks(result.data);
    setTimeout(updateTasks, 1000); ///Permet d'update intermitently les taches pour chaque clients histoire que ca sync -H

  }

  return (
    <div className="p-4">
        <h1>Polling!</h1>
        <TaskView 
          tasks={tasks} 
          onTaskAdd={handleTaskAdd}
          onTaskToggle={onTaskToggle}
        />
    </div>

  );
}