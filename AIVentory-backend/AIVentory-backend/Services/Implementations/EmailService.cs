using AIVentory_backend.Services.Interfaces;

namespace AIVentory_backend.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;

        public EmailService(ILogger<EmailService> logger)
        {
            _logger = logger;
        }

        public async Task<bool> SendEmailAsync(string to, string subject, string body, bool isHtml = true)
        {
           
            _logger.LogInformation("Email sent to {To} with subject {Subject}", to, subject);
            await Task.CompletedTask;
            return true;
        }

        public async Task<bool> SendPasswordResetEmailAsync(string email, string resetToken)
        {
            await Task.CompletedTask;
            return true;
        }

        public async Task<bool> SendWelcomeEmailAsync(string email, string firstName, string tempPassword)
        {
            await Task.CompletedTask;
            return true;
        }

        public async Task<bool> SendLowStockAlertAsync(string email, string productName, int currentStock)
        {
            await Task.CompletedTask;
            return true;
        }
    }
}