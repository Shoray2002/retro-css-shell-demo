/* eslint-disable linebreak-style */
/*!
 * AnderShell - Just a small CSS demo
 *
 * Copyright (c) 2011-2018, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import "./src/styles.scss";
import { terminal } from "./src/terminal.js";

// Banner text
const banner = `
EquinoXell 3000 v0.1
.............................................................................

######## ########  ########    ###     ######  ##     ## ########  ########    ##     ## ##     ## ##    ## ######## 
   ##    ##     ## ##         ## ##   ##    ## ##     ## ##     ## ##          ##     ## ##     ## ###   ##    ##    
   ##    ##     ## ##        ##   ##  ##       ##     ## ##     ## ##          ##     ## ##     ## ####  ##    ##    
   ##    ########  ######   ##     ##  ######  ##     ## ########  ######      ######### ##     ## ## ## ##    ##    
   ##    ##   ##   ##       #########       ## ##     ## ##   ##   ##          ##     ## ##     ## ##  ####    ##    
   ##    ##    ##  ##       ##     ## ##    ## ##     ## ##    ##  ##          ##     ## ##     ## ##   ###    ##    
   ##    ##     ## ######## ##     ##  ######   #######  ##     ## ########    ##     ##  #######  ##    ##    ##    
-----------------------------------------------------------------------------
HAPPY HUNTING!
-----------------------------------------------------------------------------
Type 'help for a list of available commands.


`;

// Help text
const helpText = `
Available commands:

ls - Lists files
pwd - Lists current directory
cd <dir> - Enters directory
cat <filename> - Lists file contents
contact - Prints contact information
contact <key> - Opens up relevant contact link
clear - Clears the display
`;

// Contact texts
const contactInfo = {
  website: "equinox.iiitl.ac.in",
  twitter: "twitter.com/equinoxiiitl",
  discord: "discord.gg/PytHHH8yxN",
};

const contactList = Object.keys(contactInfo)
  .reduce((result, key) => result.concat([`${key} - ${contactInfo[key]}`]), [])
  .join("\n");

const contactText = `
Equinox 2022

${contactList}

Use ex. 'contact discord' to open the link.
`;

const openContact = (key) => {
  window.open(`https://${contactInfo[key]}`);
};

// File browser
const browser = (function () {
  let current = "/";

  let tree = [
    {
      location: "/",
      filename: "documents",
      type: "directory",
    },
    {
      location: "/",
      filename: "Level_1",
      type: "file",
      content: "Hint",
    },
  ];

  const fix = (str) => str.trim().replace(/\/+/g, "/") || "/";

  const setCurrent = (dir) => {
    if (typeof dir !== "undefined") {
      if (dir == "..") {
        const parts = current.split("/");
        parts.pop();
        current = fix(parts.join("/"));
      } else {
        const found = tree
          .filter(
            (iter) => iter.location === current && iter.type === "directory"
          )
          .find((iter) => iter.filename === fix(dir));

        if (found) {
          current = fix(current + "/" + dir);
        } else {
          return `Directory '${dir}' not found in '${current}'`;
        }
      }

      return `Entered '${current}'`;
    }

    return current;
  };

  const ls = () => {
    const found = tree.filter((iter) => iter.location === current);
    const fileCount = found.filter((iter) => iter.type === "file").length;
    const directoryCount = found.filter(
      (iter) => iter.type === "directory"
    ).length;
    const status = `${fileCount} file(s), ${directoryCount} dir(s)`;
    const maxlen = Math.max(
      ...found.map((iter) => iter.filename).map((n) => n.length)
    );

    const list = found
      .map((iter) => {
        return `${iter.filename.padEnd(maxlen + 1, " ")} <${iter.type}>`;
      })
      .join("\n");

    return `${list}\n\n${status} in ${current}`;
  };

  const cat = (filename) => {
    const found = tree.filter(
      (iter) => iter.location === current && iter.type === "file"
    );
    const foundFile = found.find((iter) => iter.filename === filename);

    if (foundFile) {
      return foundFile.content;
    }

    return `File '${filename}' not found in '${current}'`;
  };

  return {
    pwd: () => setCurrent(),
    cd: (dir) => setCurrent(fix(dir)),
    cat,
    ls,
  };
})();

///////////////////////////////////////////////////////////////////////////////
// MAIN
///////////////////////////////////////////////////////////////////////////////

const load = () => {
  const t = terminal({
    prompt: () => `₹ ${browser.pwd()} > `,
    banner,
    commands: {
      help: () => helpText,
      pwd: () => browser.pwd(),
      cd: (dir) => (!dir ? `Please enter a directory name` : browser.cd(dir)),
      ls: () => browser.ls(),
      cat: (file) => browser.cat(file),
      clear: () => t.clear(),
      contact: (key) => {
        if (key in contactInfo) {
          openContact(key);
          return `Opening ${key} - ${contactInfo[key]}`;
        } else if (key) {
          return `No contact found for '${key}'`;
        }
        return contactText;
      },
    },
  });
};

document.addEventListener("DOMContentLoaded", load);
