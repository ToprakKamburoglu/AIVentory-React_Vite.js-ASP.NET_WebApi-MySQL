using System.ComponentModel.DataAnnotations;

namespace AIVentory_backend.Models.DTOs.Stock
{
    public class CreateStockMovementDto
    {
        [Required(ErrorMessage = "Ürün ID gereklidir")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "Hareket tipi gereklidir")]
        [RegularExpression(@"^(in|out|adjustment|transfer|return)$", ErrorMessage = "Geçerli hareket tipi: in, out, adjustment, transfer, return")]
        public string MovementType { get; set; } = string.Empty;

        [Required(ErrorMessage = "Miktar gereklidir")]
        [Range(1, int.MaxValue, ErrorMessage = "Miktar 0'dan büyük olmalıdır")]
        public int Quantity { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Birim fiyat negatif olamaz")]
        public decimal? UnitCost { get; set; }

        [MaxLength(255, ErrorMessage = "Sebep 255 karakterden uzun olamaz")]
        public string? Reason { get; set; }

        [MaxLength(500, ErrorMessage = "Notlar 500 karakterden uzun olamaz")]
        public string? Notes { get; set; }

        public int? ReferenceId { get; set; }

        [MaxLength(50, ErrorMessage = "Referans tipi 50 karakterden uzun olamaz")]
        public string? ReferenceType { get; set; }
    }
}