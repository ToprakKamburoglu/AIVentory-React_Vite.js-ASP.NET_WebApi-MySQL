using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.Ollama;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;

namespace AIVentory_backend.Services.Implementations
{
    public class SemanticKernelService
    {
        private readonly Kernel _kernel;
        private readonly ILogger<SemanticKernelService> _logger;
        private readonly OllamaConfiguration _config;

        public SemanticKernelService(ILogger<SemanticKernelService> logger, IOptions<OllamaConfiguration> config)
        {
            _logger = logger;
            _config = config.Value;
            _kernel = CreateKernel();
        }

        private Kernel CreateKernel()
        {
            var builder = Kernel.CreateBuilder();

            builder.AddOllamaChatCompletion(
                modelId: _config.ModelName, 
                endpoint: new Uri(_config.BaseUrl) // "http://localhost:11434"
            );

            builder.Services.AddLogging(c => c.AddConsole().SetMinimumLevel(LogLevel.Information));

            return builder.Build();
        }

        public Kernel GetKernel() => _kernel;

        
        public Kernel CreateProductRecognitionKernel()
        {
            var builder = Kernel.CreateBuilder();
            builder.AddOllamaChatCompletion("llava:7b", new Uri(_config.BaseUrl));

            return builder.Build();
        }

        public Kernel CreateColorAnalysisKernel()
        {
            var builder = Kernel.CreateBuilder();
            builder.AddOllamaChatCompletion("mistral:7b", new Uri(_config.BaseUrl));

          
            return builder.Build();
        }

        public Kernel CreatePricePredictionKernel()
        {
            var builder = Kernel.CreateBuilder();
            builder.AddOllamaChatCompletion("codellama:7b", new Uri(_config.BaseUrl));

            return builder.Build();
        }
    }

    public class OllamaConfiguration
    {
        public string BaseUrl { get; set; } = "http://localhost:11434";
        public string ModelName { get; set; } = "mistral:7b";
        public int TimeoutSeconds { get; set; } = 30;
        public int MaxTokens { get; set; } = 4096;
    }
}