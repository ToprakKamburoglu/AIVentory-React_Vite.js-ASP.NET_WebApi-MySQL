using Microsoft.AspNetCore.Mvc;

namespace AIVentory_backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { message = "API is working!" });
        }
    }
}