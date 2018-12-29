namespace CryptoBack.Requests
{
    public class SignInRequest : LogInRequest
    {
        public byte[] Location { get; set; }
    }
}
