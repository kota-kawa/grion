function checkFileSize(input) {
    var file = input.files[0];
    if (file && file.size > 5242880) { // 5MB = 5 * 1024 * 1024 bytes
        alert("The file size must be less than 5MB.");
        input.value = ""; // Clear the file input
    }
}

// Shift + Enterでも送信
$(document).on('keydown', function (e) {
    if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault(); // Prevent default newline behavior
        $('#chat-form').submit(); // Trigger form submission
    }
});

$(function () {
    $('#chat-form').on('submit', function (e) {
        e.preventDefault();
        var message = $('#message').val();
        var pdfFile = $('#image_file')[0].files[0];

        // Show alert and stop sending if message is empty
        if (message.trim() === "") {
            alert("Please type a message before sending.");
            return;
        }

        var formData = new FormData(this);

        //Delete form data
        $('#message').val('');
        $('#image_file').val('');
        $('#message').css('height', 'auto'); 

        //Check PDF file exist
        if (pdfFile) {
            $('#messages').append("<div class='message outgoing-message'><div class='user'>You</div><div class='text'>" + message + " + ( <i class='bi bi-card-image'></i> " + pdfFile.name + " )" + '</div></div>');
        }
        else{
            $('#messages').append("<div class='message outgoing-message'><div class='user'>You</div><div class='text'>" + message + '</div></div>');
        }


        $('#messages').append("<div class='message incoming-message'>\
            <div class='d-flex align-items-center'>\
            <img src='/static/Grion.jpg' alt='Grion Icon' class='rounded-circle' mx-1 my-1 width='50' height='50'>\
            <div class='user mx-3'>Grion</div>\
            </div>\
        <div class='text agent-message'>" +

            "<div class='spinner-container'>\
                <div class='spinner-grow text-success' role='status'>\
                    <span class='visually-hidden'>Loading...</span>\
                    </div></div>"+
            '</div>\
        </div>');

        $('#messages').scrollTop($('#messages')[0].scrollHeight);
        $.ajax({
            type: 'POST',
            url: '/post',
            data: formData, // Submit form data
            processData: false, // Set to not process data
            contentType: false, // Set content type to not set

            success: function (data) {
                /*Delete form data
                $('#message').val('');
                $('#image_file').val('');
                $('#message').css('height', 'auto'); */
                $('.spinner-container:last').remove();
                $('.agent-message:last').append(data.response);

                // Scroll to see latest messages
                $('#messages').scrollTop($('#messages')[0].scrollHeight);

                if (data.data_dic['color'] !== "" && data.data_dic['change_object1'] !== "") {
                    document.getElementById(data.data_dic['change_object1']).style.backgroundColor = data.data_dic['color'];
                }

                else if (data.data_dic['change_object1'] !== "" && data.data_dic['change_object2'] !== "") {
                    swapElements(data.data_dic['change_object1'], data.data_dic['change_object2']);

                }
                else if (data.data_dic['play_animation'] == "play") {
                    clickTest();
                }
                else if (data.data_dic['form_text'] !== "") {
                    var textInput = document.getElementById('text-form');
                    textInput.value = data.data_dic['form_text'];
                }

                else if (data.data_dic['word_file'] !== "") {
                    var file_path = "<a href='/var/www/grion/static/sample.docx' download='filename.docx'>Download<i class='bi bi-download'></i></a>";

                    // Get the last .agent-message element
                    var agentMessages = document.querySelectorAll('.agent-message');
                    var lastAgentMessage = agentMessages[agentMessages.length - 1];

                    // Create data.response as a new element and add it to the last .agent-message element
                    var responseElement = document.createElement('div');
                    responseElement.innerHTML = file_path;
                    lastAgentMessage.appendChild(responseElement);
                }

                else if (data.data_dic['bold_text'] !== "") {
                    // Get the ID of the element that makes part of the text bold
                    var element = document.getElementById('StarWars-text');
                    // Get the text of an element
                    var text = element.innerHTML;
                    // Specify parts to be bold
                    var boldPart = data.data_dic['bold_text'];
                    // Find the start position of the part to make bold
                    var startIndex = text.indexOf(boldPart);
                    // Processing when the specified part does not exist
                    if (startIndex === -1) {
                        console.log("The specified part was not found.");
                        return;
                    }
                    // Calculate the end position of the part to be bolded
                    var endIndex = startIndex + boldPart.length;
                    // Enclose the part to be bolded in <strong> tags
                    var newText = text.slice(0, startIndex) + '<strong>' + text.slice(startIndex, endIndex) + '</strong>' + text.slice(endIndex);
                    // Insert modified text into element
                    element.innerHTML = newText;
                }
                else if (data.data_dic['delete_object'] !== "") {
                    var element = document.getElementById(data.data_dic['delete_object']);
                    if (element) {

                        element.remove(element);
                    } else {
                        console.log("Element with ID 'your_element_id' not found.");
                    }
                }
                else if (data.data_dic['new_object'] !== "") {
                    var targetDiv = document.querySelector('.button-area');
                    if (data.data_dic['new_object'] == "text-form") {
                        // Creates a new text input element
                        var newInput = document.createElement('input');
                        newInput.type = 'text';
                        newInput.id = 'new_text_form';
                        newInput.className = 'form-control mt-5';
                        newInput.placeholder = 'Type your message...';
                        targetDiv.appendChild(newInput);
                    }
                    else if (data.data_dic['new_object'] == "button") {
                        //To avoid duplication of existing button ids
                        var newButton = document.createElement('button');
                        newButton.className = 'btn mt-5';
                        newButton.textContent = 'New button';
                        newButton.style.backgroundColor = "rgba(132, 132, 147, 0.5)";
                        var existingButton = document.getElementById('new_button');
                        if (existingButton) {
                            var newId = 'new_button';
                            var count = 2;
                            while (document.getElementById(newId)) {
                                newId = 'new_button' + count;
                                newButton.textContent = 'New button' + count;
                                count++;
                            }
                            newButton.id = newId;
                        }
                        else {
                            newButton.id = 'new_button';
                            newButton.textContent = 'New button';
                        }
                        newButton.className = 'btn mt-5';
                        newButton.style.backgroundColor = "rgba(132, 132, 147, 0.5)";
                        if (data.data_dic["new_object_color"] !== "") {
                            newButton.style.backgroundColor = data.data_dic["new_object_color"]; // 背景色を青に設定
                        }
                        targetDiv.appendChild(newButton);
                    }


                }
            }
        });


    });
});


