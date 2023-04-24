/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
const OpenAIWrapper = require('../wrappers/OpenAIWrapper');
const CohereAIWrapper = require('../wrappers/CohereAIWrapper');
const LanguageModelInput = require('../model/input/LanguageModelInput');

const SupportedLangModels = {
  OPENAI: 'openai',
  COHERE: 'cohere',
};

class RemoteLanguageModel {
  constructor(keyValue, provider) {
    if (!provider) {
      provider = SupportedLangModels.OPENAI;
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

    if (keyType === SupportedLangModels.OPENAI) {
      this.openaiWrapper = new OpenAIWrapper(keyValue);
    } else if (keyType === SupportedLangModels.COHERE) {
      this.cohereWrapper = new CohereAIWrapper(keyValue);
    } else {
      throw new Error('Invalid provider name');
    }
  }

  getSupportedModels() {
    return Object.values(SupportedLangModels);
  }

  async generateText(langInput) {

    let inputs;

    if (langInput instanceof LanguageModelInput) {
      if (this.keyType === SupportedLangModels.OPENAI) {
        inputs = langInput.getOpenAIInputs();
      } else if (this.keyType === SupportedLangModels.COHERE) {
        inputs = langInput.getCohereInputs();
      } else {
        throw new Error('The keyType is not supported');
      }
    } else if (typeof langInput === 'object') {
      inputs = langInput;
    } else {
      throw new Error('Invalid input: Must be an instance of LanguageModelInput or a dictionary');
    }

    if (this.keyType === SupportedLangModels.OPENAI) {
      const results = await this.openaiWrapper.generateText(inputs);
      return results.choices.map((choice) => choice.text);
    } else if (this.keyType === SupportedLangModels.COHERE) {
      const results = await this.cohereWrapper.generateText(inputs);
      return results.generations.map((generation) => generation.text);
    } else {
      throw new Error('The keyType is not supported');
    }
  }
}

module.exports = {
  RemoteLanguageModel,
  SupportedLangModels,
};