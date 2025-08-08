using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;

namespace AIVentory.API.Helpers
{
 
    public class JwtHelper
    {
        private readonly IConfiguration _configuration;

        public JwtHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(int userId, string email, string role, int companyId)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var secretKey = Encoding.ASCII.GetBytes(jwtSettings["SecretKey"]!);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role),
                new Claim("CompanyId", companyId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat,
                    new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(),
                    ClaimValueTypes.Integer64)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(jwtSettings.GetValue<int>("ExpiryInHours")),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(secretKey),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        }

        public ClaimsPrincipal? ValidateToken(string token)
        {
            try
            {
                var jwtSettings = _configuration.GetSection("Jwt");
                var secretKey = Encoding.ASCII.GetBytes(jwtSettings["SecretKey"]!);

                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(secretKey),
                    ValidateIssuer = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidateAudience = true,
                    ValidAudience = jwtSettings["Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out _);
                return principal;
            }
            catch
            {
                return null;
            }
        }

        public bool IsTokenExpired(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token);
                return jwtToken.ValidTo < DateTime.UtcNow;
            }
            catch
            {
                return true;
            }
        }

        public DateTime GetTokenExpiry(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token);
                return jwtToken.ValidTo;
            }
            catch
            {
                return DateTime.MinValue;
            }
        }
    }

    public class PasswordHelper
    {
        public static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password, BCrypt.Net.BCrypt.GenerateSalt(12));
        }

        public static bool VerifyPassword(string password, string hash)
        {
            try
            {
                return BCrypt.Net.BCrypt.Verify(password, hash);
            }
            catch
            {
                return false;
            }
        }

        public static bool IsValidPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password) || password.Length < 6)
                return false;

     
            if (!password.Any(char.IsUpper))
                return false;

           
            if (!password.Any(char.IsDigit))
                return false;

            return true;
        }

        public static string GenerateRandomPassword(int length = 12)
        {
            const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*";
            var random = new Random();
            var result = new StringBuilder();

           
            result.Append(char.ToLower(validChars[random.Next(26, 52)])); 
            result.Append(validChars[random.Next(52, 62)]); 
            result.Append(char.ToLower(validChars[random.Next(0, 26)])); 

          
            for (int i = 3; i < length; i++)
            {
                result.Append(validChars[random.Next(validChars.Length)]);
            }

           
            var chars = result.ToString().ToCharArray();
            for (int i = 0; i < chars.Length; i++)
            {
                int randomIndex = random.Next(chars.Length);
                (chars[i], chars[randomIndex]) = (chars[randomIndex], chars[i]);
            }

            return new string(chars);
        }

        public static string GenerateSecureToken(int length = 32)
        {
            using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
            var bytes = new byte[length];
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes).Replace("+", "").Replace("/", "").Replace("=", "")[..length];
        }
    }


    public class FileHelper
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _environment;

        public FileHelper(IConfiguration configuration, IWebHostEnvironment environment)
        {
            _configuration = configuration;
            _environment = environment;
        }

        public async Task<string> SaveFileAsync(IFormFile file, string folder)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is required");

        
            var maxFileSize = _configuration.GetValue<long>("FileUpload:MaxFileSize");
            if (file.Length > maxFileSize)
                throw new ArgumentException($"File size exceeds maximum allowed size of {maxFileSize / (1024 * 1024)} MB");


            var allowedExtensions = _configuration.GetSection("FileUpload:AllowedExtensions").Get<string[]>() ?? Array.Empty<string>();
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
                throw new ArgumentException($"File type {fileExtension} is not allowed");

          
            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            var folderPath = Path.Combine(_environment.WebRootPath, "uploads", folder);

            Directory.CreateDirectory(folderPath);

          
            var filePath = Path.Combine(folderPath, fileName);
            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            
            return $"/uploads/{folder}/{fileName}";
        }

        public bool DeleteFile(string filePath)
        {
            try
            {
                if (string.IsNullOrEmpty(filePath))
                    return false;

                var fullPath = Path.Combine(_environment.WebRootPath, filePath.TrimStart('/'));
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        public bool FileExists(string filePath)
        {
            try
            {
                if (string.IsNullOrEmpty(filePath))
                    return false;

                var fullPath = Path.Combine(_environment.WebRootPath, filePath.TrimStart('/'));
                return File.Exists(fullPath);
            }
            catch
            {
                return false;
            }
        }

        public string GetFileSize(string filePath)
        {
            try
            {
                if (string.IsNullOrEmpty(filePath))
                    return "0 B";

                var fullPath = Path.Combine(_environment.WebRootPath, filePath.TrimStart('/'));
                if (!File.Exists(fullPath))
                    return "0 B";

                var fileInfo = new FileInfo(fullPath);
                return FormatFileSize(fileInfo.Length);
            }
            catch
            {
                return "0 B";
            }
        }

        public static string FormatFileSize(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB", "TB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len = len / 1024;
            }
            return $"{len:0.##} {sizes[order]}";
        }

        public async Task<byte[]> ReadFileAsync(string filePath)
        {
            try
            {
                if (string.IsNullOrEmpty(filePath))
                    return Array.Empty<byte>();

                var fullPath = Path.Combine(_environment.WebRootPath, filePath.TrimStart('/'));
                if (!File.Exists(fullPath))
                    return Array.Empty<byte>();

                return await File.ReadAllBytesAsync(fullPath);
            }
            catch
            {
                return Array.Empty<byte>();
            }
        }

        public string GetMimeType(string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            return extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".webp" => "image/webp",
                ".pdf" => "application/pdf",
                ".doc" => "application/msword",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".xls" => "application/vnd.ms-excel",
                ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                _ => "application/octet-stream"
            };
        }
    }

   
    public static class ValidationHelper
    {
        public static bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        public static bool IsValidPhone(string phone)
        {
            if (string.IsNullOrWhiteSpace(phone))
                return false;

          
            var cleanPhone = phone.Replace(" ", "").Replace("-", "").Replace("(", "").Replace(")", "");

            if (cleanPhone.StartsWith("+90"))
                cleanPhone = cleanPhone[3..];
            else if (cleanPhone.StartsWith("90"))
                cleanPhone = cleanPhone[2..];
            else if (cleanPhone.StartsWith("0"))
                cleanPhone = cleanPhone[1..];

            return cleanPhone.Length == 10 && cleanPhone.All(char.IsDigit) && cleanPhone.StartsWith("5");
        }

        public static bool IsValidTaxNumber(string taxNumber)
        {
            if (string.IsNullOrWhiteSpace(taxNumber) || taxNumber.Length != 10)
                return false;

            if (!taxNumber.All(char.IsDigit))
                return false;

          
            var digits = taxNumber.Select(c => int.Parse(c.ToString())).ToArray();
            var sum = 0;

            for (int i = 0; i < 9; i++)
            {
                var temp = (digits[i] + (10 - i)) % 10;
                sum += temp == 9 ? temp : (temp * (int)Math.Pow(2, 10 - i)) % 9;
            }

            var checkDigit = (10 - (sum % 10)) % 10;
            return checkDigit == digits[9];
        }

        public static string SanitizeInput(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return string.Empty;

            return input.Trim().Replace("<", "&lt;").Replace(">", "&gt;");
        }
    }
}