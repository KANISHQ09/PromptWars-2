import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        
        # Load election data for grounding
        data_path = os.path.join(os.path.dirname(__file__), "..", "data", "election_data.json")
        with open(data_path, "r") as f:
            self.election_data = json.load(f)
            
        self.system_prompt = f"""
        You are an AI Election Assistant specializing in the Indian General Election (Lok Sabha) process.
        Your goal is to help users understand timelines, steps, and procedures in an interactive and easy-to-follow way.
        
        Use the following structured data as your primary knowledge base:
        {json.dumps(self.election_data, indent=2)}
        
        Instructions:
        1. Be professional, neutral, and informative.
        2. If a user asks about steps, refer to the 'key_steps' and 'timeline' in the data.
        3. Break down complex terms like MCC, EVM, and VVPAT simply.
        4. If a user's question is not covered by the data, use your general knowledge about Indian Elections but stay within the scope of educational assistance.
        5. Encourage users to register to vote and participate in the democratic process.
        6. Keep responses concise and easy to read. Use bullet points where appropriate.
        7. Use **bold text** for key terms, dates, constitutional articles, and important names to make them stand out.
        """
        
        self.model = genai.GenerativeModel(
            'gemini-flash-latest',
            system_instruction=self.system_prompt
        )

    async def get_chat_response(self, user_message: str, history: list = []):
        # Gemini history format: [{'role': 'user', 'parts': ['...']}, {'role': 'model', 'parts': ['...']}]
        # If history is provided as strings or other formats, we need to adapt.
        # For now, we assume it's correctly formatted or empty.
        
        print(f"DEBUG: History size: {len(history)}")
        chat = self.model.start_chat(history=history)
        
        print(f"DEBUG: Sending message to Gemini: {user_message}")
        try:
            # Using sync send_message for now to debug, can be changed to send_message_async later
            response = chat.send_message(user_message)
            print(f"DEBUG: Received response from Gemini: {response.text[:50]}...")
            return response.text
        except Exception as e:
            print(f"ERROR in Gemini send_message: {str(e)}")
            raise e

ai_service = AIService()
