
namespace AIVentory_backend.Models.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? ParentId { get; set; }
        public string? Icon { get; set; }
        public string? Color { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

      
        public Company Company { get; set; }
        public Category? Parent { get; set; }
        public ICollection<Category> Children { get; set; } = new List<Category>();
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}