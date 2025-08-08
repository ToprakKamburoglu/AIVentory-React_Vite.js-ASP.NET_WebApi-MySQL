using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AIVentory_backend.Models.Entities
{
    [Table("Products")]
    public class Product
    {
        [Key]
        public int Id { get; set; }

        public int CompanyId { get; set; }
        public int? CategoryId { get; set; }

        [Required, MaxLength(255)]
        public string Name { get; set; }

        public string? Description { get; set; }

        [MaxLength(100)]
        public string? Barcode { get; set; }

        [MaxLength(100)]
        public string? SKU { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal CostPrice { get; set; }

        public int CurrentStock { get; set; }

        [MaxLength(3)]
        public string Currency { get; set; } = "TRY";

        [MaxLength(100)]
        public string? Brand { get; set; }

        [MaxLength(100)]
        public string? Model { get; set; }

        [MaxLength(50)]
        public string? Color { get; set; }

        [MaxLength(7)]
        public string? ColorCode { get; set; }

        [MaxLength(50)]
        public string? Size { get; set; }

        [Column(TypeName = "decimal(8,2)")]
        public decimal? Weight { get; set; }

        [MaxLength(100)]
        public string? Dimensions { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        [Column(TypeName = "json")]
        public string? Images { get; set; }

        public int MinimumStock { get; set; } = 0;
        public int? MaximumStock { get; set; }

        [MaxLength(20)]
        public string Unit { get; set; } = "adet";

        [Column(TypeName = "json")]
        public string? Tags { get; set; }

        public bool IsActive { get; set; } = true;
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

  
        public virtual Company Company { get; set; }
        public virtual Category? Category { get; set; }
        public virtual Stock? Stock { get; set; }
        public virtual User CreatedByUser { get; set; }
    }
}