using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AIVentory_backend.Models.Entities
{
    [Table("SystemSettings")]
    public class SystemSetting
    {
        [Key]
        public int Id { get; set; }

        public int CompanyId { get; set; }

        [Required, MaxLength(100)]
        public string SettingKey { get; set; }

        public string? SettingValue { get; set; }

        [Column(TypeName = "varchar(20)")]
        public string SettingType { get; set; } = "string"; 

        public string? Description { get; set; }
        public bool IsPublic { get; set; } = false;
        public int? UpdatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

     
        public virtual Company Company { get; set; }
        public virtual User? UpdatedByUser { get; set; }
    }
}