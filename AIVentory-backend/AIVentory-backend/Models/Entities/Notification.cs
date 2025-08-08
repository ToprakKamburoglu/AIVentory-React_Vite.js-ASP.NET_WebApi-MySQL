using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AIVentory_backend.Models.Entities
{
    [Table("Notifications")]
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        public int CompanyId { get; set; }
        public int? UserId { get; set; } 

        [Required, MaxLength(255)]
        public string Title { get; set; }

        [Required]
        public string Message { get; set; }

        [Column(TypeName = "varchar(20)")]
        public string Type { get; set; } = "info"; 

        [Column(TypeName = "varchar(20)")]
        public string Category { get; set; } = "system"; 

        [MaxLength(50)]
        public string? RelatedEntityType { get; set; } 

        public int? RelatedEntityId { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime? ReadAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public DateTime CreatedAt { get; set; }

      
        public virtual Company Company { get; set; }
        public virtual User? User { get; set; }
    }
}