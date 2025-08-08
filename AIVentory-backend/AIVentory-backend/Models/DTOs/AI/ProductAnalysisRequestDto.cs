using System.ComponentModel.DataAnnotations;

namespace AIVentory_backend.Models.DTOs.AI
{
    public class ProductAnalysisRequestDto
    {
        [Required(ErrorMessage = "Resim URL'si gereklidir")]
        [Url(ErrorMessage = "Geçerli bir URL giriniz")]
        public string ImageUrl { get; set; } = string.Empty;

        [Required(ErrorMessage = "Analiz tipi gereklidir")]
        [RegularExpression(@"^(product_recognition|color_analysis|price_prediction|demand_forecast)$",
            ErrorMessage = "Geçerli analiz tipi: product_recognition, color_analysis, price_prediction, demand_forecast")]
        public string AnalysisType { get; set; } = string.Empty;

        public int? ProductId { get; set; }

        [MaxLength(500, ErrorMessage = "Notlar 500 karakterden uzun olamaz")]
        public string? Notes { get; set; }
    }
}