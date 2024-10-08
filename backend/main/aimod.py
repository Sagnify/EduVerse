import google.generativeai as genai
from google.cloud import vision
import os
import requests
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Set environment variable for Google Cloud Vision API credentials
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = '/etc/secrets/google-cloud-vision.json'

# Initialize the Gemini model
model = genai.GenerativeModel("gemini-1.5-flash")

def moderate_post_with_gemini(post_content, has_educational_labels=False):
    try:
        # Define the prompt with a request for a formatted response
        prompt = (
            f"Please analyze the following content and provide a clear, formatted response. "
            f"Indicate whether the content is educational or study-related. "
            f"Format your response as 'Educational: [Yes/No]' and provide a brief explanation if necessary.\n\n"
            f"Content: {post_content}"
        )
        logger.debug(f"Prompt sent to model: {prompt}")
        
        # Generate content using the model
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        logger.debug(f"Raw response from model: {response_text}")
        
        # Parse the response
        response_text_lower = response_text.lower()
        if 'educational: yes' in response_text_lower or 'yes' in response_text_lower:
            is_educational = True
        elif 'educational: no' in response_text_lower or 'no' in response_text_lower:
            is_educational = False
        else:
            logger.error("The response from the model was unclear or unexpected.")
            is_educational = False
        
        # Override model response if educational labels were found
        if has_educational_labels:
            logger.debug("Educational labels found, so overriding model response to educational.")
            is_educational = True

        # Add additional check for neutral captions
        if not is_educational and any(keyword in post_content.lower() for keyword in ['question', 'solve', 'explain']):
            logger.debug("Caption might be neutral but context suggests educational, so marking it as educational.")
            is_educational = True
        
        logger.debug(f"Final determination: Content is educational? {is_educational}")
        return is_educational
    except Exception as e:
        logger.error(f"An error occurred while moderating content: {e}")
        return False

def analyze_image_with_vision(image_url):
    try:
        # Initialize Google Vision API client
        client = vision.ImageAnnotatorClient()

        # Download the image
        response = requests.get(image_url)
        response.raise_for_status()  # Raise an error for bad responses

        # Load the image content into memory
        content = response.content

        # Create an image object
        image = vision.Image(content=content)

        # Perform label detection on the image
        vision_response = client.label_detection(image=image)
        labels = vision_response.label_annotations

        # Print labels for debugging
        label_descriptions = [label.description for label in labels]
        logger.debug(f"Labels found: {label_descriptions}")

        # Create a description from the labels
        description = ", ".join(label_descriptions)
        logger.debug(f"Image description: {description}")

        # Educational keywords list
        educational_keywords = [
            'education', 'school', 'classroom', 'study', 'learning', 
            'equation', 'text', 'handwritten', 'lecture', 'homework', 
            'assignment', 'textbook', 'notebook', 'quiz', 'test', 
            'exam', 'curriculum', 'lesson', 'teacher', 'student', 
            'academic', 'research', 'tutor', 'grade', 'science', 
            'mathematics', 'history', 'literature', 'biology', 'chemistry', 
            'physics', 'geography', 'language', 'grammar', 'writing', 
            'reading', 'worksheet', 'project', 'presentation', 'seminar', 
            'workshop', 'tutorial', 'study guide', 'educational tool', 
            'online course', 'e-learning', 'training', 'certification', 
            'scholarship', 'education material', 'educational game', 
            'instruction', 'manual', 'academic journal', 'reference', 
            'educational app', 'student work', 'academic paper', 'coursework', 
            'number', 'font'
        ]

        # Check for educational labels
        has_educational_labels = any(
            label.description.lower() in educational_keywords for label in labels
        )

        if has_educational_labels:
            logger.debug("Educational label detected in image.")
            return description, True

        logger.debug("No educational labels detected in image.")
        return description, False
    
    except Exception as e:
        logger.error(f"An error occurred while analyzing the image: {e}")
        return None, False
