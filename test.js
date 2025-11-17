var contactId = request.data.message.chat.id;
var success = setContactByTelegramId(contactId);

if (success)  {
    var data = request.data;
    
    if (data.message.text.indexOf("/cb") !== -1) { 
        var id_mes = data.message.message_id;
        setContactVariable("mes_id", id_mes); // записываем айди сообщения от бота
        var text = data.message.text;
    }  


} 
 
 else {
  disableContinue();
  }
