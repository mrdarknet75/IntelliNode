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
const fs = require('fs');
const path = require('path');

class Config2 {
  constructor() {
    const configPath = path.join(__dirname, '..', 'config.json');
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }

  getProperty(key) {
    return key.split('.').reduce((obj, k) => (obj && obj[k] !== 'undefined') ? obj[k] : undefined, this.config);
  }

  static getInstance() {
    if (!Config2.instance) {
      Config2.instance = new Config2();
    }
    return Config2.instance;
  }
}

module.exports = Config2;