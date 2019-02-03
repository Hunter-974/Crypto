using Crypto.Back.Db;

namespace Crypto.Back.Services.Abstract
{
    public abstract class BaseService
    {
        protected CryptoDbContext CryptoDbContext { get; set; }

        protected BaseService(CryptoDbContext cryptoDbContext)
        {
            CryptoDbContext = cryptoDbContext;
        }
    }
}
