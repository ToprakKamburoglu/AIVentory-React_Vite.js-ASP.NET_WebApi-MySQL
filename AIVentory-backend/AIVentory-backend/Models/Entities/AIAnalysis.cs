using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AIVentory_backend.Models.Entities
{
    [Table("AIAnalysis")]
    public class AIAnalysis
    {
        [Key]
        public int Id { get; set; }

        public int? ProductId { get; set; }
        public int CompanyId { get; set; }

        [Required, MaxLength(500)]
        public string ImageUrl { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string AnalysisType { get; set; } 

        [Column(TypeName = "json")]
        public string? AnalysisResult { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? Confidence { get; set; }

        [MaxLength(255)]
        public string? DetectedName { get; set; }

        [MaxLength(100)]
        public string? DetectedCategory { get; set; }

        [MaxLength(100)]
        public string? DetectedBrand { get; set; }

        [MaxLength(50)]
        public string? DetectedColor { get; set; }

        [MaxLength(7)]
        public string? DetectedColorCode { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? SuggestedPrice { get; set; }

        public int? ProcessingTime { get; set; }

        [MaxLength(100)]
        public string? AIModel { get; set; }

        [Column(TypeName = "varchar(20)")]
        public string Status { get; set; } = "pending"; 

        public string? ErrorMessage { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

     
        public virtual Product? Product { get; set; }
        public virtual Company Company { get; set; }
        public virtual User User { get; set; }
    }
}