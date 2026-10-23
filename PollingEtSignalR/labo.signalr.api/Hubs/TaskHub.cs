using labo.signalr.api.Data;
using labo.signalr.api.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace labo.signalr.api.Hubs
{


    public static class UserHandler
    {
        public static HashSet<string> ConnectedIds = new HashSet<string>(); //idk how this works but its to count users ig
    }
    public class TaskHub: Hub
    {

        ApplicationDbContext _context;

        public TaskHub(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            UserHandler.ConnectedIds.Add(Context.ConnectionId); //on increment les users
            await Clients.All.SendAsync("UserCount", UserHandler.ConnectedIds.Count); //On envoi le user count à tous
            await Clients.Caller.SendAsync("TaskList", _context.UselessTasks.ToList()); //On envoi les tasks à la connexion
        }

        public async Task AddTask(string task)
        {
            _context.UselessTasks.Add(new UselessTask() { Text = task });
            _context.SaveChanges();
            await Clients.All.SendAsync("TaskList", _context.UselessTasks.ToList()); //On envoi les tasks à tout le monde
        }

        public async Task CompleteTask(int taskId)
        {
            var task = _context.UselessTasks.Single(t => t.Id == taskId); //on cherche la task via id
            task.Completed = true; //on le change à true
            _context.SaveChanges(); //on save
            await Clients.All.SendAsync("TaskList", _context.UselessTasks.ToList()); //on envoi les tasks a tout le monde
        }
        public async Task OnDisconnectAsync(Exception? exception)
        {
            UserHandler.ConnectedIds.Remove(Context.ConnectionId); //on remove la current connexion des connexionIds
            await Clients.All.SendAsync("UserCount", UserHandler.ConnectedIds.Count); //On envoi le nombre des connexions à tout le monde
            await base.OnDisconnectedAsync(exception); //On disconnect ig???


        }
    }
}
