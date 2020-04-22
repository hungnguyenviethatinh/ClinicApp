using Chromely.Core.RestfulService;
using ClinicApp.Core;
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

            string apiUrl = ConfigurationManager.AppSettings.Get(KeyConstants.ApiUrlKey);
            string clientSecret = ConfigurationManager.AppSettings.Get(KeyConstants.SecretKey);

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
