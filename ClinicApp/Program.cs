using Chromely.CefSharp.Winapi;
using Chromely.CefSharp.Winapi.BrowserWindow;
using Chromely.Core;
using Chromely.Core.Host;
using Chromely.Core.Infrastructure;
using ClinicApp.Core;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;

namespace ClinicApp
{
    [SuppressMessage("StyleCop.CSharp.MaintainabilityRules", "SA1400:AccessModifierMustBeDeclared", Justification = "Reviewed. Suppression is OK here.")]
    public class Program
    {
        public static int Main(string[] args)
        {
            try
            {
                HostHelpers.SetupDefaultExceptionHandlers();

                string startUrl = "local://dist/index.html";

                string debuggingMode = ConfigurationValues.DebuggingMode;
                bool.TryParse(debuggingMode, out bool isDebuggingMode);

                ChromelyConfiguration config = ChromelyConfiguration
                                              .Create()
                                              .WithAppArgs(args)
                                              .WithHostSize(1200, 900)
                                              .WithHostMode(WindowState.Maximize, true)
                                              .WithHostTitle("Dr.KHOA Clinic")
                                              .WithHostIconFile("app.ico")
                                              .WithStartUrl(startUrl)
                                              .WithLogFile("logs\\app.log")
                                              .WithLogSeverity(LogSeverity.Info)
                                              .WithDebuggingMode(isDebuggingMode)
                                              .UseDefaultLogger("logs\\app.log")
                                              .UseDefaultResourceSchemeHandler("local", string.Empty)
                                              .UseDefaultHttpSchemeHandler("http", "clinicapp.com")
                                              .UseDefaultJsHandler("boundControllerAsync", true);

                using (var window = ChromelyWindow.Create(config))
                {
                    window.RegisterServiceAssembly(Assembly.GetExecutingAssembly());
                    window.ScanAssemblies();

                    return window.Run(args);
                }
            }
            catch (Exception exception)
            {
                Log.Error(exception);
            }

            return 0;
        }
    }
}
