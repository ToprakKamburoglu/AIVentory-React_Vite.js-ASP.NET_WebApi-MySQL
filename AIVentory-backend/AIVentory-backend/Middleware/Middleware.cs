using System.Net;
using System.Text.Json;
using AIVentory.API.Models.Common;
using AIVentory.API.Helpers;
using System.Security.Claims;
using Microsoft.Extensions.Caching.Memory;

namespace AIVentory.API.Middleware
{
    
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var response = context.Response;
            response.ContentType = "application/json";

          
            var errorResponse = new ErrorResponse("")
            {
                Message = "An error occurred while processing your request.",
                Path = context.Request.Path,
                TraceId = context.TraceIdentifier
            };

            switch (exception)
            {
                case ArgumentException:
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    errorResponse.Message = exception.Message;
                    errorResponse.StatusCode = (int)HttpStatusCode.BadRequest;
                    break;

                case UnauthorizedAccessException:
                    response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    errorResponse.Message = "Unauthorized access";
                    errorResponse.StatusCode = (int)HttpStatusCode.Unauthorized;
                    break;

                case KeyNotFoundException:
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                    errorResponse.Message = "Resource not found";
                    errorResponse.StatusCode = (int)HttpStatusCode.NotFound;
                    break;

                case InvalidOperationException:
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    errorResponse.Message = exception.Message;
                    errorResponse.StatusCode = (int)HttpStatusCode.BadRequest;
                    break;

                case TimeoutException:
                    response.StatusCode = (int)HttpStatusCode.RequestTimeout;
                    errorResponse.Message = "Request timeout";
                    errorResponse.StatusCode = (int)HttpStatusCode.RequestTimeout;
                    break;

                default:
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    errorResponse.Message = "Internal server error";
                    errorResponse.StatusCode = (int)HttpStatusCode.InternalServerError;
                    errorResponse.Errors.Add(exception.Message);
                    break;
            }

