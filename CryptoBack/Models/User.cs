using CryptoBack.Models.Abstract;
using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

namespace CryptoBack.Models
{
    public class User : Entity
    {
        [Required]
        public string Name { get; set; }

        [Required, JsonIgnore]
        public string Password { get; set; }

        public string Location { get; set; }

        [JsonIgnore]
        public DateTime SignInDate { get; set; }

        [JsonIgnore]
        public TimeSpan SessionLifetime { get; set; }

        [JsonIgnore]
        public Guid? Token { get; set; }

        [JsonIgnore]
        public DateTime? LogInDate { get; set; }
        

        public bool HasAliveSession()
        {
            return LogInDate + SessionLifetime > DateTime.Now;
        }

        public void SetLoggedIn()
        {
            LogInDate = DateTime.Now;
            Token = Guid.NewGuid();
        }

        public void SetLoggedOut()
        {
            LogInDate = null;
            Token = null;
        }
    }
}
