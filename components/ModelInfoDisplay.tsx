"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as HiIcons from 'react-icons/hi';
import * as MdIcons from 'react-icons/md';
import * as RxIcons from 'react-icons/rx';

interface ModelInfo {
  isPro: boolean;
  currentModel: {
    name: string;
    provider: string;
    tier: string;
    capabilities: string[];
    features: {
      maxTokens: number;
      contextWindow: string;
      temperature: number;
      functionCalling: boolean;
      marketDataIntegration: boolean;
      walletIntegration: boolean;
    };
    pricing: {
      tier: string;
      inputTokens: string;
      outputTokens: string;
    };
  };
  availability: {
    status: string;
    apiKeyRequired: boolean;
    apiKeyConfigured: boolean;
    lastChecked: string;
  };
}

interface ModelInfoDisplayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelInfoDisplay: React.FC<ModelInfoDisplayProps> = ({ isOpen, onClose }) => {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !modelInfo) {
      fetchModelInfo();
    }
  }, [isOpen, modelInfo]);

  const fetchModelInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/model-info');
      const data = await response.json();
      
      if (data.success) {
        setModelInfo(data.data);
      } else {
        setError(data.error || 'Failed to fetch model information');
      }
    } catch (err) {
      setError('Network error: Unable to fetch model information');
      console.error('Error fetching model info:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-card/95 backdrop-blur-xl border border-border/20 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <MdIcons.MdSmartToy className="text-primary text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">AI Model Information</h2>
                <p className="text-sm text-muted-foreground">Current configuration and capabilities</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-secondary/40 hover:bg-secondary/60 text-secondary-foreground transition-colors"
            >
              <RxIcons.RxCross2 size={18} />
            </button>
          </div>

          {/* Content */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Loading model information...</span>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <HiIcons.HiExclamationCircle className="text-destructive" />
                <span className="text-destructive font-medium">Error</span>
              </div>
              <p className="text-destructive/80 mt-1">{error}</p>
            </div>
          )}

          {modelInfo && (
            <div className="space-y-6">
              {/* Pro Status Banner */}
              <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <HiIcons.HiCheckCircle className="text-primary text-2xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">✨ Pro Model Active</h3>
                    <p className="text-sm text-muted-foreground">
                      You&apos;re using {modelInfo.currentModel.name} - OpenAI&apos;s most advanced model
                    </p>
                  </div>
                </div>
              </div>

              {/* Model Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-secondary/20 border border-secondary/30 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Model Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="text-foreground">{modelInfo.currentModel.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Provider:</span>
                      <span className="text-foreground">{modelInfo.currentModel.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tier:</span>
                      <span className="text-primary font-medium">{modelInfo.currentModel.tier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Context:</span>
                      <span className="text-foreground">{modelInfo.currentModel.features.contextWindow}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/20 border border-secondary/30 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="text-green-400 font-medium">{modelInfo.availability.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">API Key:</span>
                      <span className={`font-medium ${modelInfo.availability.apiKeyConfigured ? 'text-green-400' : 'text-red-400'}`}>
                        {modelInfo.availability.apiKeyConfigured ? 'Configured' : 'Missing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pricing:</span>
                      <span className="text-foreground">{modelInfo.currentModel.pricing.tier}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Capabilities */}
              <div className="bg-secondary/20 border border-secondary/30 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-3">Advanced Capabilities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {modelInfo.currentModel.capabilities.map((capability, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <HiIcons.HiCheckCircle className="text-primary text-sm" />
                      <span className="text-foreground">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-secondary/20 border border-secondary/30 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-3">Technical Features</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${modelInfo.currentModel.features.functionCalling ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-foreground">Function Calling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${modelInfo.currentModel.features.marketDataIntegration ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-foreground">Market Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${modelInfo.currentModel.features.walletIntegration ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-foreground">Wallet Integration</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-border/20">
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium"
                >
                  Got it, thanks!
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Simple button component to trigger the modal
export const ModelInfoButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-full transition-colors"
        title="View AI model information"
      >
        <MdIcons.MdSmartToy size={16} />
        <span>Pro Model</span>
      </button>
      <ModelInfoDisplay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};