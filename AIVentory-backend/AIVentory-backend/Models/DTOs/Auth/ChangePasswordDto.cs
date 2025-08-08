using AIVentory_backend.Helpers;
using System.ComponentModel.DataAnnotations;

namespace AIVentory_backend.Models.DTOs.Auth
{
    public class ChangePasswordDto
    {

  [Required]

       [StringLength(100, MinimumLength = 6, ErrorMessage = "Şifre en az 6 karakter olmalıdır.")]
        public string OldPassword { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Yeni şifre en az 6 karakter olmalıdır.")]
        public string NewPassword { get; set; }
        [Required]
        [Compare("NewPassword", ErrorMessage = "Yeni şifreler eşleşmiyor.")]
        public string ConfirmNewPassword { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public string Token { get; set; }
        public ChangePasswordDto()
        {
            OldPassword = string.Empty;
            NewPassword = string.Empty;
            ConfirmNewPassword = string.Empty;
            Token = string.Empty;
        }
        public ChangePasswordDto(string oldPassword, string newPassword, string confirmNewPassword, int userId, string token)
        {
            OldPassword = oldPassword;
            NewPassword = newPassword;
            ConfirmNewPassword = confirmNewPassword;
            UserId = userId;
            Token = token;
        }
        public override string ToString()
        {
            return $"OldPassword: {OldPassword}, NewPassword: {NewPassword}, ConfirmNewPassword: {ConfirmNewPassword}, UserId: {UserId}, Token: {Token}";
        }
        public bool IsValid()
        {
            return !string.IsNullOrEmpty(OldPassword) &&
                   !string.IsNullOrEmpty(NewPassword) &&
                   !string.IsNullOrEmpty(ConfirmNewPassword) &&
                   UserId > 0 &&
                   !string.IsNullOrEmpty(Token);
        }
        public bool IsPasswordChangeValid()
        {
            return NewPassword == ConfirmNewPassword && NewPassword.Length >= 6;
        }
        public bool IsOldPasswordValid(string oldPasswordHash)
        {
            return PasswordHelper.VerifyPassword(OldPassword, oldPasswordHash);
        }

        public bool IsNewPasswordDifferent(string newPasswordHash)
        {
            return !PasswordHelper.VerifyPassword(NewPassword, newPasswordHash);
        }
        public bool IsTokenValid(string token)
        {
            return Token == token;
        }
        public bool IsUserIdValid(int userId)
        {
            return UserId == userId;
        }
        public bool IsChangePasswordRequestValid(string oldPasswordHash, string newPasswordHash, string token, int userId)
        {
            return IsOldPasswordValid(oldPasswordHash) &&
                   IsNewPasswordDifferent(newPasswordHash) &&
                   IsTokenValid(token) &&
                   IsUserIdValid(userId) &&
                   IsPasswordChangeValid();
        }
    }
}
