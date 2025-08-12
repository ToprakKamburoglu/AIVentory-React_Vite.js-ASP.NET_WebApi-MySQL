using Microsoft.SemanticKernel;
using System.ComponentModel;
using System.Text.Json;

namespace AIVentory_backend.Services.AI.Plugins
{
    public class ProductRecognitionPlugin
    {
        [KernelFunction("analyze_product_image")]
        [Description("Ürün görselini analiz ederek ürün bilgilerini çıkarır")]
        public Task<string> AnalyzeProductImage(
            [Description("Ürün görselinin base64 formatındaki verisi")] string imageBase64,
            [Description("Analiz için ek context bilgisi")] string context = "")
        {
            var prompt = $@"
            Lütfen verilen ürün görselini analiz edin ve aşağıdaki bilgileri JSON formatında döndürün:

            {{
                ""productName"": ""ürün adı"",
                ""category"": ""kategori"",
                ""subCategory"": ""alt kategori"",
                ""brand"": ""marka"",
                ""model"": ""model"",
                ""color"": ""renk"",
                ""colorCode"": ""hex renk kodu"",
                ""features"": [""özellik1"", ""özellik2""],
                ""estimatedPrice"": fiyat_tahmini,
                ""confidence"": güven_yüzdesi,
                ""description"": ""ürün açıklaması"",
                ""specifications"": {{
                    ""özellik"": ""değer""
                }},
                ""keywords"": [""anahtar1"", ""anahtar2""]
            }}

            Ek bilgi: {context}

            Lütfen sadece JSON formatında yanıt verin, başka açıklama eklemeyin.
            ";

            return Task.FromResult(prompt);  
        }

