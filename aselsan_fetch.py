"""Fetch the last 40 days of ASELSAN (ASELS.IS, Borsa Istanbul) OHLCV data and save to CSV."""
import yfinance as yf

SYMBOL = "ASELS.IS"
DAYS = 40
OUTPUT = "aselsan_last_40_days.csv"


def main():
    # 40 trading days; request extra calendar days then keep the last 40 rows
    df = yf.Ticker(SYMBOL).history(period="6mo", interval="1d")
    if df.empty:
        raise SystemExit("No data returned for " + SYMBOL)
    df = df[["Open", "Close", "Low", "High", "Volume"]].tail(DAYS)
    df.index = df.index.strftime("%Y-%m-%d")
    df.index.name = "Date"
    df.columns = ["Open", "Close", "Min", "Max", "Volume"]
    df.round(2).to_csv(OUTPUT)
    print(df.round(2))
    print("Saved to", OUTPUT)


if __name__ == "__main__":
    main()
