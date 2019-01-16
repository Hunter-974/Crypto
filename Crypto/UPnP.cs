using System;

using Mono.Nat;

namespace Crypto
{
    public static class UPnP
    {
        public static void ConfigureForwarding()
        {
            NatUtility.DeviceFound += DeviceFound;
            NatUtility.DeviceLost += DeviceLost;
            NatUtility.StartDiscovery();


            NatUtility.UnhandledException += NatUtility_UnhandledException;
            Console.WriteLine("Recherche lancée...");
        }

        static void NatUtility_UnhandledException(object sender, UnhandledExceptionEventArgs args)
        {
            Console.WriteLine(args.ExceptionObject);
        }


        private static void DeviceFound(object sender, DeviceEventArgs args)
        {
            INatDevice device = args.Device;

            int port = 80;

            while(device.GetSpecificMapping(Protocol.Tcp, port).PublicPort != -1)
            {
                port++;
                Console.WriteLine("Port changé pour " + port);
            }

            device.CreatePortMap(new Mapping(Protocol.Tcp, port, port));

            Console.WriteLine("Port ouvert sur:"+device.GetExternalIP().ToString());
        }

        private static void DeviceLost(object sender, DeviceEventArgs args)
        {
            INatDevice device = args.Device;

        }


    }
}
