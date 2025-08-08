using AIVentory_backend.Helpers;
using AIVentory_backend.Services.Interfaces;

namespace AIVentory_backend.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JwtHelper _jwtHelper;

        public JwtMiddleware(RequestDelegate next, JwtHelper jwtHelper)
        {
            _next = next;
            _jwtHelper = jwtHelper;
        }

        public async Task Invoke(HttpContext context, IUserService userService)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            var userId = _jwtHelper.ValidateToken(token);

            if (userId != null)
            {

                context.Items["User"] = await userService.GetByIdAsync(userId.Value);
                context.Items["UserId"] = userId.Value;
            }

            await _next(context);
        }
    }
}