using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AIVentory_backend.Models.Entities
{
    [Table("Stock")]
    public class Stock
    {
        [Key]
        public int Id { get; set; }

        public int ProductId { get; set; }
        public int CurrentStock { get; set; } = 0;
        public int ReservedStock { get; set; } = 0;

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public int AvailableStock { get; set; }

        public DateTime LastStockUpdate { get; set; }
        public DateTime? LastCountDate { get; set; }

        public virtual Product Product { get; set; }
    }
}