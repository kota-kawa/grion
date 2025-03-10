import google.generativeai as genai
import PIL.Image

from dotenv import load_dotenv
import os

#.envファイルの読み込み
load_dotenv()

# 環境変数の値を取得
gemini_api_key = os.getenv("Gemini_API_KEY")

genai.configure(api_key=gemini_api_key)
# モデルを選択
model = genai.GenerativeModel('gemini-2.0-flash')


def chain_main(prompt, image_file):
    # チャット履歴を初期化
    model.start_chat(history=[])

    # 画像を読み込む
    image_path = PIL.Image.open(image_file)

    # プロンプトと画像を使用してコンテンツを生成
    output = model.generate_content([prompt, image_path], stream=True)
    output.resolve()

    # レスポンスを表示
    print(output.text)

    return output.text
