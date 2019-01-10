namespace Crypto.Back.Requests
{
    public class CreateArticleRequest : EditArticleRequest
    {
        public long CategoryId { get; set; }
    }
}
