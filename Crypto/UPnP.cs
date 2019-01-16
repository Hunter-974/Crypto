using System;

using Open.Nat;

namespace Crypto
{
    public static class UPnP
    {
        public async static void ConfigureForwarding(int localPort, int remotePort)
        {
            var discoverer = new NatDiscoverer();
            var cts = new System.Threading.CancellationTokenSource(10000);
            try
            {
                var device = await discoverer.DiscoverDeviceAsync(PortMapper.Upnp, cts);
                var ip = await device.GetExternalIPAsync();
                await device.CreatePortMapAsync(new Mapping(Protocol.Tcp, localPort, remotePort, "Crypto"));
                Console.WriteLine("L'Adresse URL à communiquer à vos amis est http://{0}", ip);
            }
            catch(NatDeviceNotFoundException)
            {
                Console.WriteLine("Impossible d'ouvrir la correspondance " + localPort + ":" + remotePort + ". Vos amis pourraient ne pas pouvoir accéder à vos ressources.");
            }
        }



    }
}
