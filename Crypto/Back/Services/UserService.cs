using Crypto.Back.Db;
using Crypto.Back.Models;
using Crypto.Back.Results;
using Crypto.Back.Services.Abstract;
using System;
using System.Linq;

namespace Crypto.Back.Services
{
    public interface IUserService
    {
        LogInResponse SignUp(string name, string password, string location, TimeSpan sessionLifetime);
        LogInResponse LogIn(string name, string password, string location, TimeSpan sessionLifetime);
        void LogOut(Guid token);
        User GetAuthenticatedUser(Guid token);
    }

    public class UserService : BaseService, IUserService
    {
        public UserService(Context context) : base(context)
        {
        }

        public LogInResponse SignUp(string name, string password, string location, TimeSpan sessionLifetime)
        {
            if (Context.Users.Any(u => u.Name == name))
            {
                throw new Exception("Username already exists.");
            }

            var user = new User
            {
                Name = name,
                Password = password,
                Location = location,
                SessionLifetime = sessionLifetime,
                SignUpDate = DateTime.Now,
                LogInDate = DateTime.Now,
                Token = Guid.NewGuid()
            };
            Context.Users.Add(user);
            Context.SaveChanges();

            return new LogInResponse(user);
        }

        public LogInResponse LogIn(string name, string password, string location, TimeSpan sessionLifetime)
        {
            var user = Context.Users.FirstOrDefault(u => u.Name == name && u.Password == password);
            if (user == null)
            {
                throw new Exception("Authentication failed.");
            }

            user.Location = location;
            user.SessionLifetime = sessionLifetime;
            user.SetLoggedIn();
            Context.Users.Update(user);
            Context.SaveChanges();

            return new LogInResponse(user);
        }

        public void LogOut(Guid token)
        {
            var user = GetAuthenticatedUser(token);
            if (user != null)
            {
                SaveLoggedOut(user);
            }
        }

        public User GetAuthenticatedUser(Guid token)
        {
            var user = Context.Users.FirstOrDefault(u => u.Token == token);
            if (user != null && !user.HasAliveSession())
            {
                SaveLoggedOut(user);
                user = null;
            }
            return user;
        }

        private void SaveLoggedOut(User user)
        {
            user.SetLoggedOut();
            Context.Users.Update(user);
            Context.SaveChanges();
        }
    }
}
