/**
 * Advanced AI System - Main integration point for all enhanced AI capabilities
 */
import { AIContextManager } from './ai-context-manager';
import { aiModel } from './services/ai-model-integration';
import { knowledgeService } from './services/knowledge-service';
import { marketIntelligence } from './services/market-intelligence-service';
import { aiTrainingAdapter } from './services/ai-training-adapter';
import { ENHANCED_TOKEN_INFO } from './enhanced-token-database';
import { resetConversationContext } from './personality/natural-language-processor';
import { formatWithPersonality, formatListWithPersonality } from './personality/ai-personality';
import { humanizeResponse, handleSmallTalk } from './personality/human-responses';
import { makeMoreHuman } from './personality/human-behavior';

// Response type for AI system
export interface AISystemResponse {
  message: string;
  intent?: any;
  suggestions?: string[];
  data?: any;
}

/**
 * Advanced AI System class that orchestrates all AI components
 */
export class AdvancedAISystem {
  private contextManager: AIContextManager;
  private _hasGivenWalletWelcome = false;
  
  constructor(sessionId: string) {
    this.contextManager = new AIContextManager(sessionId);
  }
  
  /**
   * Initialize the AI system with a wallet address
   */
  public initializeWithWallet(address: string | null): void {
    if (address) {
      this.contextManager.initializeWithWalletAddress(address);
      
      // Give a Harvey-style welcome for new wallet connections
      if (!this._hasGivenWalletWelcome) {
        this._hasGivenWalletWelcome = true;
        this.contextManager.addMessage({
          role: 'assistant',
          content: formatWithPersonality(
            `I see you've connected your wallet. Smart move. Now I have what I need to really help you navigate the crypto landscape. What's your first move?`,
            { mood: 'assertive', includeWittyRemark: true }
          )
        });
      }
    } else {
      this.contextManager.setWalletAddress(null);
      
      // Reset conversation context when wallet is disconnected
      resetConversationContext();
    }
  }
  
