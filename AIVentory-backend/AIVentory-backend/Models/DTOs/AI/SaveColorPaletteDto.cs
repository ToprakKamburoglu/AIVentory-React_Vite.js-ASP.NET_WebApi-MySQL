using AIVentory_backend.Models.DTOs.AI;
public class SaveColorPaletteDto
{
    public string Name { get; set; } = string.Empty;
    public List<DominantColorDto> Colors { get; set; } = new();
    public string? Harmony { get; set; }
    public string? Temperature { get; set; }
    public decimal? Brightness { get; set; }
    public decimal? Saturation { get; set; }
    public object? MarketTrends { get; set; }
    public string? ImageUrl { get; set; }
}