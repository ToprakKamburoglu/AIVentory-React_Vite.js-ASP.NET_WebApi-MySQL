using System.ComponentModel.DataAnnotations;

namespace AIVentory_backend.Models.DTOs.Category
{
    public class CreateCategoryDto
    {
        public int CompanyId { get; set; }

        [Required(ErrorMessage = "Kategori adı gereklidir")]
        [MaxLength(255, ErrorMessage = "Kategori adı 255 karakterden uzun olamaz")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500, ErrorMessage = "Açıklama 500 karakterden uzun olamaz")]
        public string? Description { get; set; }

        [RegularExpression(@"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", ErrorMessage = "Geçerli bir hex renk kodu giriniz")]
        public string? Color { get; set; }

        [MaxLength(50, ErrorMessage = "Icon 50 karakterden uzun olamaz")]
        public string? Icon { get; set; }
        public int? ParentId { get; set; } 
    }
}