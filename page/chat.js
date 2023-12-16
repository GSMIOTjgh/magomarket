const Chat = (function() {
    const myName = "건희";

    function init() {
        // Enter 키를 눌렀을 때 메시지 전송
        $(document).on('keydown', '#messageInput', function(e) {
            if (e.keyCode == 13 && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // 전송 버튼 클릭 시 메시지 전송
        $(document).on('click', '#sendMessageButton', function() {
            sendMessage();
        });

        // 이미지 업로드 input의 변경 이벤트 처리
        $(document).on('change', '#imageInput', function () {
            const fileInput = document.getElementById('imageInput');
            const file = fileInput.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const imageDataUrl = e.target.result;
                    sendImage(imageDataUrl); // 이미지 업로드 시 이미지 전송 함수 호출
                };

                reader.readAsDataURL(file);
            }
        });
    }

    function createMessageTag(LR_className, senderName, message) {
        const chatLi = $('div.chat.format ul li').clone();
        chatLi.addClass(LR_className);
        chatLi.find('.sender span').text(senderName);
        chatLi.find('.message span').text(message);
        return chatLi;
    }

    // 이미지를 채팅창에 추가하는 부분
    function appendImageTag(LR_className, senderName, imageUrl) {
        const chatLi = createMessageTag(LR_className, senderName, "");
        chatLi.find('.message span').html(`<img src="${imageUrl}" alt="이미지">`);
        $('div.chat:not(.format) ul').append(chatLi);
        // 스크롤 송출 시간.
        setTimeout(scrollToBottom, 0);
    }

    // 이미지를 전송하는 함수
    function sendImage(imageUrl) {
        const senderName = myName;
        const data = {
            "senderName": senderName,
            "message": "", // 이미지는 텍스트 없이 전송
            "image": imageUrl // 이미지 주소를 전송
        };
        // 여기서 서버로 이미지를 전송하고, 성공적으로 전송된 경우에만 아래 함수 호출
        appendImageTag("right", senderName, imageUrl);
        setTimeout(scrollToBottom, 0);
    }

    // 채팅 메시지를 전송하는 함수
    function sendMessage() {
        const message = $('#messageInput').val();
        if (message.trim() !== "") {
            const senderName = myName;
            const data = {
                "senderName": senderName,
                "message": message
            };
            resive(data);
            clearTextarea();
        }
    }

    function clearTextarea() {
        $('#messageInput').val('');
    }

    function resive(data) {
        const LR = (data.senderName != myName) ? "left" : "right";
        appendMessageTag(LR, data.senderName, data.message);
    }

    // 채팅창의 메시지를 추가하는 함수
    function appendMessageTag(LR_className, senderName, message) {
        const chatLi = createMessageTag(LR_className, senderName, message);
        $('div.chat:not(.format) ul').append(chatLi);
        setTimeout(scrollToBottom, 0);
    }

    return {
        'init': init
    };
})();

$(function(){
    Chat.init();
});

function scrollToBottom() {
    const chatDiv = document.querySelector('.chat');
    if (chatDiv) {
        chatDiv.scrollTop = chatDiv.scrollHeight;
    }
}

const chatDiv = document.querySelector('.chat');
const observer = new MutationObserver((mutationsList) => {
    scrollToBottom();
});

observer.observe(chatDiv, { childList: true });

$(document).on('click', '.upload-button', function () {
    $('#imageInput').click();
});

$(document).on('change', '#imageInput', function () {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('image', file);

        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/send-message',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                console.log(response);
            },
            error: function (error) {
                console.error(error);
            }
        });
    }
});

function clearImageInput() {
    $('#imageInput').val('');
}

// 이미지를 로컬 스토리지에 저장하는 함수
function saveImageToLocalStorage(imageDataUrl) {
    localStorage.setItem("profileImage", imageDataUrl);
}

// 로컬 스토리지에서 이미지를 가져와서 프로필 이미지를 설정하는 함수
function setProfileImageFromLocalStorage() {
    var savedProfileImage = localStorage.getItem("profileImage");
    if (savedProfileImage) {
        document.getElementById('profileImage').src = savedProfileImage;
    }
}

// 이미지를 선택하고 저장하는 함수
function uploadimg() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = function (event) {
        var file = event.target.files[0];

        if (file) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var imageDataUrl = e.target.result;

                // 이미지를 로컬 스토리지에 저장
                saveImageToLocalStorage(imageDataUrl);

                // 프로필 이미지를 설정
                setProfileImageFromLocalStorage();

                // 이미지 출력 및 스크롤 송출
                appendImageTag("right", myName, imageDataUrl);
                setTimeout(scrollToBottom, 0);
            };

            reader.readAsDataURL(file);
        }
    };

    input.click();
}

// 페이지 로드 시 저장된 이미지를 프로필 이미지로 설정
window.addEventListener("load", function () {
    setProfileImageFromLocalStorage();
});

// 페이지 로드 시 처음 이미지를 선택하여 설정
document.addEventListener("DOMContentLoaded", function () {
    // 초기 이미지 출력
    const savedProfileImage = localStorage.getItem("profileImage");
    if (savedProfileImage) {
        setProfileImageFromLocalStorage();
        appendImageTag("right", myName, savedProfileImage);
        scrollToBottom();
    }
});
