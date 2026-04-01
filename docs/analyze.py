import pandas as pd
import json

def analyze():
    filepath = "Наш семейный бюджет.xlsx"
    try:
        xl = pd.ExcelFile(filepath)
        result = {}
        for sheet_name in xl.sheet_names:
            df = xl.parse(sheet_name)
            # handle NaNs
            df = df.fillna("")
            result[sheet_name] = {
                "columns": list(df.columns),
                "head": df.head(3).to_dict(orient="records"),
                "shape": df.shape
            }
        print(json.dumps(result, ensure_ascii=False, indent=2, default=str))
        with open('excel_analysis.json', 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2, default=str)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    analyze()
