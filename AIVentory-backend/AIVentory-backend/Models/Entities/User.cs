using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AIVentory_backend.Models.Enums;

namespace AIVentory_backend.Models.Entities
{
    [Table("Users")]
    public class User
    {
        [Key]
        public int Id { get; set; }

        public int CompanyId { get; set; }

        [Required, MaxLength(100)]
        public string FirstName { get; set; }

        [Required, MaxLength(100)]
        public string LastName { get; set; }

        [Required, MaxLength(255)]
        public string Email { get; set; }

        [Required, MaxLength(255)]
        public string PasswordHash { get; set; }

        public UserRole Role { get; set; } = UserRole.Employee;

        [MaxLength(20)]
        public string? Phone { get; set; }

        [MaxLength(500)]
        public string? Avatar { get; set; }

        public DateTime? LastLoginAt { get; set; }
        public bool IsActive { get; set; } = true;
        public bool EmailVerified { get; set; } = false;

        [MaxLength(100)]
        public string? EmailVerificationToken { get; set; }

        [MaxLength(100)]
        public string? PasswordResetToken { get; set; }

        public DateTime? PasswordResetExpires { get; set; }

        
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedAt { get; set; } = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("Turkey Standard Time"));

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime UpdatedAt { get; set; } = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("Turkey Standard Time"));

     
        public virtual Company Company { get; set; }
    }
}