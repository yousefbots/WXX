const { Schema, model } = require('mongoose');

const schema = new Schema({
    guildId: String,
    tax: {
        type: String,
        default: "",
        unique: true
    },
    emoji: {
        type: String,
        default: "",
        unique: true
    },
    short: {
        type: String,
        default: "",
        unique: true
    },
    tiktok: {
        type: String,
        default: "",
        unique: true
    },
    toggleTax: {
        type: Boolean,
        default: true,
    },
    toggleEmoji: {
        type: Boolean,
        default: true,
    },
    toggleShort: {
        type: Boolean,
        default: true,
    },
    toggleTikTok: {
        type: Boolean,
        default: true,
    }
});

module.exports = model('Guild', schema);