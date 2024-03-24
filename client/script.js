function fact(n) {
    if (n === 0 || n === 1) {
      return 1;
    } else {
      return n * fact(n - 1);
    }
  }
  
  console.log("Factorielle de 6:", fact(6));
  console.log("Factorielles des éléments de [1,2,3,4,5,6]:", applique(fact, [1, 2, 3, 4, 5, 6]));
  console.log("Chaque élément plus un:", applique(function(n) { return n + 1; }, [1, 2, 3, 4, 5, 6]));
  
  function applique(f, tab) {
    return tab.map(f);
  }
  document.addEventListener('DOMContentLoaded', function() {
    refreshMessages();
  });
  
  document.getElementById("sendButton").addEventListener("click", function() {
    var messageContent = document.getElementById("message").value;
  
    if (messageContent.trim()) {
      fetch(`https://archiweb-tpjs-back.onrender.com/msg/post/${encodeURIComponent(messageContent)}`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          console.log('Message posté:', data);
          refreshMessages();
        })
        .catch(error => console.error("Erreur lors de l'envoi du message:", error));
    } else {
      alert("Veuillez saisir un message.");
    }
  
    document.getElementById("message").value = '';
  });
  
  function refreshMessages() {
    fetch('https://archiweb-tpjs-back.onrender.com/msg/getAll')
      .then(response => response.json())
      .then(messages => {
        update(messages.map(message => ({ msg: message })));
      })
      .catch(error => console.error('Erreur lors de la récupération des messages:', error));
  }
  
  function update(messages) {
    fetch('https://archiweb-tpjs-back.onrender.com/msg/likes')
      .then(response => response.json())
      .then(likes => {
        var messageList = document.getElementById("message-list");
        messageList.innerHTML = '';
        messages.forEach(function(message, index) {
          var li = document.createElement("li");
          li.textContent = message.msg;
  
          var likeButton = document.createElement("button");
          likeButton.textContent = `Like (${likes[index]})`;
          likeButton.onclick = function() { likeMessage(index); };
          li.appendChild(likeButton);
  
          messageList.appendChild(li);
        });
      })
      .catch(error => console.error('Erreur lors de la récupération des likes:', error));
  }
  
  function likeMessage(msgId) {
    fetch(`https://archiweb-tpjs-back.onrender.com/msg/like/${msgId}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        if (data.code === 1) {
          console.log('Message liké');
          refreshMessages(); // Rafraîchit les messages pour mettre à jour les likes
        }
      })
      .catch(error => console.error("Erreur lors de l'envoi du like:", error));
  }
  