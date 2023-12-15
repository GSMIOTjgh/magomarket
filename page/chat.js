const Chat = (function() {
    const myName = "홍노";

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
    }

    function createMessageTag(LR_className, senderName, message) {
        const chatLi = $('div.chat.format ul li').clone();
        chatLi.addClass(LR_className);
        chatLi.find('.sender span').text(senderName);
        chatLi.find('.message span').text(message);
        return chatLi;
    }

    function appendMessageTag(LR_className, senderName, message) {
        const chatLi = createMessageTag(LR_className, senderName, message);
        $('div.chat:not(.format) ul').append(chatLi);
        // 스크롤 송출 시간.
        setTimeout(scrollToBottom, 0);
    }

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

// MutationObserver를 생성하고 채팅창을 감시.
const chatDiv = document.querySelector('.chat');
const observer = new MutationObserver((mutationsList) => {
    // 스크롤이 변화하면 최하단으로 이동.
    scrollToBottom();
});

// MutationObserver 시작 코드.
observer.observe(chatDiv, { childList: true });
