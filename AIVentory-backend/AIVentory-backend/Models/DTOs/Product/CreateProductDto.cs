using System.ComponentModel.DataAnnotations;

namespace AIVentory_backend.Models.DTOs.Product
{
    public class CreateProductDto
    {
        [Required(ErrorMessage = "Ürün adı gereklidir")]
        [StringLength(255, ErrorMessage = "Ürün adı en fazla 255 karakter olabilir")]
        public string Name { get; set; }

        [StringLength(500, ErrorMessage = "Açıklama en fazla 500 karakter olabilir")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Marka gereklidir")]
        [StringLength(100, ErrorMessage = "Marka en fazla 100 karakter olabilir")]
        public string Brand { get; set; }

        [StringLength(100, ErrorMessage = "Model en fazla 100 karakter olabilir")]
        public string? Model { get; set; }

        [StringLength(50, ErrorMessage = "Renk en fazla 50 karakter olabilir")]
        public string? Color { get; set; }

        [Required(ErrorMessage = "Fiyat gereklidir")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Fiyat 0'dan büyük olmalıdır")]
        public decimal Price { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Maliyet fiyatı 0 veya daha büyük olmalıdır")]
        public decimal? CostPrice { get; set; }

        public int? CategoryId { get; set; }

        public int? CompanyId { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Minimum stok 0 veya daha büyük olmalıdır")]
        public int? MinimumStock { get; set; }

        public int? CurrentStock { get; set; }

        [StringLength(100, ErrorMessage = "Barkod en fazla 100 karakter olabilir")]
        public string? Barcode { get; set; }

        [StringLength(500, ErrorMessage = "Resim URL'i en fazla 500 karakter olabilir")]
        public string? ImageUrl { get; set; }
    }
}