import { getTradingInsight } from '../services/geminiService';
import { getPortfolioBalance, placeBuyOrder, placeSellOrder, loadTradeHistory, saveTradeHistory } from '../services/exchangeService';
import { AiInsight, BotStatus, CryptoDataPoint, Portfolio, Trade, TradingSignal } from '../types';
import { fetchLatestPrice } from '../services/marketDataService';

const ANALYSIS_INTERVAL = 15000; // 15 seconds
const TRADE_AMOUNT_EUR = 500; // Trade a fixed €500 value per transaction
const GEMINI_API_KEY = process.env.API_KEY || ''; // This would be your Gemini API Key on the server

/**
 * This class simulates a backend trading bot. In a real-world scenario, this
 * would run persistently on a server, not in the browser.
 */
class TradingBot {
    private isRunning: boolean = false;
    private isAnalyzing: boolean = false;
    private statusMessage: string = 'Offline';
    private portfolio: Portfolio = { eur: 0, btc: 0 };
    private tradeHistory: Trade[] = [];
    private lastInsight: AiInsight | null = null;
    private analysisIntervalId: number | null = null;
    
    constructor() {
        this.loadInitialState();
    }

    private async loadInitialState() {
        // In a real backend, you'd load from a database.
        this.tradeHistory = await loadTradeHistory();
        // For this simulation, we fetch the portfolio on start.
    }

    public async start() {
        if (this.isRunning) {
            console.log("[Bot] Bot is already running.");
            return;
        }
        console.log("[Bot] Starting bot...");
        this.isRunning = true;
        this.statusMessage = 'Fetching portfolio...';
        
        try {
            this.portfolio = await getPortfolioBalance();
            this.statusMessage = 'Enabled';
            this.analysisIntervalId = window.setInterval(() => this.runAnalysisCycle(), ANALYSIS_INTERVAL);
            this.runAnalysisCycle(); // Run immediately on start
        } catch (error) {
            console.error("[Bot] Failed to start bot due to portfolio fetch error:", error);
            this.statusMessage = 'Error on start';
            this.isRunning = false;
        }
    }

    public stop() {
        if (!this.isRunning) {
            console.log("[Bot] Bot is not running.");
            return;
        }
        console.log("[Bot] Stopping bot...");
        this.isRunning = false;
        this.isAnalyzing = false;
        this.statusMessage = 'Offline';
        if (this.analysisIntervalId) {
            clearInterval(this.analysisIntervalId);
            this.analysisIntervalId = null;
        }
    }

    private async runAnalysisCycle() {
        if (this.isAnalyzing || !this.isRunning) {
            return;
        }
        this.isAnalyzing = true;
        this.statusMessage = 'Analyzing...';
        console.log("[Bot] Starting new analysis cycle...");

        try {
            // 1. Fetch latest price data using the centralized service
            const latestPricePoint = await fetchLatestPrice();
            const latestPrice = latestPricePoint.price;
            
            // A real bot would use a proper historical data series.
            const mockPriceData: CryptoDataPoint[] = [latestPricePoint];

            // 2. Get AI insight
            const insight = await getTradingInsight(mockPriceData, GEMINI_API_KEY);
            this.lastInsight = insight;

            // 3. Execute trade based on insight
            if ((insight.signal === TradingSignal.BUY || insight.signal === TradingSignal.SELL) && insight.confidence > 60) {
                 await this.executeTrade(insight.signal, latestPrice);
            }
        } catch (e) {
            console.error("[Bot] Analysis cycle failed", e);
            this.lastInsight = {
                signal: TradingSignal.HOLD,
                reasoning: "An error occurred during analysis.",
                confidence: 0
            };
        } finally {
            this.isAnalyzing = false;
            if (this.isRunning) {
                this.statusMessage = 'Enabled';
            }
            console.log("[Bot] Analysis cycle finished.");
        }
    }

    private async executeTrade(signal: TradingSignal.BUY | TradingSignal.SELL, price: number) {
        console.log(`[Bot] High confidence signal received: ${signal}. Attempting to execute trade.`);
        
        let tradeResult: { success: boolean; btcAmount: number; price: number; } | null = null;
        
        if (signal === TradingSignal.BUY && this.portfolio.eur >= TRADE_AMOUNT_EUR) {
            tradeResult = await placeBuyOrder(TRADE_AMOUNT_EUR);
        } else if (signal === TradingSignal.SELL) {
             const btcToSell = TRADE_AMOUNT_EUR / price;
             if (this.portfolio.btc >= btcToSell) {
                tradeResult = await placeSellOrder(TRADE_AMOUNT_EUR);
             }
        }

        if (tradeResult?.success) {
            // In a real scenario, you'd refetch the portfolio to confirm the trade's effect.
            // For this simulation, we optimistically update it.
            if (signal === TradingSignal.BUY) {
                this.portfolio.eur -= TRADE_AMOUNT_EUR;
                this.portfolio.btc += tradeResult.btcAmount;
            } else {
                this.portfolio.eur += TRADE_AMOUNT_EUR;
                this.portfolio.btc -= tradeResult.btcAmount;
            }

            const newTrade: Trade = {
                id: new Date().toISOString(),
                type: signal,
                price: tradeResult.price,
                amountBtc: tradeResult.btcAmount,
                time: new Date().toLocaleTimeString()
            };
            this.tradeHistory = [newTrade, ...this.tradeHistory].slice(0, 100);
            await saveTradeHistory(this.tradeHistory);
            console.log("[Bot] Trade executed and history saved.");
        }
    }

    public getStatus(): BotStatus {
        return {
            isRunning: this.isRunning,
            isAnalyzing: this.isAnalyzing,
            statusMessage: this.statusMessage,
        };
    }

    public getPortfolio(): Portfolio {
        return this.portfolio;
    }

    public getTradeHistory(): Trade[] {
        return this.tradeHistory;
    }

    public getLatestInsight(): AiInsight | null {
        return this.lastInsight;
    }
}

// Singleton instance to simulate a single backend process
export const tradingBot = new TradingBot();