  /**
   * Process a user message and generate an enhanced AI response
   */
  public async processMessage(
    message: string,
    options: {
      includeMarketData?: boolean;
      includeTokenData?: boolean;
      fullAnalysis?: boolean;
      startTime?: number;
    } = {}
  ): Promise<AISystemResponse> {
    try {
      const startTime = options.startTime || Date.now();
      
      // Check if this is a model information query
      const modelInfoResponse = this.handleModelInfoQuery(message);
      if (modelInfoResponse) {
        return modelInfoResponse;
      }
      
      // First check if this message is small talk
      const smallTalkResponse = handleSmallTalk(message);
      if (smallTalkResponse) {
        return {
          message: smallTalkResponse,
          suggestions: this.generateCasualSuggestions()
        };
      }
      
      // Generate AI context
      const context = await this.contextManager.generateAIContext();
      
      // Add message to context history
      this.contextManager.addMessage({
        role: 'user',
        content: message
      });
      
      // Get wallet data from context
      const walletData = context.walletData || {
        walletConnected: false,
        walletAddress: null,
        balance: 0,
        tokenBalances: []
      };
      
      // Extract user profile
      const userProfile = this.contextManager.getUserProfile();
      
      // Process the message using the AI model integration
      const response = await aiModel.generateEnhancedResponse(message, {
        walletConnected: !!walletData.walletAddress,
        walletAddress: walletData.walletAddress,
        balance: walletData.balance || 0,
        tokenBalances: walletData.tokenBalances || [],
        expertiseLevel: userProfile.expertiseLevel,
        previousInteractions: this.contextManager.getMessages().map(msg => ({
          prompt: msg.role === 'user' ? msg.content : '',
          response: msg.role === 'assistant' ? msg.content : ''
        })),
        sessionId: this.getSessionId(),
        startTime
      });
      
      // Further humanize the response
      response.message = humanizeResponse(response.message);
      
      // Record assistant response in context history
      this.contextManager.addMessage({
        role: 'assistant',
        content: response.message
      });
      
      // Prepare result
      const result: AISystemResponse = {
        message: response.message,
        intent: response.intent,
        suggestions: response.suggestions || context.suggestedTopics
      };
      
      // Add market data if requested
      if (options.includeMarketData) {
        const mentionedTokens = this.extractTokensFromMessage(message);
        
        if (mentionedTokens.length > 0) {
          // Get specific token market data
          const primaryToken = mentionedTokens[0];
          const priceTrend = await marketIntelligence.analyzePriceTrend(primaryToken);
          
          if (priceTrend) {
            result.data = {
              ...result.data || {},
              marketData: {
                token: primaryToken,
                priceTrend
              }
            };
          }
        } else {
          // Get general market sentiment
          const sentiment = await marketIntelligence.getMarketSentiment();
          result.data = {
            ...result.data || {},
            marketData: {
              sentiment
            }
          };
        }
      }
      
      // Add token data if requested
      if (options.includeTokenData) {
        const mentionedTokens = this.extractTokensFromMessage(message);
        
        if (mentionedTokens.length > 0) {
          const tokenInfo = knowledgeService.getTokenInfo(mentionedTokens[0]);
          
          if (tokenInfo.found) {
            result.data = {
              ...result.data || {},
              tokenData: tokenInfo.data
            };
          }
        }
      }
      
      // Full market analysis for sophisticated queries
      if (options.fullAnalysis) {
        const mentionedTokens = this.extractTokensFromMessage(message);
        const analysis = await marketIntelligence.getComprehensiveAnalysis(
          mentionedTokens.length > 0 ? mentionedTokens[0] : undefined
        );
        
        result.data = {
          ...result.data || {},
          analysis
        };
        
        // If there's market analysis data, format it with the Harvey personality
        if (result.data?.analysis) {
          const analysis = result.data.analysis;
          if (analysis.shortTermOutlook) {
            analysis.shortTermOutlook = formatWithPersonality(analysis.shortTermOutlook, {
              mood: 'assertive',
              includeOpening: false,
              includeClosing: false
            });
          }
        }
      }
      
      // Format suggestions with personality when appropriate
      if (result.suggestions && result.suggestions.length > 0) {
        // Format every 2nd or 3rd suggestion with personality (randomly)
        const randomIndex = Math.floor(Math.random() * result.suggestions.length);
        if (randomIndex < result.suggestions.length) {
          const suggestion = result.suggestions[randomIndex];
          if (!suggestion.startsWith("Check") && !suggestion.startsWith("Connect")) {
            result.suggestions[randomIndex] = `Want my advice? ${suggestion}`;
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error processing message in advanced AI system:', error);
      
      // Return a graceful fallback response with human-like behavior
      const fallbackResponse = makeMoreHuman(
        "I'm having a moment here - seems like something went sideways with processing your request. Could we try again with different wording?",
        { conversationStyle: 'casual', emotionalTone: 'reflective' }
      );
      
      return {
        message: fallbackResponse,
        suggestions: ["Check my balance", "Tell me about Solana", "What are current market trends?"]
      };
    }
  }
  
  /**
   * Extract tokens mentioned in a message
   */
  private extractTokensFromMessage(message: string): string[] {
    const tokens: string[] = [];
    const normalizedMessage = message.toLowerCase();
    
    // Check for token symbols
    for (const token of Object.keys(ENHANCED_TOKEN_INFO)) {
      if (normalizedMessage.includes(token.toLowerCase())) {
        tokens.push(token);
      }
    }
    
    // Check for token names
    for (const [symbol, info] of Object.entries(ENHANCED_TOKEN_INFO) as [string, { name: string }][]) {
      if (normalizedMessage.includes(info.name.toLowerCase()) && !tokens.includes(symbol)) {
        tokens.push(symbol);
      }
    }
    
    return tokens;
  }
  
  /**
   * Generate casual suggestions for small talk
   */
  private generateCasualSuggestions(): string[] {
    const casualSuggestions = [
      "Tell me about Bitcoin",
      "What are your thoughts on NFTs?",
      "How's the crypto market doing today?",
      "What's your favorite blockchain project?",
      "Tell me about DeFi",
      "What should I know about Solana?",
      "How do hardware wallets work?"
    ];
    
    // Return 3 random suggestions
    return casualSuggestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }
  
  /**
   * Get session insights from training data
   */
  public getSessionInsights(): Record<string, any> {
    return aiTrainingAdapter.getTrainingInsights();
  }
  
  /**
   * Get user profile information
   */
  public getUserProfile() {
    return this.contextManager.getUserProfile();
  }
  
  /**
   * Handle model information queries
   */
  private handleModelInfoQuery(message: string): AISystemResponse | null {
    const normalizedMessage = message.toLowerCase().trim();
    
    // Check if the user is asking about the AI model
    const modelKeywords = [
      'is this pro model',
      'is this a pro model',
      'what model are you',
      'which model',
      'what ai model',
      'are you gpt',
      'what version',
      'model info',
      'model information',
      'ai model',
      'what ai are you',
      'are you chatgpt',
      'which gpt',
      'pro version',
      'premium model'
    ];
    
    const isModelQuery = modelKeywords.some(keyword => 
      normalizedMessage.includes(keyword)
    );
    
    if (!isModelQuery) return null;
    
    const response = formatWithPersonality(
      `Yes, this is a professional model! I'm powered by GPT-4 Turbo Preview, which is OpenAI's most advanced and capable model. Here's what makes me a "pro" setup:

🚀 **Advanced Capabilities:**
• 128K token context window (way more memory than standard models)
• Function calling for direct token swaps and wallet interactions
• Real-time market data integration
• Advanced reasoning and multi-step planning
• Natural language command processing

💎 **Professional Features:**
• Premium-tier API access with faster response times
• Enhanced accuracy for crypto and Web3 queries
• Integrated wallet transaction capabilities
• Market intelligence and analysis tools
• Context-aware conversation handling

This isn't just a basic chatbot - I'm specifically configured for serious crypto trading and DeFi interactions. Want me to show you what I can do with your wallet?`,
      { 
        mood: 'assertive', 
        includeWittyRemark: true,
        includeOpening: false 
      }
    );
    
    return {
      message: response,
      suggestions: [
        "Show me a demo swap",
        "Check my wallet balance", 
        "What tokens can you analyze?",
        "Tell me about market trends"
      ],
      data: {
        modelInfo: {
          name: "GPT-4 Turbo Preview",
          tier: "Professional",
          isPro: true,
          capabilities: [
            "Function calling",
            "128K context window",
            "Market data integration",
            "Wallet interactions"
          ]
        }
      }
    };
  }

  /**
   * Get the session ID
   */
  public getSessionId(): string {
    return this.contextManager.getSessionId();
  }
}

// Factory function to create a new AI system instance
export const createAISystem = (sessionId: string): AdvancedAISystem => {
  return new AdvancedAISystem(sessionId);
};
