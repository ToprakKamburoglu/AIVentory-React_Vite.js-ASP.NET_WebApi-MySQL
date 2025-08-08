using System.ComponentModel.DataAnnotations;

namespace AIVentory_backend.Models.DTOs.Product
{
    public class UpdateProductDto
    {
        [StringLength(100)]
        public string? Name { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Fiyat 0'dan büyük olmalıdır")]
        public decimal? Price { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Maliyet fiyatı 0'dan büyük olmalıdır")]
        public decimal? CostPrice { get; set; }

        [StringLength(50)]
        public string? Brand { get; set; }

        [StringLength(50)]
        public string? Model { get; set; }

        [StringLength(30)]
        public string? Color { get; set; }

        [StringLength(50)]
        public string? Barcode { get; set; }

        public int? CategoryId { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Minimum stok 0'dan büyük olmalıdır")]
        public int? MinimumStock { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Maksimum stok 0'dan büyük olmalıdır")]
        public int? MaximumStock { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Mevcut stok 0'dan büyük olmalıdır")]
        public int? CurrentStock { get; set; }

        public string? ImageUrl { get; set; }
    }
}