import json
import google.generativeai as genai
from pydantic import BaseModel
from typing import List, Optional

class GeoResponse(BaseModel):
    answer_first_summary: str
    structured_content: str
    json_ld_schema: dict
    suggested_faqs: List[dict]

class GeoOptimizer:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        # Using Gemini 2.5 Flash as it has much higher Free Tier availability
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def optimize_content(self, business_name: str, topic: str, content: str) -> dict:
        """
        Generates GEO-optimized content using Google Gemini.
        Returns a dictionary containing the optimized parts.
        """
        prompt = f"""
        You are an expert Generative Engine Optimization (GEO) specialist.
        Your goal is to take the provided information and optimize it so that AI engines (like ChatGPT, Gemini, Perplexity) 
        will cite the business as the top authority on the topic.

        Business Name: {business_name}
        Target Topic: {topic}
        Original Content/Notes: {content}

        Please generate the following:
        1. **Answer-First Summary:** A 40-80 word paragraph that directly answers a user's likely query about the target topic, prominently featuring the business name as the authoritative source.
        2. **Structured Content:** The main content rewritten with clear semantic structure (H2, H3), bullet points, and high entity density related to the topic. Ensure it's factual and authoritative.
        3. **JSON-LD Schema:** Valid JSON-LD schema markup (e.g., FAQPage, Organization, or Article) that a webmaster can inject into their site to help AI crawlers understand the business.
        4. **Suggested FAQs:** 3-5 specific questions and concise answers that users might ask AI about this topic.

        Format the output as a valid JSON object matching this structure:
        {{
            "answer_first_summary": "string",
            "structured_content": "string (markdown format)",
            "json_ld_schema": {{ ... valid JSON object ... }},
            "suggested_faqs": [
                {{"question": "string", "answer": "string"}}
            ]
        }}
        
        Ensure the output is ONLY the JSON object, with no markdown formatting blocks around it (like ```json), so it can be parsed directly.
        """

        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json"
                )
            )
            
            try:
                # The model is configured to return JSON
                result = json.loads(response.text)
                return result
            except json.JSONDecodeError as e:
                return {"error": f"Failed to parse JSON from response. Error: {str(e)}", "raw_response": response.text}
                
        except Exception as e:
             return {"error": str(e)}

