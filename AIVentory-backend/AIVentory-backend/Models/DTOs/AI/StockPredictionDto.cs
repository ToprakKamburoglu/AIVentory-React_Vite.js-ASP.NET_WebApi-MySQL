public class StockPredictionDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int CurrentStock { get; set; }
    public int PredictedDemand { get; set; }
    public int RecommendedOrderQuantity { get; set; }
    public DateTime StockOutDate { get; set; }
    public decimal Confidence { get; set; }
    public decimal SeasonalFactor { get; set; }
    public decimal TrendFactor { get; set; }
    public DateTime CreatedAt { get; set; }
}