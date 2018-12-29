using CryptoBack.Db;

namespace CryptoBack.Services.Abstract
{
    public abstract class BaseService
    {
        protected Context Context { get; set; }

        protected BaseService(Context context)
        {
            Context = context;
        }
    }
}
