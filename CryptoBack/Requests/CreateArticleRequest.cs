namespace CryptoBack.Requests
{
    public class CreateArticleRequest : EditArticleRequest
    {
        public long CategoryId { get; set; }
    }
}
