public class MarketTrendAnalysisDto
{
    public string Category { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty;
    public object? Trends { get; set; }
    public List<string> Insights { get; set; } = new();
    public List<string> Opportunities { get; set; } = new();
    public List<string> Risks { get; set; } = new();
}