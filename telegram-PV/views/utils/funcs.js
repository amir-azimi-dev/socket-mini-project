let user = null;
let activeReceiver = null;
const namespaceSocket = io("http://localhost:3000/pvs");

const querySelector = query => document.querySelector(query);
const querySelectorAll = query => document.querySelectorAll(query);

const authorizeUser = userData => {
  user = userData;
};

const showPrivateChats = pvs => {
  const pvContainer = querySelector(".sidebar__contact-list");
  pvContainer.innerHTML = "";

  const pvTemplates = getPvTemplates(pvs);
  pvContainer.insertAdjacentHTML("beforeend", pvTemplates);
  selectPvHandler();
};

const getPvTemplates = pvData => {
  pvData = pvData.filter(pv => pv._id !== user._id);

  const pvTemplateArray = pvData.map(pv => `
      <li class="sidebar__contact-item" data-pv-title="${pv.name}">
        <a class="sidebar__contact-link" href="#">
          <div class="sidebar__contact-left">
            <div class="sidebar__contact-left-left">
              <img
                class="sidebar__contact-avatar"
                src="./public/images/profile.jpg"
              />
            </div>
            <div class="sidebar__contact-left-right">
              <span class="sidebar__contact-title">${pv.name}</span>
              <div class="sidebar__contact-sender">
                <span class="sidebar__contact-sender-name">${pv.name}: </span>
                <span class="sidebar__contact-sender-text">سلام داداش خوبی؟</span>
              </div>
            </div>
          </div>
          <div class="sidebar__contact-right">
            <span class="sidebar__contact-clock">15.53</span>
            <span
              class="sidebar__contact-counter sidebar__counter sidebar__counter-active">66</span>
          </div>
        </a>
      </li>
    `
  );

  const pvTemplates = pvTemplateArray.join("");
  return pvTemplates;
};

const selectPvHandler = () => {
  const allRooms = querySelectorAll(".sidebar__contact-item");
  namespaceSocket.on("pv-info", showPvChats);

  allRooms.forEach(pv => {
    pv.addEventListener("click", event => {
      event.preventDefault();

      activeReceiver = pv.dataset.pvTitle;

      const joinData = {
        sender: user.name,
        receiver: activeReceiver
      };
      namespaceSocket.emit("join", joinData);


      const prevActiveRoom = querySelector(".sidebar__contact-link--selected");
      prevActiveRoom && prevActiveRoom.classList.remove("sidebar__contact-link--selected");
      event.currentTarget.classList.add("sidebar__contact-link--selected");

      const chatContainer = document.querySelector(".chat__content-main");
      chatContainer.innerHTML = "";
    })
  });
};

const showPvChats = pvData => {
  const chatInput = querySelector(".chat__content-bottom-bar-input");
  chatInput.value = "";

  const chatHeader = document.querySelector(".chat__header");
  chatHeader.classList.add("chat__header--active");

  const roomTitle = document.querySelector(".chat__header-name");
  roomTitle.innerHTML = pvData.receiver;

  const chatContent = document.querySelector(".chat__content");
  chatContent.classList.add("chat__content--active");

  const roomAvatar = document.querySelector(".chat__header-avatar");
  roomAvatar.src = "./public/images/profile.jpg";

  const activeChatContainer = document.querySelector(".chat__content--active");
  activeChatContainer.addEventListener("click", scrollToChatFloor);
};


const sendMessageHandler = () => {
  const chatInput = querySelector(".chat__content-bottom-bar-input");
  chatInput.addEventListener("keydown", sendMessage);
};

const sendMessage = event => {
  const message = event.target.value.trim();
  if (!message || event.key !== "Enter") {
    return;
  }

  const messageData = {
    message,
    pv: {
      sender: user.name,
      receiver: activeReceiver
    }
  };

  const chatInput = querySelector(".chat__content-bottom-bar-input");
  chatInput.value = "";
  namespaceSocket.emit("send-message", messageData);
};

const showMessageHandler = () => {
  namespaceSocket.off("confirm-message");
  namespaceSocket.on("confirm-message", showMessage);
};

const showMessage = messageData => {
  const messageTemplate = getMessageTemplate(messageData);
  const chatContainer = document.querySelector(".chat__content-main");
  chatContainer.insertAdjacentHTML("beforeend", messageTemplate);
};

const getMessageTemplate = messageData => {
  const { messageId, message, pv: { sender } } = messageData;

  let messageTemplate = null;
  if (sender === user.name) {
    messageTemplate = `
      <div class="chat__content-receiver-wrapper chat__content-wrapper">
        <div id="${messageId}" class="chat__content-receiver">
          <span class="chat__content-receiver-text">${message}</span>
          <span class="chat__content-chat-clock">
            17:55 | <i class="fa fa-trash" style="cursor: pointer" onclick="removeMessage('${messageId}')"></i>
          </span>
        </div>
      </div>
    `
  } else {
    messageTemplate = `
      <div class="chat__content-sender-wrapper chat__content-wrapper">
        <div id="${messageId}" class="chat__content-sender">
          <span class="chat__content-receiver-text">${message}</span>
          <span class="chat__content-chat-clock">17:55</span>
        </div>
      </div>
    `
  }

  return messageTemplate;
};


const removeMessage = messageId => {
  namespaceSocket.emit("remove-message", messageId);
};
const applyRemoveMessageHandler = () => {
  namespaceSocket.on("confirm-remove-message", applyRemoveMessage);
};

const applyRemoveMessage = messageId => {
  const targetChat = document.getElementById(messageId);
  const targetChatWrapper = targetChat.parentElement;
  targetChatWrapper.remove();
};

const scrollToChatFloor = () => {
  const chatContainer = document.querySelector(".chat__content--active");

  chatContainer.scrollTo({
    behavior: "smooth",
    left: 0,
    top: chatContainer.scrollHeight
  });
};

window.removeMessage = removeMessage;

export {
  authorizeUser,
  showPrivateChats,
  sendMessageHandler,
  showMessageHandler,
  applyRemoveMessageHandler
};