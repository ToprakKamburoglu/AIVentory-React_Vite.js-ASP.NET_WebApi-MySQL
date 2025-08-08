namespace AIVentory_backend.Models.DTOs.Stock
{
    public class StockPredictionDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public DateTime PredictionDate { get; set; }
        public int PredictedDemand { get; set; }
        public int CurrentStock { get; set; }
        public int RecommendedOrderQuantity { get; set; }
        public DateTime? StockOutDate { get; set; }
        public decimal Confidence { get; set; }
        public decimal SeasonalFactor { get; set; }
        public decimal TrendFactor { get; set; }
        public string AIModel { get; set; } = string.Empty;
    }
}