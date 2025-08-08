using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AIVentory_backend.Models.Entities
{
    [Table("UserActivities")]
    public class UserActivity
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public int CompanyId { get; set; }

        [Required, MaxLength(100)]
        public string Action { get; set; } 

        [MaxLength(50)]
        public string? EntityType { get; set; } 

        public int? EntityId { get; set; }
        public string? Description { get; set; }

        [MaxLength(45)]
        public string? IpAddress { get; set; } 

        public string? UserAgent { get; set; }
        public DateTime CreatedAt { get; set; }

      
        public virtual User User { get; set; }
        public virtual Company Company { get; set; }
    }
}