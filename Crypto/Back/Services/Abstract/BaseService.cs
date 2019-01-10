using Crypto.Back.Db;

namespace Crypto.Back.Services.Abstract
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
