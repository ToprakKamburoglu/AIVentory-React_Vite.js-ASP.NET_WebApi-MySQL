using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AIVentory_backend.Models.Entities
{
    [Table("ProductSuppliers")]
    public class ProductSupplier
    {
        [Key]
        public int Id { get; set; }

        public int ProductId { get; set; }
        public int SupplierId { get; set; }

        [MaxLength(100)]
        public string? SupplierProductCode { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? PurchasePrice { get; set; }

        [MaxLength(3)]
        public string Currency { get; set; } = "TRY";

        public int MinOrderQuantity { get; set; } = 1;
        public int LeadTimeDays { get; set; } = 7;
        public bool IsPreferred { get; set; } = false;
        public DateTime? LastPurchaseDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

     
        public virtual Product Product { get; set; }
        public virtual Supplier Supplier { get; set; }
    }
}