using Hashgard.Back.Db;

namespace Hashgard.Back.Services.Abstract
{
    public abstract class BaseService
    {
        protected HashgardContext HashgardContext { get; set; }

        protected BaseService(HashgardContext context)
        {
            HashgardContext = context;
        }
    }
}
