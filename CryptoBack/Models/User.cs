using CryptoBack.Models.Abstract;
using System;
using System.ComponentModel.DataAnnotations;

namespace CryptoBack.Models
{
    public class User : Entity
    {
        [Required]
        public byte[] Name { get; set; }

        [Required]
        public byte[] Password { get; set; }

        public byte[] Location { get; set; }

        public DateTime SignInDate { get; set; }

        public TimeSpan SessionLifetime { get; set; }

        public Guid? Token { get; set; }

        public DateTime? LogInDate { get; set; }


        public bool HasName(byte[] name)
        {
            return Name.UnsafeCompare(name);
        }

        public bool HasNameAndPassword(byte[] name, byte[] password)
        {
            bool hasName = HasName(name);
            bool hasPassword = false;

            if (hasName)
            {
                hasPassword = Password.UnsafeCompare(password);
            }

            return hasName && hasPassword;
        }

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
