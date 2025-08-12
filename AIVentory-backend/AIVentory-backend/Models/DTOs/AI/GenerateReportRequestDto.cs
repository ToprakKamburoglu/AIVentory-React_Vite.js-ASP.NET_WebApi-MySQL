public class GenerateReportRequestDto
{
    public string ReportType { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<string> Categories { get; set; } = new();
    public bool IncludeCharts { get; set; } = true;
}