const GoogleAIWrapper = require('../wrappers/GoogleAIWrapper');
const Text2SpeechInput = require('../model/input/Text2SpeechInput');

const SupportedSpeechModels = {
  GOOGLE: 'google',
};

class RemoteSpeechModel {
  constructor(keyValue, provider) {
    if (!provider) {
      provider = SupportedSpeechModels.GOOGLE;
    }

    const supportedModels = this.getSupportedModels();

    if (supportedModels.includes(provider)) {
      this.initiate(keyValue, provider);
    } else {
      const models = supportedModels.join(' - ');
      throw new Error(`The received keyValue is not supported. Send any model from: ${models}`);
    }
  }

  initiate(keyValue, keyType) {
    this.keyType = keyType;

    if (keyType === SupportedSpeechModels.GOOGLE) {
      this.googleWrapper = new GoogleAIWrapper(keyValue);
    } else {
      throw new Error('Invalid provider name');
    }
  }

  getSupportedModels() {
    return Object.values(SupportedSpeechModels);
  }

  async generateSpeech(input) {
    if (this.keyType === SupportedSpeechModels.GOOGLE) {
      let params;

      if (input instanceof Text2SpeechInput) {
        params = input.getGoogleInput();
      } else if (typeof input === 'object') {
        params = input;
      } else {
        throw new Error('Invalid input: Must be an instance of Text2SpeechInput or a dictionary');
      }

      const response = await this.googleWrapper.generateSpeech(params);
      return response.audioContent;
    } else {
      throw new Error('The keyType is not supported');
    }
  }
}

module.exports = {
  RemoteSpeechModel,
  SupportedSpeechModels,
};