//Animation
function clickTest() {
    target = document.getElementById("anime_test");
    if (target.className == null || target.className == "") {
        target.className = "active";
    } else {
        target.className = "";
    }
}




//Mic
let recognition = new webkitSpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let isRecording = false;

document.querySelector('#record').onclick = () => {
    var recordButton = document.getElementById('record');
    if (!isRecording) {
        recognition.start();
        isRecording = true;
        recordButton.classList.remove('btn-record');
        recordButton.classList.add('btn-info');

    } else {
        recognition.stop();
        isRecording = false;
        recordButton.classList.remove('btn-info');
        recordButton.classList.add('btn-record');
    }
};

recognition.onresult = (event) => {
    let last = event.results.length - 1;
    let text = event.results[last][0].transcript;

    document.getElementById("message").value = text;
};


function swapElements(id1, id2) {
    // get element
    var element1 = document.getElementById(id1);
    var element2 = document.getElementById(id2);

    // Add animation class
    element1.classList.add('animated');
    element2.classList.add('animated');

    // Temporarily save element 1
    var temp = document.createElement('div');

    // Insert element 1 before element 2
    element2.parentNode.insertBefore(temp, element2);
    element1.parentNode.insertBefore(element2, element1);
    temp.parentNode.insertBefore(element1, temp);

    // remove temporary elements
    temp.parentNode.removeChild(temp);

    // Reposition element on next frame to apply animation
    requestAnimationFrame(function () {
        element1.style.transform = "translateX(" + (element2.offsetLeft - element1.offsetLeft) + "px)";
        element2.style.transform = "translateX(" + (element1.offsetLeft - element2.offsetLeft) + "px)";
    });

    // Delete animation class after animation ends
    setTimeout(function () {
        element1.classList.remove('animated');
        element2.classList.remove('animated');
        element1.style.transform = "";
        element2.style.transform = "";
    }, 300); // Delete class after 0.3 seconds
}

//Enter text into form
var textInput = document.getElementById('text-form'); // Get form element
// Function to input characters into form
function setInputText(text) {
    textInput.value = text; // Set text on form
}


//////////////////////////////////////////////////

$(document).ready(function () {
    $("#information").click(function (event) {
        $("#infoText").toggle();
        event.stopPropagation(); // クリックイベントをバブルアップしない
    });

    $(document).click(function () {
        $("#infoText").hide();
    });

    $("#infoText").click(function (event) {
        event.stopPropagation(); // infoText自体をクリックしたときは非表示にしない
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const messageInput = document.getElementById('message');

    messageInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px'; // 最大高さを200pxに設定
        //window.scrollTo(0, document.body.scrollHeight);  下にスクロール
    });
});