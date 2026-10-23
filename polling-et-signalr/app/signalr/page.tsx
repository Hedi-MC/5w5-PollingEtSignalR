"use client";

import React from "react";
import { useEffect } from "react";
import { UselessTask } from "../models/UselessTask";
import TaskView from "../_components/tasks-view";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr"; //npm install @microsoft/signalr avant!

export default function Home() {
const [hubConnection, setHubConnection] = React.useState<HubConnection>();
  const [tasks, setTasks] = React.useState<UselessTask[]>([]);
   const [usercount, setUserCount] = React.useState<number>(0); //le user count!

  useEffect(() => {
      connecttohub();
    }, []);

  function connecttohub() {
    let testTasks = new Array<UselessTask>(
          { id: 1, text: "Test Task 1", completed: false },
          { id: 2, text: "Test Task 2", completed: true });
        setTasks(testTasks);
    // TODO On doit commencer par créer la connexion vers le Hub
    let newHubConnection = new HubConnectionBuilder()
                              .withUrl('http://localhost:5042/tasks')
                              .build();
    


                              
    // TODO On peut commencer à écouter pour les messages qui vont déclencher des callbacks (Il y a seulement un message pour commencer)
     newHubConnection.on('TaskList', (data) => {  //Pour get la TaskList
        // data a le même type que ce qui a été envoyé par le serveur
        console.log(data);
    });

     newHubConnection.on('UserCount', (data) => { //pour get le usercount
      setUserCount(data);
    });

    // TODO On doit ensuite se connecter


    // Il faut écouter les messages avant de faire start() sur la connection. On ne risque pas d'avoir un problème où le message est reçu avant même d'avoir exécuté le .on
    // ATTENTION: Ce problème risque d'arriver beaucoup plus souvent dans une version DÉPLOYÉE de l'application

     newHubConnection
        .start()
        .then(() => {
            console.log('La connexion est active!');
             //on se connecte
          })
        .catch(err => console.log('Error while starting connection: ' + err));
        setHubConnection(newHubConnection);
  }

  function onTaskToggle(id: number) {
    // TODO On invoke la méthode pour compléter une tâche sur le serveur
    hubConnection!.invoke('CompleteTask', id);


    // let tasksCopy : UselessTask[] = [...tasks];    
    // tasksCopy.find(task => task.id === id)!.completed = true;
    // setTasks(tasksCopy); --USELESS
  }

  function handleTaskAdd(taskname: string) {
    // TODO On invoke la méthode pour ajouter une tâche sur le serveur
    hubConnection!.invoke('AddTask', taskname);
  }
  return (
    <div className="p-4">
        <h1>SignalR!</h1>
        <TaskView 
          tasks={tasks} 
          onTaskAdd={handleTaskAdd}
          onTaskToggle={onTaskToggle}
        />
        <p>Nombre d'utilisateurs connectés: {usercount}</p> 
        {/* On montre le user count */}
    </div>
  );
}