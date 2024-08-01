from flask import Flask, request, jsonify, render_template, redirect
import task_agent
import gemini_image

app = Flask(__name__)

@app.route('/')
def chat():
    return render_template('chat_sma.html')

@app.route('/post', methods=['POST'])
def post():
    data_dic= {
    "color": "",
    "change_object1": "",
    "change_object2": "",
    "play_animation":"",
    "form_text":"",
    "new_object":"",
    "new_object_color":"",
    "delete_object":"",
    "bold_text":"",
    "word_file":"",
    }  
    prompt = request.form['message']
    image_file = request.files['image_file']

    # Check if file was uploaded
    if image_file:
        # Check if the file size is less than or equal to 5MB
        if len(image_file.read()) <= 5 * 1024 * 1024:
            image_file.seek(0)  # Reset file pointer to the beginning after reading
            response = gemini_image.chain_main(prompt, image_file)
        else:
            response = "File size exceeds the 5MB limit."
    else:
        response, data_dic = task_agent.main_agent(prompt)

    return jsonify({'response': response, 'data_dic': data_dic}) 

if __name__ == '__main__':
    app.run(debug=True)
   
