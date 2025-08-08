namespace AIVentory_backend.Services.Interfaces
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(string to, string subject, string body, bool isHtml = true);
        Task<bool> SendPasswordResetEmailAsync(string email, string resetToken);
        Task<bool> SendWelcomeEmailAsync(string email, string firstName, string tempPassword);
        Task<bool> SendLowStockAlertAsync(string email, string productName, int currentStock);
    }
}