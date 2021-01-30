const utils = require('./utils');

module.exports.handle = function (interaction, driver, channel, user, client) {
    if (interaction.data.options[0]) {
        let platform = interaction.data.options[0].name;
        let title;
        let footer;
        switch (platform) {
            case 'switch':
                title = "Nintendo Switch Friend Code";
                footer = "Valid Nintendo Switch Friend Codes look like SW-XXXX-XXXX-XXXX";
                break;
            case '3ds':
                platform = 'ds';
                title = "Nintendo 3DS Friend Code";
                footer = "Valid Nintendo 3DS Friend Codes look like XXXX-XXXX-XXXX";
                break;
            default:
                title = platform;
                footer = "";
        }

        if (interaction.data.options[0].options) {
            let option = interaction.data.options[0].options[0].name;
            if (option == 'share') {
                let mentionedUserID = user;
                let selfCall = true;
                if (interaction.data.options[0].options[0].options) { // If a user was specified
                    mentionedUserID = interaction.data.options[0].options[0].options[0].value;
                    selfCall = false;
                }
                client.users.fetch(user).then(requestingUser => {
                    client.users.fetch(mentionedUserID).then(mentionedUser => {
                        driver.getCode(mentionedUserID, platform, selfCall).then(res => {
                            channel.send({
                                embed: {
                                    color: 0x86D0CF,
                                    author: {
                                        name: mentionedUser.username,
                                        icon_url: mentionedUser.avatarURL({dynamic: true})
                                    },
                                    title: title,
                                    description: res[platform].code,
                                    footer: {
                                        text: "Requested by " + requestingUser.tag
                                    }
                                }
                            });
                        });
                    });
                });
            } else if (option == 'set') {
                let code = interaction.data.options[0].options[0].options[0].value;
                client.users.fetch(user).then(requestingUser => {
                    if (validateCode(platform, code)) {
                        driver.setCode(interaction.member.user.id, platform, code).then(res => {
                            channel.send({
                                embed: {
                                    color: 0x86D0CF,
                                    author: {
                                        name: requestingUser.username,
                                        icon_url: requestingUser.avatarURL({dynamic: true})
                                    },
                                    title: title + " Saved!",
                                    description: code,
                                    footer: {
                                        text: "Use the appropriate /platform command to share your code"
                                    }
                                }
                            });
                        }).catch(err => {
                            console.log(err);
                        });
                    } else {
                        channel.send({
                            embed: {
                                color: 0x86D0CF,
                                author: {
                                    name: requestingUser.username,
                                    icon_url: requestingUser.avatarURL({dynamic: true})
                                },
                                title: "Could not save " + title + "!",
                                description: "You did not enter a valid " + title + ".",
                                footer: {
                                    text: footer
                                }
                            }
                        });
                    }
                });
            }
        }
    }
}

function validateCode(platform, code) {
    switch (platform) {
        case 'switch':
            if (code.substring(0, 3).toLowerCase() == "sw-") {
                if (code.length == 17) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
            break;
        case 'ds':
            if (code.substring(0, 3).toLowerCase() != "sw-") {
                if (code.length == 14) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
            break;
        default:
            return false;
    }
}