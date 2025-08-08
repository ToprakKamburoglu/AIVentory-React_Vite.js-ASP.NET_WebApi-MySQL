namespace AIVentory_backend.Models.DTOs.Product
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public decimal? CostPrice { get; set; }
        public string? Brand { get; set; }
        public string? Color { get; set; }
        public string? ColorCode { get; set; }
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public int CurrentStock { get; set; }
        public int MinimumStock { get; set; }
        public string? ImageUrl { get; set; }
        public string? Barcode { get; set; }
        public string? SKU { get; set; }
    }
}