        [KernelFunction("extract_product_features")]
        [Description("Ürün özelliklerini detaylı şekilde çıkarır")]
        public Task<string> ExtractProductFeatures(
            [Description("Ürün görselinin base64 verisi")] string imageBase64,
            [Description("Odaklanılacak özellik türü")] string featureType = "all")
        {
            var prompt = $@"
            Bu ürün görselinden {featureType} özelliklerini çıkarın:

            Aradığınız özellikler:
            - Fiziksel boyutlar
            - Malzeme bilgileri  
            - Teknik özellikler
            - Marka logoları ve yazıları
            - Renk varyasyonları
            - Ambalaj bilgileri

            JSON formatında döndürün:
            {{
                ""physicalFeatures"": {{
                    ""dimensions"": ""boyutlar"",
                    ""weight"": ""ağırlık"",
                    ""material"": ""malzeme""
                }},
                ""technicalFeatures"": {{
                    ""processor"": ""işlemci"",
                    ""memory"": ""hafıza"",
                    ""storage"": ""depolama""
                }},
                ""visualFeatures"": {{
                    ""colors"": [""renk1"", ""renk2""],
                    ""design"": ""tasarım stili"",
                    ""packaging"": ""ambalaj türü""
                }}
            }}
            ";

            return Task.FromResult(prompt);
        }
    }

    
    public class ColorAnalysisPlugin
    {
        [KernelFunction("analyze_colors")]
        [Description("Görsel içindeki renkleri analiz ederek baskın renkleri ve renk kodlarını çıkarır")]
        public Task<string> AnalyzeColors(
            [Description("Analiz edilecek görselinin base64 verisi")] string imageBase64,
            [Description("Renk analiz detay seviyesi (basic/detailed)")] string detailLevel = "detailed")
        {
            var prompt = $@"
            Bu görseldeki renkleri analiz edin ve aşağıdaki JSON formatında döndürün:

            {{
                ""dominantColors"": [
                    {{
                        ""colorName"": ""renk adı"",
                        ""hexCode"": ""#hex kod"",
                        ""rgbCode"": ""rgb(r,g,b)"",
                        ""percentage"": yüzde_değeri,
                        ""colorFamily"": ""renk ailesi""
                    }}
                ],
                ""colorHarmony"": ""renk harmonisi türü"",
                ""colorTemperature"": ""warm/cool/neutral"",
                ""brightness"": parlaklık_değeri,
                ""saturation"": doygunluk_değeri,
                ""contrast"": ""low/medium/high"",
                ""marketTrends"": {{
                    ""popularity"": popülerlik_skoru,
                    ""season"": ""uygun mevsim"",
                    ""demographic"": ""hedef yaş grubu"",
                    ""emotion"": ""uyandırdığı duygu""
                }},
                ""suggestions"": [""renk_adı_önerisi1"", ""renk_adı_önerisi2""],
                ""complementaryColors"": [""#hex1"", ""#hex2""],
                ""similarProducts"": [""benzer ürün tanımı""]
            }}

            Detay seviyesi: {detailLevel}
            Sadece JSON formatında yanıt verin.
            ";

            return Task.FromResult(prompt);
        }

        [KernelFunction("suggest_color_names")]
        [Description("Renk kodları için pazarlanabilir renk isimleri önerir")]
        public Task<string> SuggestColorNames(
            [Description("Hex renk kodu")] string hexColor,
            [Description("Ürün kategorisi")] string productCategory)
        {
            var prompt = $@"
            {hexColor} renk kodu için {productCategory} kategorisinde pazarlanabilir renk isimleri önerin:

            JSON formatında döndürün:
            {{
                ""colorCode"": ""{hexColor}"",
                ""category"": ""{productCategory}"",
                ""suggestions"": [
                    {{
                        ""name"": ""pazarlanabilir isim"",
                        ""description"": ""renk açıklaması"",
                        ""marketAppeal"": çekicilik_skoru
                    }}
                ],
                ""trendAnalysis"": {{
                    ""currentTrend"": ""mevcut trend durumu"",
                    ""seasonality"": ""mevsimsel uygunluk"",
                    ""targetAudience"": ""hedef kitle""
                }}
            }}
            ";

            return Task.FromResult(prompt);
        }
    }

    
    public class PricePredictionPlugin
    {
        [KernelFunction("predict_price")]
        [Description("Ürün bilgilerine göre fiyat tahmini yapar")]
        public Task<string> PredictPrice(
            [Description("Ürün bilgileri JSON formatında")] string productInfo,
            [Description("Pazar bilgileri")] string marketContext = "")
        {
            var prompt = $@"
            Bu ürün bilgilerine göre Türkiye pazarında fiyat tahmini yapın:

            Ürün Bilgileri: {productInfo}
            Pazar Bilgileri: {marketContext}

            JSON formatında döndürün:
            {{
                ""estimatedPrice"": tahmini_fiyat,
                ""priceRange"": {{
                    ""min"": minimum_fiyat,
                    ""max"": maksimum_fiyat
                }},
                ""confidence"": güven_yüzdesi,
                ""factors"": [
                    {{
                        ""factor"": ""etken"",
                        ""impact"": ""pozitif/negatif"",
                        ""weight"": ağırlık_yüzdesi
                    }}
                ],
                ""marketAnalysis"": {{
                    ""competitorPrices"": [fiyat1, fiyat2],
                    ""demandLevel"": ""düşük/orta/yüksek"",
                    ""profitMargin"": kar_marjı_önerisi,
                    ""seasonalFactor"": mevsimsel_etki
                }},
                ""recommendations"": [
                    ""fiyat stratejisi önerisi""
                ]
            }}

            Türk Lirası (TRY) cinsinden fiyat verin.
            ";

            return Task.FromResult(prompt);
        }

        [KernelFunction("analyze_market_trends")]
        [Description("Ürün kategorisi için pazar trendlerini analiz eder")]
        public Task<string> AnalyzeMarketTrends(
            [Description("Ürün kategorisi")] string category,
            [Description("Analiz dönemi")] string timePeriod = "3 months")
        {
            var prompt = $@"
            {category} kategorisi için {timePeriod} döneminde pazar trendlerini analiz edin:

            JSON formatında döndürün:
            {{
                ""category"": ""{category}"",
                ""period"": ""{timePeriod}"",
                ""trends"": {{
                    ""priceDirection"": ""artış/azalış/stabil"",
                    ""demandTrend"": ""artış/azalış/stabil"",
                    ""popularFeatures"": [""özellik1"", ""özellik2""],
                    ""emergingBrands"": [""marka1"", ""marka2""]
                }},
                ""insights"": [
                    ""pazar içgörüsü 1"",
                    ""pazar içgörüsü 2""
                ],
                ""opportunities"": [
                    ""fırsat 1"",
                    ""fırsat 2""
                ],
                ""risks"": [
                    ""risk 1"",
                    ""risk 2""
                ]
            }}
";

            return Task.FromResult(prompt);
        }
    }
}