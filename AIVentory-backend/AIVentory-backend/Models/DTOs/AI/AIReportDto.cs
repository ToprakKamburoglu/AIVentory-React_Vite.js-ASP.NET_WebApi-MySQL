public class AIReportDto
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? ChartData { get; set; }
    public DateTime GeneratedAt { get; set; }
    public string ReportType { get; set; } = string.Empty;
}