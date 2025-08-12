public class AIAnalysisHistoryDto
{
    public int Id { get; set; }
    public string AnalysisType { get; set; } = string.Empty;
    public string? DetectedName { get; set; }
    public string? DetectedBrand { get; set; }
    public decimal? SuggestedPrice { get; set; }
    public decimal Confidence { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}