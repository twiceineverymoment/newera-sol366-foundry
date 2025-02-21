import { NEWERA } from "../helpers/config.mjs";
import { NewEraUtils } from "../helpers/utils.mjs";
import { TextMessaging } from "../helpers/textMessaging.mjs";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class PhoneUI extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["newera", "sheet", "item"],
      width: 320,
      height: 570,
      resizable: false
    });
  }

  /** @override */
  get template() {
      return `systems/newera-sol366/templates/item/phone/phone-ui.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const system = context.item.system;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;

      const worldSetting = {
        time: {
          hour: game.settings.get("newera-sol366", "world.time.hour"),
          minute: game.settings.get("newera-sol366", "world.time.minute"),
          daylight: game.settings.get("newera-sol366", "world.time.daylight"),
          text: this._formatInGameTime(game.settings, system.militaryTime)
        },
        date: {
          day: game.settings.get("newera-sol366", "world.date.day"),
          month: game.settings.get("newera-sol366", "world.date.month"),
          year: game.settings.get("newera-sol366", "world.date.year"),
          text: this._formatInGameDate(game.settings)
        },
        weather: {
          conditions: game.settings.get("newera-sol366", "world.weather.conditions"),
          wind: parseInt(game.settings.get("newera-sol366", "world.weather.wind")),
          temp: game.settings.get("newera-sol366", "world.weather.temp"),
          precipChance: game.settings.get("newera-sol366", "world.weather.precip"),
          forecast: game.settings.get("newera-sol366", "world.weather.forecast"),
        },
        location: game.settings.get("newera-sol366", "world.location"),
        signal: {
          status: game.settings.get("newera-sol366", "world.signal"),
        },
        emergencyAlert: game.settings.get("newera-sol366", "world.alert"),
      }
      worldSetting.signalDescription = NEWERA.serviceDesc[worldSetting.signal.status];
      worldSetting.weather.display = this._getWeatherDisplay(worldSetting);
      worldSetting.weather.belowFreezing = (worldSetting.weather.temp <= 0);
      worldSetting.weather.extreme = this._getExtremeTemps(worldSetting.weather.temp);
      worldSetting.weather.windInfo = this._getWindInfo(worldSetting.weather.wind);
      worldSetting.signal.internet = ["fast", "normal", "weak"].includes(worldSetting.signal.status);
      if (!worldSetting.signal.internet){
        worldSetting.weather.display.image = "weather-offline";
      }
      worldSetting.signal.comms = worldSetting.signal.status != "none";
      context.world = worldSetting;
      if (game.settings.get("newera-sol366", "world.scrambleTime")){
        worldSetting.location = NEWERA.alternateDimensionLocations[Math.floor(Math.random() * NEWERA.alternateDimensionLocations.length)];
      }

      context.standardFeatures = (system.featureLevel > 0);
      context.advancedFeatures = (system.featureLevel == 2);

    // Prepare conversation data for messages display

    //console.log(`reading ${Object.entries(system.contacts).length} conversations`);

    if (system.openApp == "photo-view"){
      context.photo = system.photos[system.selectedPhoto];
    }

    if (["chat", "messages"].includes(system.openApp)){
      context.contacts = structuredClone(system.contacts);
      this._prepareSMSMessages(context.contacts);
    }

    //Load the active conversation
    if (["chat", "call"].includes(system.openApp)){
      for (const [i, contact] of Object.entries(context.contacts)){
        if (i == system.currentContact){
          context.activeConversation = contact;
          context.activeContact = i;
        }
      }
    }

    context.system = system;
    context.flags = this.item.system.flags;

    context.theme = this.item.system.theme;
    if (context.theme == 'auto') {
      const isNightTime = worldSetting.time.daylight == "night" || (worldSetting.time.daylight == "auto" && this._isNightTime(worldSetting.time.hour, worldSetting.date.month));
      context.theme = isNightTime ? 'dark' : 'light';
    }

    console.log("PHONE CONTEXT DUMP");
    console.log(context);

    return context;
  }

  _prepareSMSMessages(contacts){
    const incomingMessages = TextMessaging.getIncomingMessages(this.item.system.phoneNumber);
    //Handle messages for contacts in this phone
    for (const [i, contact] of Object.entries(contacts)){
      //Merge the outgoing messages stored on this phone with the incoming messages from other phones, and sort by real time sent
      const incoming = incomingMessages[contact.number] ? Object.values(incomingMessages[contact.number]) : [];
      contact.conversation = [
        ...Object.values(contact.messages), 
        ...incoming
      ].sort((a, b) => {
        if (a.timestamp < b.timestamp) return -1;
        else if (a.timestamp > b.timestamp) return 1;
        else if (!a?.realTime) return -1;  // if a.realTime is null/undefined, a comes first
        else if (!b?.realTime) return 1;   // if b.realTime is null/undefined, b comes first
        else return a.realTime - b.realTime;
      });
    }
    //Handle incoming messages from contacts not in this phone 
    for (const [num, messages] of Object.entries(incomingMessages)){
      if (!Object.values(this.item.system.contacts).some(c => c.number == num)){
        console.log(`[DEBUG] Found unknown contact: ${num}`);
        contacts[Object.keys(contacts).length] = {
          name: num,
          number: num,
          notInContacts: true,
          messages: messages,
          conversation: Object.values(messages),
          unread: true
        };
      }
    }

    //Prepare additional contact data 
    for (const [i, contact] of Object.entries(contacts)){
      if (contact.conversation.length > 0){
        contact.lastMessage = contact.conversation[contact.conversation.length - 1];
      }
      if (contact.lastMessage && contact.lastMessage.realTime > contact.lastCheckedTime && !contact.lastMessage.sent){
        contact.unread = true;
      }
    }
  }


  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    const system = this.item.system;

    //Switch the UI view if there is an app open
    if(system.openApp){
      html.find(`#app-${system.openApp}`).show();
      html.find("#phoneui-clock-top").show();
      html.find("#phoneui-home").hide();
    }

    //Set values of select elements 
    html.find('select.auto-value').each((i, element) => {
      const dataField = $(element).attr("name") || $(element).data("indirectName"); // Using data-indirect-name prevents the select from being picked up by Foundry's built-in updates, in cases where the manual listener performs an update (to avoid updating twice)
      const value = NewEraUtils.getSelectValue(dataField, this.item);
      if (value !== null){
        $(element).val(value);
      }
    });

    //Dropdown values
    html.find(`#background-${this.item.id}`).val(system.background);
    html.find(`#theme-${this.item.id}`).val(system.theme);
    html.find(`#features-${this.item.id}`).val(system.featureLevel);

    //Scroll the text message history to the bottom
    const msgs = html.find("#messageHistory");
    msgs.scrollTop(msgs.prop("scrollHeight"));

    //App open/close listeners
    html.find(".app-open").click(ev => {
      const app = $(ev.currentTarget).data("app");
      this.item.setOpenApp(app);
    });
    html.find(".app-close").click(() => this.item.setOpenApp("home"));

    //Other click listeners
    html.find("#battery").click(() => this.setBatteryLevel());
    html.find("#battery-dead").click(() => this.setBatteryLevel());
    html.find("#flashlight").click(async () => {
      await this.item.toggleFlashlight();
      if (this.item.actor){
        this.item.actor.actionMessage(`${NEWERA.images}/phone-ui/flashlight-on.png`, null, "{NAME} turns {0} {d} phone's flashlight.", this.item.system.flashlight);
        //TODO Can we make this actually add a light to the actor's token?
      }
    });

    html.find("#createContact").click(() => {
      this.item.createContact();
    });

    html.find(".mark-convo-as-read").click(async ev => {
      const convoId = $(ev.currentTarget).data("convoId");
      if (this.item.system.contacts[convoId]){
        await this.item.update({
          system: {
            contacts: {
              [convoId]: {
                lastCheckedTime: Date.now()
              }
            }
          }
        });
      }
    });

    html.find("#compose").click(() => {
      new Dialog({
        title: "Compose New Message",
        content: `
          <form>
            <p>Enter phone number</p>
            <input type="text" name="number" placeholder="Number" />
          </form>
        `,
        buttons: {
          confirm: {
            icon: '<i class="fa-solid fa-pen-to-square"></i>',
            label: "Compose",
            callback: async html => {
              const number = html.find("input[name='number']").val();
              if (!number){
                ui.notifications.error("You must enter a phone number.");
                return;
              }
              const newIndex = await this.item.addContact(number, number);
              await this.item.update({
                system: {
                  currentContact: newIndex,
                  openApp: "chat"
                }
              });
            }
          },
          cancel: {
            icon: '<i class="fa-solid fa-x"></i>',
            label: "Cancel"
          }
        }
      }).render(true);
    });

    html.find("#addToContacts").click(ev => {
      const number = $(ev.currentTarget).data("number");
      this.item.addContact("New Contact", number);
    });

    html.find("a.call").click(ev => {
      const id = $(ev.currentTarget).data("contactId");
      if (this.item.actor){
        const name = this.item.system.contacts[id].name;
        this.item.actor.actionMessage(`${NEWERA.images}/phone-ui/app-contacts.png`, null, "{NAME} is calling {0}.", name);
      } else {

      }
      this.item.call(id);
    });
    html.find("#searchButton").click(async () => {
      const searchTerm = html.find("input#searchTerm").val();
      if (this.item.actor && searchTerm){
        const r = new Roll(`d20+@skills.technology.mod+@specialty.partial.research`, this.item.actor.getRollData());
        await r.evaluate();
        this.item.actor.actionMessage(`${NEWERA.images}/phone-ui/skye.png`, null, "{NAME} searches the web for {0}.", searchTerm);
        r.toMessage({
          speaker: ChatMessage.getSpeaker({actor: this.item.actor}),
          flavor: "Research (Technology) Check"
        });
      }
    });
    html.find("div.photo-thumbnail").click(ev => {
      const index = $(ev.currentTarget).data("photoId");
      this.item.openPhotoView(index);
    });
    html.find(".photo-close").click(() => {
      if (system.selectedPhoto) {
        this.item.setSelectedPhoto(null);
      } else {
        this.item.setOpenApp("home");
      }
    });
    html.find("#takePhoto").click(() => {
      this.item.addPhoto();
    });
    html.find(".photo-roll-trigger").click(async (ev) => {
      if (this.item.actor){
        const index = $(ev.currentTarget).data("photoId");
        const photo = this.item.system.photos[index];
        if (photo.title == "New Photo" || photo.description == "Describe what you took a photo of"){
          ui.notifications.warn("Enter a name and description of the photo before rolling.");
          return;
        }
        const r = new Roll(`d20+@skills.technology.mod+@abilities.dexterity.mod+@specialty.partial.photography`, this.item.actor.getRollData());
        await r.evaluate();
        await this.item.update({
          system: {
            photos: {
              [index]: {
                roll: r.total
              }
            }
          }
        });
        this.item.actor.actionMessage(`${NEWERA.images}/phone-ui/app-camera.png`, null, "{NAME} takes a picture of {0}.", photo.description);
        r.toMessage({
          speaker: ChatMessage.getSpeaker({actor: this.item.actor}),
          flavor: "Photography (Technology) Check"
        });
      } else {
        ui.notifications.error("This phone isn't owned by anyone!");
      }
    });
    html.find(".open-convo").click(ev => {
      const id = $(ev.currentTarget).data("contactId");
      this.item.openChat(id);
    });
    html.find("#sendMessage").click(async ev => {
      const content = html.find("#messageContent").val();
      const number = $(ev.currentTarget).data("number");
      if (!content){
        ui.notifications.error("You must type a message.");
        return;
      }
      await TextMessaging.sendMessage(this.item, number, content);
    });
    html.find("#receiveMessage").click(async ev => {
      const content = html.find("#messageContent").val();
      const convoId = $(ev.currentTarget).data("convoId");
      if (!content){
        ui.notifications.error("Enter a message in the text box, then click this button to create a received text.");
        return;
      }
      this.item.addMessage(false, convoId, content);
    });

    //Prevent the ENTER key from activating the internet search form
    html.find("#app-browser").keydown(function(ev){
      if (ev.keyCode == 13 && this.item.system.openApp != "browser"){
        ev.preventDefault();
        return false;
      }
    });


  }

  _formatInGameDate(settings){
    const timeDoesntWork = settings.get("newera-sol366", "world.scrambleTime");
    const day = timeDoesntWork ? NewEraUtils.randomInt(1, 29) : settings.get("newera-sol366", "world.date.day");
    const month = timeDoesntWork ? NewEraUtils.randomInt(1, 13) : settings.get("newera-sol366", "world.date.month");
    const year = timeDoesntWork ? NewEraUtils.randomInt(1, 999) : settings.get("newera-sol366", "world.date.year");

    //console.log(Object.entries(NEWERA.daysOfWeek));
    const weekday = Object.entries(NEWERA.daysOfWeek).find(ent => ent[1].includes(day))[0];
    return `${weekday}, ${day} ${NEWERA.months[month].name} ${year}`;
  }

  _formatInGameTime(settings, militaryTime){
    const timeDoesntWork = settings.get("newera-sol366", "world.scrambleTime");
    let hour = timeDoesntWork ? NewEraUtils.randomInt(0, 59) : settings.get("newera-sol366", "world.time.hour");
    let minute = timeDoesntWork ? NewEraUtils.randomInt(0, 99) : settings.get("newera-sol366", "world.time.minute");
    let suffix = "";
    if (!militaryTime){
      if (hour > 12){
        hour -= 12;
        suffix = " PM";
      } else if (hour == 12){
        suffix = " PM";
      } else if (hour == 0){
        hour = 12;
        suffix = " AM";
      } else {
        suffix = " AM";
      }
    }
    return `${militaryTime && hour < 10 ? "0" : ""}${hour}:${minute < 10 ? "0" : ""}${minute}${suffix}`;
  }

  async setBatteryLevel(){
    new Dialog({
      title: "Battery",
      content: `
        <form>
          <p>Set battery level for ${this.item.name}</p>
          <select id="batteryLevel">
            <option value="4">100%</option>
            <option value="3">75%</option>
            <option value="2">50%</option>
            <option value="1">25%</option>
            <option value="0">Empty</option>
          </select>
        </form>
      `,
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: "Confirm",
          callback: html => {
            const level = html.find("#batteryLevel").val();
            this.item.setBatteryLevel(level);
          }
        },
        cancel: {
          icon: '<i class=fas fa-x"></i>',
          label: "Cancel"
        }
      },
      default: "cancel"
    }).render(true);
  }

  _getWindInfo(level){
    switch(level){
      default:
      case 0:
        return "Winds Light and Variable";
      case 1:
        return "Moderate Winds";
      case 2:
        return "High winds. Use caution.";
      case 3:
        return "DANGER: Gale force winds. Stay indoors.";
    }
  }

  _getWeatherDisplay(world){
    const isBelowFreezing = world.weather.temp <= 0;
    const isNightTime = world.time.daylight == "night" || (world.time.daylight == "auto" && this._isNightTime(world.time.hour, world.date.month));
    switch (world.weather.conditions){
      case "clear":
        if (isNightTime){
          return {
            caption: "Clear",
            image: "weather-clear-night"
          };
        } else {
          return {
            caption: "Sunny",
            image: "weather-clear-day"
          };
        }
      case "pc1": 
        if (isNightTime){
          return {
            caption: "Mostly Clear",
            image: "weather-pc1-night"
          };
        } else {
          return {
            caption: "Mostly Sunny",
            image: "weather-pc1-day"
          };
        }
      case "pc2":
        if (isNightTime){
          return {
            caption: "Partly Cloudy",
            image: "weather-pc2-night"
          };
        } else {
          return {
            caption: "Partly Cloudy",
            image: "weather-pc2-day"
          };
        }
      case "pc3":
        if (isNightTime){
          return {
            caption: "Mostly Cloudy",
            image: "weather-pc2-night"
          };
        } else {
          return {
            caption: "Mostly Cloudy",
            image: "weather-pc2-day"
          };
        }
      case "cloudy":
        return {
          caption: "Cloudy",
          image: "weather-cloudy"
        };
      case "foggy":
        if (isNightTime){
          return {
            caption: "Fog",
            image: "weather-pc1-night"
          };
        } else {
          return {
            caption: "Fog",
            image: "weather-pc1-day"
          };
        }
      case "precip1":
        if (isBelowFreezing){
          if (isNightTime){
            return {
              caption: "Light Snow",
              image: "weather-precip1-snow-night"
            };
          } else {
            return {
              caption: "Light Snow",
              image: "weather-precip1-snow-day"
            };
          }
        } else {
          if (isNightTime){
            return {
              caption: "Light Rain",
              image: "weather-precip1-rain-night"
            };
          } else {
            return {
              caption: "Light Rain",
              image: "weather-precip1-rain-day"
            };
          }
        }
      case "precip2":
        if (isBelowFreezing){
          return {
            caption: "Snow",
            image: "weather-precip2-snow"
          };
        } else {
          return {
            caption: "Rain Shower",
            image: "weather-precip2-rain"
          };
        }
      case "precip3":
        if (isBelowFreezing){
          return {
            caption: "Heavy Snow",
            image: "weather-precip3-snow"
          };
        } else {
          return {
            caption: "Heavy Rain",
            image: "weather-precip3-rain"
          };
        }
      case "storm1":
        if (isNightTime){
          return {
            caption: "Thunderstorm",
            image: "weather-storm1-night"
          };
        } else {
          return {
            caption: "Thunderstorm",
            image: "weather-storm1-day"
          };
        }
      case "storm2":
        return {
          caption: "Strong Thunderstorm",
          image: "weather-storm2"
        }
    }
  }

  _getExtremeTemps(temp){
    if (temp <= -50){
      return {
        type: "cold",
        level: 3
      };
    } else if (temp <= -20){
      return {
        type: "cold",
        level: 2
      };
    } else if (temp <= -5){
      return {
        type: "cold",
        level: 1
      };
    } else if (temp >= 45){
      return {
        type: "heat",
        level: 3
      };
    } else if (temp >= 35){
      return {
        type: "heat",
        level: 2
      };
    } else if (temp >= 25){
      return {
        type: "heat",
        level: 1
      };
    } else {
      return false;
    }
  }

  _isNightTime(hour, month){
    const timespan = NEWERA.months[month];
    if (timespan.sunset == null){
      return false;
    } else {
      return (timespan.sunrise == null || hour < timespan.sunrise || hour >= timespan.sunset);
    }
    
  }


}
