import { NextRequest, NextResponse } from 'next/server';

// Model information endpoint to show current AI capabilities
export async function GET(req: NextRequest) {
  try {
    const modelInfo = {
      isPro: true,
      currentModel: {
        name: "GPT-4 Turbo Preview",
        provider: "OpenAI",
        tier: "Professional",
        capabilities: [
          "Advanced conversation understanding",
          "Function calling for token swaps",
          "Real-time market data integration",
          "Wallet transaction analysis",
          "Multi-step transaction planning",
          "Context-aware responses",
          "Natural language command processing"
        ],
        features: {
          maxTokens: 128000,
          contextWindow: "128K tokens",
          temperature: 0.2,
          functionCalling: true,
          marketDataIntegration: true,
          walletIntegration: true
        },
        pricing: {
          tier: "Premium",
          inputTokens: "$0.01 per 1K tokens",
          outputTokens: "$0.03 per 1K tokens"
        }
      },
      alternativeModel: {
        name: "GPT-4",
        provider: "OpenAI",
        tier: "Professional",
        capabilities: [
          "High-quality conversation",
          "Advanced reasoning",
          "Code understanding",
          "Financial analysis"
        ],
        features: {
          maxTokens: 8192,
          contextWindow: "8K tokens",
          temperature: 0.2,
          functionCalling: true,
          marketDataIntegration: true,
          walletIntegration: true
        }
      },
      availability: {
        status: "Active",
        apiKeyRequired: true,
        apiKeyConfigured: !!process.env.OPENAI_API_KEY,
        lastChecked: new Date().toISOString()
      },
      comparison: {
        vs_gpt35: {
          reasoning: "Much better",
          accuracy: "Significantly higher",
          contextUnderstanding: "Superior",
          functionCalling: "Advanced"
        },
        vs_claude: {
          reasoning: "Comparable",
          accuracy: "Similar",
          contextUnderstanding: "Similar",
          integration: "Better Solana integration"
        }
      }
    };

    return NextResponse.json({
      success: true,
      data: modelInfo,
      message: "This application uses GPT-4 Turbo Preview, which is OpenAI's most advanced professional model with enhanced capabilities for crypto and Web3 interactions."
    });

  } catch (error) {
    console.error("Error getting model info:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to retrieve model information",
        fallback: {
          isPro: true,
          model: "GPT-4 Professional Tier",
          status: "Active"
        }
      },
      { status: 500 }
    );
  }
}