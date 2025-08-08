using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AIVentory_backend.Data;
using AIVentory.API.Models.Common;

namespace AIVentory_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TestController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("db-connection")]
        public async Task<IActionResult> TestDbConnection()
        {
            try
            {
                var canConnect = await _context.Database.CanConnectAsync();
                var productCount = await _context.Products.CountAsync();

                return Ok(new
                {
                    canConnect = canConnect,
                    productCount = productCount,
                    connectionString = _context.Database.GetConnectionString()
                });
            }
            catch (Exception ex)
            {
                return Ok(new { error = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(new { message = "API is working!", timestamp = DateTime.Now });
        }
    }
}