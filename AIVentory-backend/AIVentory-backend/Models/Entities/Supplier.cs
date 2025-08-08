using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AIVentory_backend.Models.Entities
{
    [Table("Suppliers")]
    public class Supplier
    {
        [Key]
        public int Id { get; set; }

        public int CompanyId { get; set; }

        [Required, MaxLength(255)]
        public string Name { get; set; }

        [MaxLength(100)]
        public string? ContactPerson { get; set; }

        [MaxLength(255)]
        public string? Email { get; set; }

        [MaxLength(20)]
        public string? Phone { get; set; }

        public string? Address { get; set; }

        [MaxLength(100)]
        public string? City { get; set; }

        [MaxLength(100)]
        public string? Country { get; set; }

        [MaxLength(50)]
        public string? TaxNumber { get; set; }

        [MaxLength(255)]
        public string? Website { get; set; }

        [MaxLength(100)]
        public string? PaymentTerms { get; set; }

        [Column(TypeName = "decimal(2,1)")]
        public decimal? Rating { get; set; }

        public string? Notes { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

   
        public virtual Company Company { get; set; }
        public virtual ICollection<ProductSupplier> ProductSuppliers { get; set; }
    }
}