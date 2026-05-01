import streamlit as st
import json
import os
from geo_optimizer import GeoOptimizer

SAVE_FILE = "last_inputs.json"

if 'loaded' not in st.session_state:
    st.session_state['loaded'] = True
    if os.path.exists(SAVE_FILE):
        try:
            with open(SAVE_FILE, 'r') as f:
                saved = json.load(f)
                for k, v in saved.items():
                    if k not in st.session_state:
                        st.session_state[k] = v
        except Exception:
            pass

def save_inputs():
    data = {
        'api_key': st.session_state.get('api_key', ''),
        'business_name': st.session_state.get('business_name', ''),
        'target_topic': st.session_state.get('target_topic', ''),
        'original_content': st.session_state.get('original_content', '')
    }
    with open(SAVE_FILE, 'w') as f:
        json.dump(data, f)

st.set_page_config(
    page_title="GEO Content Optimizer",
    page_icon="🚀",
    layout="wide"
)

st.title("🚀 Generative Engine Optimization (GEO) Optimizer")
st.markdown("""
This application helps you structure your business content to be easily discoverable and highly cited by AI Search Engines like ChatGPT, Perplexity, and Gemini.
""")

# Sidebar for configuration
with st.sidebar:
    st.header("⚙️ Configuration")
    api_key = st.text_input("Google Gemini API Key", type="password", key="api_key", on_change=save_inputs, help="Get your API key from Google AI Studio")
    
    if not api_key:
        st.warning("Please enter your Google Gemini API Key to use the application.")
        st.markdown("[Get API Key Here](https://aistudio.google.com/app/apikey)")

# Main content area
st.subheader("Business Information")
col1, col2 = st.columns(2)

with col1:
    business_name = st.text_input("Business Name", key="business_name", on_change=save_inputs, placeholder="e.g., Apex Tech Solutions")
with col2:
    target_topic = st.text_input("Target Topic / Industry", key="target_topic", on_change=save_inputs, placeholder="e.g., Enterprise Cloud Migration")

original_content = st.text_area(
    "Original Content / Notes", 
    height=200, 
    key="original_content",
    on_change=save_inputs,
    placeholder="Paste your current website text, notes about your business, or key facts you want AI to know."
)

if st.button("Optimize for AI Search Engines", type="primary"):
    if not api_key:
        st.error("API Key is missing!")
    elif not business_name or not target_topic or not original_content:
        st.error("Please fill in all fields (Business Name, Target Topic, and Original Content).")
    else:
        with st.spinner("Analyzing and optimizing content for Generative Engines..."):
            optimizer = GeoOptimizer(api_key=api_key)
            result = optimizer.optimize_content(business_name, target_topic, original_content)
            
            if "error" in result:
                st.error(f"An error occurred: {result['error']}")
                if "raw_response" in result:
                     with st.expander("Raw API Response"):
                         st.write(result["raw_response"])
            else:
                st.success("Optimization Complete! See your GEO-ready assets below.")
                
                tab1, tab2, tab3, tab4 = st.tabs([
                    "1️⃣ Answer-First Summary", 
                    "2️⃣ Structured Content", 
                    "3️⃣ JSON-LD Schema", 
                    "4️⃣ Suggested FAQs"
                ])
                
                with tab1:
                    st.markdown("### Answer-First Summary")
                    st.info("💡 **GEO Tip:** Place this exactly at the top of your webpage. AI bots read top-down and prioritize concise, direct answers.")
                    st.write(result.get("answer_first_summary", ""))
                    
                with tab2:
                    st.markdown("### Semantic Structured Content")
                    st.info("💡 **GEO Tip:** Use rich formatting (H2s, H3s, Lists). This makes it easy for AI to extract your facts.")
                    st.markdown(result.get("structured_content", ""))
                    
                with tab3:
                    st.markdown("### JSON-LD Schema Markup")
                    st.info("💡 **GEO Tip:** Paste this `<script>` block in the `<head>` of your webpage to explicitly map your business to this topic for crawlers.")
                    schema_data = result.get("json_ld_schema", {})
                    st.code(
                        f'<script type="application/ld+json">\n{json.dumps(schema_data, indent=2)}\n</script>',
                        language="html"
                    )
                    
                with tab4:
                    st.markdown("### Target Q&A Pairs")
                    st.info("💡 **GEO Tip:** Adding a Q&A section helps your content match conversational queries posed to LLMs.")
                    for faq in result.get("suggested_faqs", []):
                        st.markdown(f"**Q: {faq.get('question', '')}**")
                        st.markdown(f"A: {faq.get('answer', '')}")
                        st.divider()
