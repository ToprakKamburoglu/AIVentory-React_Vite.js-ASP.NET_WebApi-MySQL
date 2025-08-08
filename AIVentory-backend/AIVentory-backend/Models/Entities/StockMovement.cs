using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AIVentory_backend.Models.Entities
{
    [Table("StockMovements")]
    public class StockMovement
    {
        [Key]
        public int Id { get; set; }

        public int ProductId { get; set; }

        [Column(TypeName = "varchar(20)")]
        public string MovementType { get; set; } 

        public int Quantity { get; set; }
        public int PreviousStock { get; set; }
        public int NewStock { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? UnitCost { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? TotalCost { get; set; }

        [MaxLength(255)]
        public string? Reason { get; set; }

        public int? ReferenceId { get; set; }

        [MaxLength(50)]
        public string? ReferenceType { get; set; }

        public int UserId { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }

      
        public virtual Product Product { get; set; }
        public virtual User User { get; set; }
    }
}