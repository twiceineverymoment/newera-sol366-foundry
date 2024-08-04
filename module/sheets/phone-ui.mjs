import { NEWERA } from "../helpers/config.mjs";
import { Formatting } from "../helpers/formatting.mjs";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class PhoneUI extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
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

      context.enableReceiveMsg = (game.user.role >= 3);
      context.standardFeatures = (system.featureLevel > 0);
      context.advancedFeatures = (system.featureLevel == 2);

    // Prepare conversation data for messages display
    console.log(`reading ${Object.entries(system.contacts).length} conversations`);
    for (const [i, convo] of Object.entries(system.contacts)){
      console.log(`preparing conversation [${i}]`);
      console.log(convo.messages);
      if (!convo.messages){
        convo.messages = {};
      }
      if (convo.unread){
        context.unread = true;
      }
      if (Object.keys(convo.messages).length > 0){
        convo.lastMessage = convo.messages[Object.keys(convo.messages).length - 1];
      } else {
        convo.lastMessage = "(no messages)";
      }
      if (system.openApp == "chat" && convo.name == system.callee){
        context.conversation = convo;
        context.calleeIndex = i;
      }
    }

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = system;
    context.flags = this.item.system.flags;

    context.theme = this.item.system.theme;
    if (context.theme == 'auto') {
      const isNightTime = worldSetting.time.daylight == "night" || (worldSetting.time.daylight == "auto" && this._isNightTime(worldSetting.time.hour, worldSetting.date.month));
      context.theme = isNightTime ? 'dark' : 'light';
    }

    console.log(context);

    return context;
  }

  /* -------------------------------------------- */

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
    if (system.openApp == "photos" && system.selectedPhoto){
      html.find(`#photo-details-${this.item.id}-${system.selectedPhoto}`).show();
    }

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
      this.openApp(app);
    });
    html.find(".app-close").click(() => this.closeApps());

    //Other click listeners
    html.find("#battery").click(() => this.setBatteryLevel());
    html.find("#battery-dead").click(() => this.setBatteryLevel());
    html.find("#flashlight").click(async () => {
      const flashlight = this.item.system.flashlight;
      const switched = flashlight == "off" ? "on" : "off"
      html.find("#flashlightState").val(switched);
      this.submit();
      if (this.item.actor){
        this.item.actor.actionMessage(`${NEWERA.images}/phone-ui/flashlight-on.png`, null, "{NAME} turns {0} {d} phone's flashlight.", switched);
        //TODO Can we make this actually add a light to the actor's token?
      }
    });

    html.find("#createContact").click(() => {
      this.item.createContact();
      this.render(false);
    });
    html.find("a.call").click(ev => {
      const callee = $(ev.currentTarget).data("name");
      if (this.item.actor){
        this.item.actor.actionMessage(`${NEWERA.images}/phone-ui/app-contacts.png`, null, "{NAME} is calling {0}.", callee);
      } else {
        
      }
      $(this.form).find("#currentCallee").val(callee);
      this.openApp("call");
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
      html.find("#selectedPhoto").val(index);
      this.submit();
    });
    html.find(".photo-close").click(() => {
      html.find("#selectedPhoto").val("");
      this.submit();
    });
    html.find("#takePhoto").click(() => {
      html.find("#selectedPhoto").val(this.item.addPhoto());
      this.render(false);
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
        html.find(`#photo-roll-${index}`).val(r.total);
        this.item.actor.actionMessage(`${NEWERA.images}/phone-ui/app-camera.png`, null, "{NAME} takes a picture of {0}.", photo.description);
        r.toMessage({
          speaker: ChatMessage.getSpeaker({actor: this.item.actor}),
          flavor: "Photography (Technology) Check"
        });
        this.submit();
      }
    });
    html.find(".open-convo").click(ev => {
      const callee = $(ev.currentTarget).data("name");
      const index = $(ev.currentTarget).data("index");
      html.find("#currentCallee").val(callee);
      html.find(`input[name="system.contacts.${index}.unread"]`).val(false);
      this.openApp("chat");
    });
    html.find("#sendMessage").click(async ev => {
      const content = html.find("#messageContent").val();
      const convoId = $(ev.currentTarget).data("convoId");
      if (!content){
        ui.notifications.error("You must type a message.");
        return;
      }
      this.item.addMessage(true, convoId, content);
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
    const day = timeDoesntWork ? Formatting.randomInt(1, 29) : settings.get("newera-sol366", "world.date.day");
    const month = timeDoesntWork ? Formatting.randomInt(1, 13) : settings.get("newera-sol366", "world.date.month");
    const year = timeDoesntWork ? Formatting.randomInt(1, 999) : settings.get("newera-sol366", "world.date.year");

    console.log(Object.entries(NEWERA.daysOfWeek));
    const weekday = Object.entries(NEWERA.daysOfWeek).find(ent => ent[1].includes(day))[0];
    return `${weekday}, ${day} ${NEWERA.months[month].name} ${year}`;
  }

  _formatInGameTime(settings, militaryTime){
    const timeDoesntWork = settings.get("newera-sol366", "world.scrambleTime");
    let hour = timeDoesntWork ? Formatting.randomInt(0, 59) : settings.get("newera-sol366", "world.time.hour");
    let minute = timeDoesntWork ? Formatting.randomInt(0, 99) : settings.get("newera-sol366", "world.time.minute");
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
            $(this.form).find("#batteryLevel").val(level);
            this.submit();
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

  async openApp(appId){
    $(this.form).find("#openAppField").val(appId);
    this.submit();
  }

  async closeApps(){
    $(this.form).find("#openAppField").val("");
    this.submit();
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
