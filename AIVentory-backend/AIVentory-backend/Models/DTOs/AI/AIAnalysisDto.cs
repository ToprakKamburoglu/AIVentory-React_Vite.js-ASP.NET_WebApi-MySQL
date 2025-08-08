namespace AIVentory_backend.Models.DTOs.AI
{
    public class AIAnalysisDto
    {
        public int Id { get; set; }
        public int? ProductId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string AnalysisType { get; set; } = string.Empty;
        public object? AnalysisResult { get; set; }
        public decimal? Confidence { get; set; }
        public string? DetectedName { get; set; }
        public string? DetectedCategory { get; set; }
        public string? DetectedBrand { get; set; }
        public string? DetectedColor { get; set; }
        public string? DetectedColorCode { get; set; }
        public decimal? SuggestedPrice { get; set; }
        public int? ProcessingTime { get; set; }
        public string? AIModel { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? ErrorMessage { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}