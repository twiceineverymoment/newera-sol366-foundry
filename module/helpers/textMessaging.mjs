import { NEWERA } from "./config.mjs";

export class TextMessaging {

    static _getAllPhones(){
        const phones = [];
        for (const item of game.items.contents){
            if (item.type == "Phone"){
                phones.push(item);
            }
        }
        for (const actor of game.actors.contents){
            for (const item of actor.items.contents){
                if (item.type == "Phone"){
                    phones.push(item);
                }
            }
        }
        return phones;
    }

    static getIncomingMessages(number) {
        if (!number) return {};
        console.log(`[DEBUG] Getting incoming SMS messages for ${number}`);
        const conversations = {};
        //Retrieve all phones that have the target number in their contacts.
        const phones = TextMessaging._getAllPhones();
        for (const phone of phones) {
            if (phone.system.phoneNumber == number){
                continue;
            }
            for (const contact of Object.values(phone.system.contacts)) {
                if (contact.number == number) {
                    console.log(`[DEBUG] Found conversation on ${phone.name} (${phone.system.phoneNumber})`);
                    const messages = structuredClone(Object.values(contact.messages));
                    //console.log(contact);
                    if (messages.length > 0){
                        conversations[phone.system.phoneNumber] = messages;
                        conversations[phone.system.phoneNumber].forEach(message => {
                            message.sent = false;
                        });
                    } else {
                        console.log(`[DEBUG] No messages sent`);
                    }
                }
            }
        }
        return conversations;
        
    }

    static async sendMessage(senderPhone, recipientNumber, messageContent){
        console.log(`Sending SMS message from ${senderPhone.system.phoneNumber} to ${recipientNumber}`);
        let senderContactIndex = Object.keys(senderPhone.system.contacts).find(i => senderPhone.system.contacts[i].number == recipientNumber);
        if (senderContactIndex === undefined){ //Create a new contact on the sender's phone (i.e. if responding to a message from an unknown number)
            senderContactIndex = await senderPhone.addContact("Unknown", recipientNumber);
        }
        await senderPhone.addMessage(true, senderContactIndex, messageContent);

        const recipientName = senderPhone.system.contacts[senderContactIndex].name;
        const senderName = (senderPhone.actor ? senderPhone.actor.name : senderPhone.name);

        await ChatMessage.create({
        content: `<div class="chat-action-container"><img class="action-image-base" src="${NEWERA.images}/phone-ui/app-messages.png" /></div>
        <div class="text-message">
            <h4>${senderName} <i class="fa-solid fa-arrow-right"></i> ${recipientName}</h4>
            <p>${messageContent}</p>
        </div>`
        });
        //Re-render the recipient phone's sheet on all clients
        TextMessaging.refreshPhone(recipientNumber);
        return true;
    }

    static refreshPhones() {
        game.socket.emit("system.newera-sol366", {
            event: "SMS_REFRESH_ALL"
        });
        TextMessaging.renderPhones();
    }

    static refreshPhone(number) {
        game.socket.emit("system.newera-sol366", {
            event: "SMS_REFRESH",
            data: {
                number: number
            }
        });
        TextMessaging.renderPhones(number);
    }

    static async renderPhones(number = null){
        console.log(`Updating phones n=${number}`);
        for (const actor of game.actors.values()){
          for (const item of actor.items.values()){
            if (item.type == "Phone" && (number == null || item.system.phoneNumber == number)){
              console.log(`Found ${item.name} in ${actor.name}'s inventory`);
              if (item.sheet){
                item.sheet.render(false);
              }
            }
          }
        }
        for (const item of game.items.values()){
          if (item.type == "Phone" && (number == null || item.system.phoneNumber == number)){
            console.log(`Found ${item.name} in game.items`);
            if (item.sheet){
              item.sheet.render(false);
            }
          }
        }
      }

}