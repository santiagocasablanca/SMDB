'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('creator', [
            { id: uuidv4(), name: 'Max Fosh', custom_url: '@MaxFosh', profile_picture: 'https://yt3.googleusercontent.com/ytc/AOPolaSX_zlufSz3zRa6JoIex27auprQEjhwTQuhje-JVA=s176-c-k-c0x00ffffff-no-rj', banner_picture: 'https://yt3.googleusercontent.com/Qa35UxREgMbYLzU5UJ_gJTq-gDRvPxfmUBVmzliY18iUfSQDLHLQBCv9YAOk7aFFkKQ7t12ZIQ=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj', created_at: new Date(), updated_at: new Date() },
            { id: uuidv4(), name: 'Cal Freezy', custom_url: '@Calfreezy', profile_picture: 'https://yt3.googleusercontent.com/fvirIZM9DYLUOmRp0m96TZgJj9_SCd0XqgC4LArxhpQA_a-u9tW9YYnpkqoeZI8gMg5ha68LBA=s176-c-k-c0x00ffffff-no-rj', banner_picture: 'https://yt3.googleusercontent.com/AJwfIETgh01xrAliYgWUfG8qobr0n9NblRBV2nPnnNzb7-PC-Yn3-DIozARvwSfO77FEnpx1zA=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj', created_at: new Date(), updated_at: new Date() },
            { id: uuidv4(), name: 'Callux', custom_url: '@Callux', profile_picture: 'https://yt3.googleusercontent.com/ppOEWx3XzA3CPF76X33OqhWKypSPy5A3quHhS-wvrZ8KrpvYPYSchndUxBradoUYx9jWS8S43Q=s176-c-k-c0x00ffffff-no-rj', banner_picture: 'https://yt3.googleusercontent.com/GSvCKznNi_CbgcNphqh_a4105b9PeS95MIiFmo9IyT_nzB4OwFpWS_QUL7cyTKfl-NoqY-DDpw=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj', created_at: new Date(), updated_at: new Date() },
            { id: uuidv4(), name: 'Chippo', custom_url: '@TheBurntChipHD', profile_picture: 'https://yt3.googleusercontent.com/VEVSFwSHpT9TKhrxeVreU1XA91ZAPjdRqG3xKlYpuakozNSRAh667VSV7OvbChOdT4Ljv2uJ-w=s176-c-k-c0x00ffffff-no-rj', banner_picture: 'https://yt3.googleusercontent.com/yct7Vn9OVrhIqm-3cgvrp2zWNKGsA-OzEOdOrKi8K18bOFxIzzqVlaChnjCoMgr2BOexb2MG=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj', created_at: new Date(), updated_at: new Date() },
            { id: uuidv4(), name: 'Randolph', custom_url: '@RandolphUK', profile_picture: 'https://yt3.googleusercontent.com/ytc/AOPolaTNpLfpIpYFoqYjA9ZLOS13Fh9ATmtS6QBT8Wdl=s176-c-k-c0x00ffffff-no-rj', banner_picture: 'https://yt3.googleusercontent.com/1lmSOMw9s4dOBtTp3eM25j2rCshrplz-_pzOq_xQ9fn5whBn7byB6fHDkP1ndqWArixaewTqg68=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj', created_at: new Date(), updated_at: new Date() },
            { id: uuidv4(), name: 'JME', custom_url: '@ManBetterKnow', profile_picture: 'https://yt3.googleusercontent.com/ytc/AOPolaS8zwL1vNi6klITLTML8PqAHy0DuX-VfQZcGz0a=s176-c-k-c0x00ffffff-no-rj', banner_picture: 'https://yt3.googleusercontent.com/TAzKHjNB6Fkfu5XSf5Pbup6zg2lv61FUH6S-HwcpezJYGkNFRwB3VdkEHSr0zmWqCZ2XYy2U1g=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj', created_at: new Date(), updated_at: new Date() },
            { id: uuidv4(), name: 'Stephen Tries', custom_url: '@StephenTries', profile_picture: 'https://yt3.googleusercontent.com/ytc/AOPolaRzM7zXDg6jHcoktVyOX2c-gIqHdDMLvwI3BqmTpA=s176-c-k-c0x00ffffff-no-rj', banner_picture: 'https://yt3.googleusercontent.com/-_Z1uJmgAEGd1sOWWqPwHB4vNnJLB2MhITo0OU0oCw--rgb5LIUqTewsj6PRDg9HslUITL9Oxw=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj', created_at: new Date(), updated_at: new Date() },
            
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('creator', null, {});
    }
};
