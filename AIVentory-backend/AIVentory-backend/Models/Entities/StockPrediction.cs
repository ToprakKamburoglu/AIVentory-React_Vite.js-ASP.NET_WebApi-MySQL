using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AIVentory_backend.Models.Entities
{
    [Table("StockPredictions")]
    public class StockPrediction
    {
        [Key]
        public int Id { get; set; }

        public int ProductId { get; set; }
        public int CompanyId { get; set; }
        public DateTime PredictionDate { get; set; }
        public int PredictedDemand { get; set; }
        public int CurrentStock { get; set; }
        public int? RecommendedOrderQuantity { get; set; }
        public DateTime? StockOutDate { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? Confidence { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? SeasonalFactor { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? TrendFactor { get; set; }

        [MaxLength(100)]
        public string? AIModel { get; set; }

        public DateTime CreatedAt { get; set; }

     
        public virtual Product Product { get; set; }
        public virtual Company Company { get; set; }
    }
}