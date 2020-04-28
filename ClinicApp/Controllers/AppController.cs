using Chromely.Core.RestfulService;
using ClinicApp.Core;

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

            string apiUrl = ConfigurationValues.ApiUrl;
            string clientSecret = ConfigurationValues.ClientSecret;

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
