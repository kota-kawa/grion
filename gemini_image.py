import google.generativeai as genai
import PIL.Image
from dotenv import load_dotenv
import os
import io
import base64

# .envファイルの読み込み
load_dotenv()

gemini_api_key = os.getenv("Gemini_API_KEY")
genai.configure(api_key=gemini_api_key)

def chain_main(prompt, image_file):
    # 画像を読み込み、JPEG保存用にRGBに変換
    image = PIL.Image.open(image_file)
    if image.mode != "RGB":
        image = image.convert("RGB")
    
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    img_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    # SDK が期待する形式に合わせてメッセージを作成
    messages = [
        {
            "role": "user",
            "parts": [
                {"text": prompt},
                {"inline_data": {"data": img_b64, "mime_type": "image/jpeg"}}
            ]
        }
    ]
    
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(messages)
    output_text = response.text
    print(output_text)
    return output_text