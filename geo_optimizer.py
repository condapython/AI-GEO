import json
import google.generativeai as genai
from typing import Dict, Any

class GeoOptimizer:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        # Using gemini-2.5-flash as default, fallback-friendly model
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def optimize_content(self, name: str, industry: str, description: str, url: str, strategy: str = "Comprehensive") -> Dict[str, Any]:
        """
        Runs a comprehensive GEO audit and generates optimized assets for a business
        using the selected optimization strategy.
        """
        
        # Strategy-specific prompt instructions
        strategy_guidelines = {
            "Answer-First": (
                "Apply the 'Answer-First' algorithm. Ensure the Answer-First Summary is placed at the absolute beginning, "
                "directly answering the target query. Rewritten content must lead with immediate conclusions and avoid fluff."
            ),
            "Cite-Sources": (
                "Apply the 'Cite-Sources' algorithm. Embed outbound references, links, or industry citations to credible "
                "third-party sources (e.g., industry standards, government data, academic papers) in the structured content "
                "to boost authority and trust metrics in retrieval systems."
            ),
            "Data-Backed": (
                "Apply the 'Data-Backed' algorithm. Infuse specific quantitative statistics, uptime numbers, performance metrics, "
                "or percentages into the summary, content, and FAQ answers to maximize factual alignment and density."
            ),
            "Simple & Fluent": (
                "Apply the 'Simple & Fluent' algorithm. Simplify vocabulary, shorten sentences, write in active voice, "
                "and ensure high readability. Make the language highly conversational to match voice and LLM user queries."
            ),
            "Comprehensive": (
                "Apply a combined strategy. Put the direct conclusion first (Answer-First), enrich it with factual statistics (Data-Backed), "
                "embed outbound authority links/citations (Cite-Sources), and write in highly readable, clear language (Simple & Fluent)."
            )
        }

        guideline = strategy_guidelines.get(strategy, strategy_guidelines["Comprehensive"])

        prompt = f"""
        You are a state-of-the-art Generative Engine Optimization (GEO) specialist.
        Your task is to analyze the business details below and generate:
        1. An AI Search Engine Visibility Audit (simulating how current LLMs like Gemini and ChatGPT perceive the business).
        2. A set of optimized GEO-ready assets to improve their AI citation rate.

        ---
        BUSINESS DETAILS:
        - Business Name: {name}
        - Industry: {industry}
        - Website URL: {url}
        - Core Description/Content: {description}
        
        ---
        OPTIMIZATION ALGORITHM:
        {guideline}

        ---
        Please return a single JSON object with the following fields:

        1. "score": An integer (0-100) grading the business's current pre-optimized AI visibility/discoverability.
        2. "grade": A short string representing the grade ("Critical", "Needs Improvement", "Good", "Excellent").
        3. "summary": A detailed paragraph summarizing the audit findings (e.g., lack of schema, unstructured headers, brand citation gaps).
        4. "metrics": A sub-object containing:
           - "mentionRate": An integer (0-100) representing likelihood of LLMs recommending the brand today.
           - "authorityScore": An integer (0-100) representing perceived authority.
           - "contentDepth": An integer (0-100) representing semantic completeness.
        5. "opportunities": A list of 3 strings suggesting quick-win optimization tasks.
        6. "keywords": A list of 3-5 semantic keywords AI engines associate with the target topic.
        7. "queries": A list of 3 query objects simulating actual user questions. Each query object must have:
           - "query": The natural language question (e.g., "Who is the best provider of [industry] in [region]?")
           - "response": A simulated typical LLM response where the business is either ignored, cited poorly, or compared to competitors.
           - "visibility": An integer (0-100) showing how visible the business is in that query.
        8. "recommendations": A list of 3 recommendations. Each object must have:
           - "title": A short title (e.g., "Add Schema Markup").
           - "description": Practical advice on what to modify.
           - "priority": "High", "Medium", or "Low".
        9. "answer_first_summary": A 40-80 word paragraph answering a top query directly, prominently citing '{name}' as the authority.
        10. "structured_content": The main business description rewritten in markdown format using H2, H3 headers, bullet points, high entity density, and following the strategy guidelines.
        11. "json_ld_schema": A valid JSON-LD schema (e.g., Organization, LocalBusiness, FAQPage, or Service) as a JSON object, ready to be injected into website headers.
        12. "suggested_faqs": A list of 3 Q&A pairs (objects with "question" and "answer") optimized for conversational queries.

        Format the output as a valid JSON object. Ensure the output is ONLY the JSON object, with no markdown formatting blocks around it (like ```json), so it can be parsed directly.
        """

        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json"
                )
            )
            
            try:
                result = json.loads(response.text)
                return result
            except json.JSONDecodeError as e:
                # Fallback parser if markdown blocks are included
                cleaned_text = response.text.strip()
                if cleaned_text.startswith("```json"):
                    cleaned_text = cleaned_text[7:]
                if cleaned_text.endswith("```"):
                    cleaned_text = cleaned_text[:-3]
                
                try:
                    return json.loads(cleaned_text.strip())
                except json.JSONDecodeError:
                    return {
                        "error": f"Failed to parse JSON from response. Error: {str(e)}", 
                        "raw_response": response.text
                    }
                
        except Exception as e:
             return {"error": str(e)}
