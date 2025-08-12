public class SaveProductFromAnalysisDto
{
    public int? AnalysisId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? Brand { get; set; }
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public string? ColorCode { get; set; }
    public List<string> Features { get; set; } = new();
    public string? ImageUrl { get; set; }
}