const fs = require('fs');
const file = 'c:/Vinit/go-sync-v/crm-web/src/pages/rates/RatesPage.tsx';
let content = fs.readFileSync(file, 'utf8');

const addStartIndex = content.indexOf('{/* Anytime and Supply Charge */}');
let endMarker = '                    </div>\r\n                </div>\r\n            </Modal>\r\n\r\n            {/* Edit Rate Modal */}';
let addEndIndex = content.indexOf(endMarker, addStartIndex);

if (addEndIndex === -1) {
    endMarker = '                    </div>\n                </div>\n            </Modal>\n\n            {/* Edit Rate Modal */}';
    addEndIndex = content.indexOf(endMarker, addStartIndex);
}

if (addEndIndex === -1) {
    console.error('Could not find addEndIndex');
    process.exit(1);
}

// Add block includes '{/* Anytime and Supply Charge */}' up to right before endMarker
const addChunk = content.substring(addStartIndex, addEndIndex);

// Find Edit Block
const editStartIndex = content.indexOf('{/* Anytime and Supply Charge */}', addEndIndex);

let editEndMarker = '                    </div>\r\n                )}\r\n            </Modal>';
let editEndIndex = content.indexOf(editEndMarker, editStartIndex);

if (editEndIndex === -1) {
    editEndMarker = '                    </div>\n                )}\n            </Modal>';
    editEndIndex = content.indexOf(editEndMarker, editStartIndex);
}

if (editEndIndex === -1) {
    console.error('Could not find editEndIndex');
    process.exit(1);
}

// Indent addChunk by 4 spaces
const indentedChunk = addChunk.split(/\r?\n/).map(line => {
    if (line.trim() === '') return line;
    return '    ' + line;
}).join('\n');

const newContent = content.substring(0, editStartIndex) + indentedChunk + content.substring(editEndIndex);

fs.writeFileSync(file, newContent);
console.log('Successfully copied the pricing UI block to the Edit Rate Modal.');
