import google.generativeai as genai
import sys

try:
    genai.configure(api_key="AIzaSyDaL5xPt5SGPHaG2cA_lH0OY34udIxvz_U")
    models = genai.list_models()
    print("Available models supporting generateContent:")
    for m in models:
        if "generateContent" in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"Error: {e}")
