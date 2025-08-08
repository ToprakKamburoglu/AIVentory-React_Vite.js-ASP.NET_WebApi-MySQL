namespace AIVentory_backend.Models.DTOs.Category
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; } 
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Color { get; set; }
        public string? Icon { get; set; }
        public int ProductCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}