            var jsonResponse = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await response.WriteAsync(jsonResponse);
        }
    }

  
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<JwtMiddleware> _logger;

        public JwtMiddleware(RequestDelegate next, ILogger<JwtMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, JwtHelper jwtHelper)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (!string.IsNullOrEmpty(token))
            {
                try
                {
                    var principal = jwtHelper.ValidateToken(token);
                    if (principal != null)
                    {
                        context.User = principal;

                       
                        var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier);
                        var emailClaim = principal.FindFirst(ClaimTypes.Email);
                        var roleClaim = principal.FindFirst(ClaimTypes.Role);
                        var companyIdClaim = principal.FindFirst("CompanyId");

                        if (userIdClaim != null)
                            context.Items["UserId"] = int.Parse(userIdClaim.Value);
                        if (emailClaim != null)
                            context.Items["UserEmail"] = emailClaim.Value;
                        if (roleClaim != null)
                            context.Items["UserRole"] = roleClaim.Value;
                        if (companyIdClaim != null)
                            context.Items["CompanyId"] = int.Parse(companyIdClaim.Value);

                       
                        var expiry = jwtHelper.GetTokenExpiry(token);
                        if (expiry != DateTime.MinValue && expiry.Subtract(DateTime.UtcNow).TotalMinutes < 15)
                        {
                            context.Response.Headers.Add("X-Token-Expiring", "true");
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Invalid JWT token");
                  
                }
            }

            await _next(context);
        }
    }

 
    public class LoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<LoggingMiddleware> _logger;

        public LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var startTime = DateTime.UtcNow;
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

           
            using (_logger.BeginScope("RequestId: {RequestId}", context.TraceIdentifier))
            {
                try
                {
                  
                    await LogRequestAsync(context);

                  
                    await _next(context);

                 
                    stopwatch.Stop();
                    LogResponse(context, stopwatch.ElapsedMilliseconds, startTime);
                }
                catch (Exception ex)
                {
                    stopwatch.Stop();
                    _logger.LogError(ex, "Request failed after {ElapsedMs}ms", stopwatch.ElapsedMilliseconds);
                    throw;
                }
            }
        }

        private async Task LogRequestAsync(HttpContext context)
        {
            var request = context.Request;

            var logData = new
            {
                Method = request.Method,
                Path = request.Path.Value,
                QueryString = request.QueryString.Value,
                Headers = request.Headers.Where(h => !h.Key.Equals("Authorization", StringComparison.OrdinalIgnoreCase))
                    .ToDictionary(h => h.Key, h => h.Value.ToString()),
                UserAgent = request.Headers["User-Agent"].ToString(),
                RemoteIpAddress = context.Connection.RemoteIpAddress?.ToString(),
                UserId = context.Items["UserId"]?.ToString(),
                UserRole = context.Items["UserRole"]?.ToString(),
                CompanyId = context.Items["CompanyId"]?.ToString()
            };

            _logger.LogInformation("HTTP Request: {@RequestData}", logData);

          
            if ((request.Method == "POST" || request.Method == "PUT") &&
                !request.Path.Value!.Contains("auth", StringComparison.OrdinalIgnoreCase) &&
                !request.Path.Value.Contains("password", StringComparison.OrdinalIgnoreCase) &&
                request.ContentLength > 0 && request.ContentLength < 1024 * 10) 
            {
                request.EnableBuffering();
                var body = await new StreamReader(request.Body).ReadToEndAsync();
                request.Body.Position = 0;

                if (!string.IsNullOrEmpty(body))
                {
                    _logger.LogDebug("Request Body: {RequestBody}", body);
                }
            }
        }

        private void LogResponse(HttpContext context, long elapsedMs, DateTime startTime)
        {
            var response = context.Response;
            var user = context.User;

            var logData = new
            {
                StatusCode = response.StatusCode,
                ElapsedMilliseconds = elapsedMs,
                ContentType = response.ContentType,
                ContentLength = response.ContentLength,
                UserId = context.Items["UserId"]?.ToString(),
                UserRole = context.Items["UserRole"]?.ToString(),
                CompanyId = context.Items["CompanyId"]?.ToString(),
                StartTime = startTime,
                EndTime = DateTime.UtcNow
            };

            var logLevel = response.StatusCode >= 400 ? LogLevel.Warning : LogLevel.Information;
            _logger.Log(logLevel, "HTTP Response: {@ResponseData}", logData);

          
            if (elapsedMs > 5000) 
            {
                _logger.LogWarning("Slow request detected: {Method} {Path} took {ElapsedMs}ms",
                    context.Request.Method, context.Request.Path, elapsedMs);
            }
        }
    }


    public class RateLimitingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RateLimitingMiddleware> _logger;
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _configuration;

        public RateLimitingMiddleware(RequestDelegate next, ILogger<RateLimitingMiddleware> logger,
            IMemoryCache cache, IConfiguration configuration)
        {
            _next = next;
            _logger = logger;
            _cache = cache;
            _configuration = configuration;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var isEnabled = _configuration.GetValue<bool>("Security:EnableRateLimiting");
            if (!isEnabled)
            {
                await _next(context);
                return;
            }

            var identifier = GetIdentifier(context);
            var key = $"rate_limit_{identifier}";

            var requests = _cache.GetOrCreate(key, entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(
                    _configuration.GetValue<int>("Security:RateLimitPeriodInMinutes"));
                return new List<DateTime>();
            });

            var now = DateTime.UtcNow;
            var periodMinutes = _configuration.GetValue<int>("Security:RateLimitPeriodInMinutes");
            var maxRequests = _configuration.GetValue<int>("Security:RateLimitRequests");

          
            requests!.RemoveAll(r => r < now.AddMinutes(-periodMinutes));

            if (requests.Count >= maxRequests)
            {
                _logger.LogWarning("Rate limit exceeded for {Identifier}", identifier);

                context.Response.StatusCode = 429; 
                context.Response.Headers.Add("Retry-After", (periodMinutes * 60).ToString());

              
                var errorResponse = new ErrorResponse("")
                {
                    Message = "An error occurred while processing your request.",
                    Path = context.Request.Path,
                    TraceId = context.TraceIdentifier
                };

                var jsonResponse = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                await context.Response.WriteAsync(jsonResponse);
                return;
            }

            requests.Add(now);
            _cache.Set(key, requests);

            await _next(context);
        }

        private static string GetIdentifier(HttpContext context)
        {
         
            var userId = context.Items["UserId"]?.ToString();
            if (!string.IsNullOrEmpty(userId))
                return $"user_{userId}";

            var ipAddress = context.Connection.RemoteIpAddress?.ToString();
            return $"ip_{ipAddress}";
        }
    }

   
    public class CorsMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;

        public CorsMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var origin = context.Request.Headers["Origin"].ToString();
            var allowedOrigins = _configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

            if (!string.IsNullOrEmpty(origin) && (allowedOrigins.Contains("*") || allowedOrigins.Contains(origin)))
            {
                context.Response.Headers.Add("Access-Control-Allow-Origin", origin);
                context.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
                context.Response.Headers.Add("Access-Control-Allow-Headers",
                    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
                context.Response.Headers.Add("Access-Control-Allow-Methods",
                    "GET, POST, PUT, DELETE, OPTIONS");
            }

            if (context.Request.Method == "OPTIONS")
            {
                context.Response.StatusCode = 200;
                await context.Response.WriteAsync("");
                return;
            }

            await _next(context);
        }
    }


    public class SecurityHeadersMiddleware
    {
        private readonly RequestDelegate _next;

        public SecurityHeadersMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
          
            if (!context.Response.Headers.ContainsKey("X-Content-Type-Options"))
                context.Response.Headers.Add("X-Content-Type-Options", "nosniff");

            if (!context.Response.Headers.ContainsKey("X-Frame-Options"))
                context.Response.Headers.Add("X-Frame-Options", "DENY");

            if (!context.Response.Headers.ContainsKey("X-XSS-Protection"))
                context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");

            if (!context.Response.Headers.ContainsKey("Referrer-Policy"))
                context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");

            if (!context.Response.Headers.ContainsKey("Content-Security-Policy"))
                context.Response.Headers.Add("Content-Security-Policy",
                    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;");

            await _next(context);
        }
    }

  
    public class RequestIdMiddleware
    {
        private readonly RequestDelegate _next;

        public RequestIdMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
           
            if (string.IsNullOrEmpty(context.TraceIdentifier))
            {
                context.TraceIdentifier = Guid.NewGuid().ToString();
            }

            context.Response.Headers.Add("X-Request-ID", context.TraceIdentifier);

            await _next(context);
        }
    }
}