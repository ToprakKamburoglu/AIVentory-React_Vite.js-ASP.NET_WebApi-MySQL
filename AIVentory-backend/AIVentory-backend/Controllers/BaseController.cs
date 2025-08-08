
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace AIVentory_backend.Controllers
{
    [ApiController]
    [Authorize] 
    public class BaseController : ControllerBase
    {
       
        protected int GetUserId()
        {
            var userIdClaim = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }
            throw new UnauthorizedAccessException("Kullanıcı ID'si alınamadı");
        }

        protected int GetCompanyId()
        {
            var companyIdClaim = User?.FindFirst("CompanyId")?.Value;
            if (int.TryParse(companyIdClaim, out int companyId))
            {
                return companyId;
            }
            throw new UnauthorizedAccessException("Company ID alınamadı");
        }

        
        protected string GetUserEmail()
        {
            return User?.FindFirst(ClaimTypes.Email)?.Value ?? throw new UnauthorizedAccessException("Email alınamadı");
        }

        
        protected string GetUserRole()
        {
            return User?.FindFirst(ClaimTypes.Role)?.Value ?? throw new UnauthorizedAccessException("Role alınamadı");
        }

       
        protected string GetUserName()
        {
            return User?.FindFirst(ClaimTypes.Name)?.Value ?? throw new UnauthorizedAccessException("Kullanıcı adı alınamadı");
        }

      
        protected bool IsAdmin()
        {
            return GetUserRole().Equals("admin", StringComparison.OrdinalIgnoreCase);
        }

       
        protected bool IsManager()
        {
            return GetUserRole().Equals("manager", StringComparison.OrdinalIgnoreCase);
        }

        protected bool IsEmployee()
        {
            return GetUserRole().Equals("employee", StringComparison.OrdinalIgnoreCase);
        }

     
        protected ActionResult SuccessResponse(object data = null, string message = "İşlem başarılı")
        {
            return Ok(new
            {
                success = true,
                message = message,
                data = data
            });
        }

       
        protected ActionResult ErrorResponse(string message, int statusCode = 400, object errors = null)
        {
            var response = new
            {
                success = false,
                message = message,
                errors = errors
            };

            return statusCode switch
            {
                400 => BadRequest(response),
                401 => Unauthorized(response),
                403 => Forbid(),
                404 => NotFound(response),
                500 => StatusCode(500, response),
                _ => BadRequest(response)
            };
        }
    }
}