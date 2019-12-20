using Chromely.Core.RestfulService;
using System.Configuration;

namespace ClinicApp.Controllers
{
    [ControllerProperty(Name = "AppController", Route = "app")]
    public class AppController : ChromelyController
    {
        public AppController()
        {
            RegisterGetRequest("/app/configuration", GetAppConfiguration);
        }

        private ChromelyResponse GetAppConfiguration(ChromelyRequest request)
        {

            string apiUrl = ConfigurationManager.AppSettings.Get("DRKHOACLINICAPP_APIURL");
            string clientSecret = ConfigurationManager.AppSettings.Get("DRKHOACLINICAPP_SECRET");

            ChromelyResponse response = new ChromelyResponse(request.Id)
            {
                Data = new
                {
                    ApiUrl = apiUrl,
                    Secret = clientSecret,
                }
            };

            return response;
        }
    }
}
