const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

const left = "l";
const right = "r";
const top = "t";
const bottom = "b";

const messOutOfGrid = "Out of grid...";
const messInAWhole = "You felt in a whole.";
const messWin = "Congrulation !";



class Field {
    constructor(field) {
        this._field = field;
        this._pPosX = 0;
        this._pPosY = 0;
        this._lengthX = field[0].length;
        this._lengthY = field.length;
    }

    static generateField(height, width, holePercentage) {
        if (height < 3 || width < 3) {
          throw new Error("Field dimensions must be at least 3x3.");
        }
      
        if (holePercentage < 0 || holePercentage > 100) {
          throw new Error("Hole percentage should be between 0 and 100.");
        }
      
        const field = [];
        for (let row = 0; row < height; row++) {
          const rowData = [];
          for (let col = 0; col < width; col++) {
            rowData.push('░'); // Initialize the field with neutral background
          }
          field.push(rowData);
        }
      
        // Place the player at the upper-left corner
        field[0][0] = '*';
      
        // Generate random holes based on the holePercentage
        for (let i = 0; i < Math.floor(height * width * holePercentage / 100); i++) {
          let holeRow, holeCol;
          do {
            holeRow = Math.floor(Math.random() * height);
            holeCol = Math.floor(Math.random() * width);
          } while (field[holeRow][holeCol] === 'O' || (holeRow === 0 && holeCol === 0));
      
          field[holeRow][holeCol] = 'O';
        }
      
        // Place the hat (^) at a random position
        let hatRow, hatCol;
        do {
          hatRow = Math.floor(Math.random() * height);
          hatCol = Math.floor(Math.random() * width);
        } while (field[hatRow][hatCol] === 'O' || (hatRow === 0 && hatCol === 0));
      
        field[hatRow][hatCol] = '^';
      
        return field;
    }
    testMove(direction) {
        switch (direction) {
            case left:
                if (this._pPosX === 0) {
                    return messOutOfGrid;
                } else if (this._field[this._pPosY][this._pPosX - 1] === hole) {
                    return messInAWhole;
                } else if(this._field[this._pPosY][this._pPosX - 1] === hat) {
                    return messWin;
                } else {
                    return '';
                }
                break;
            case right:
                if (this._pPosX === this._lengthX) {
                    return messOutOfGrid;
                } else if (this._field[this._pPosY][this._pPosX + 1] === hole) {
                    return messInAWhole;
                } else if(this._field[this._pPosY][this._pPosX + 1] === hat) {
                    return messWin;
                } else {
                    return '';
                }
                break;
            case top:
                if (this._pPosY === 0) {
                    return messOutOfGrid;
                } else if (this._field[this._pPosY - 1][this._pPosX] === hole) {
                    return messInAWhole;
                } else if(this._field[this._pPosY - 1][this._pPosX] === hat) {
                    return messWin;
                } else {
                    return '';
                }
                break;
            case bottom:
                if (this._pPosY === this._lengthY) {
                    return messOutOfGrid;
                } else if (this._field[this._pPosY + 1][this._pPosX] === hole) {
                    return messInAWhole;
                } else if(this._field[this._pPosY + 1][this._pPosX] === hat) {
                    return messWin;
                } else {
                    return '';
                }
                break;
        }
    }

    move(direction) {
        const answer = this.testMove(direction);
        if (!answer) {
            switch(direction) {
                case left:
                    this._pPosX -= 1;
                    this._field[this._pPosY][this._pPosX] = pathCharacter;
                    break;
                case right:
                    this._pPosX += 1;
                    this._field[this._pPosY][this._pPosX] = pathCharacter;
                    break;
                case top:
                    this._pPosY -= 1;
                    this._field[this._pPosY][this._pPosX] = pathCharacter;
                    break;
                case bottom:
                    this._pPosY += 1;
                    this._field[this._pPosY][this._pPosX] = pathCharacter;
                    break;
            }
        }
        return answer;
    }
    print() {
        for (let line of this._field) {
            console.log(line.join(''));
        }
    }
}

// Module to read input of users
function askForDirection() {
    return new Promise((resolve) => {
        const rl = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Which way?', (direction) => {
            rl.close();
            resolve(direction);
        });
    });
}

async function main() {

    const myField = new Field([
        ['*', '░', 'O'],
        ['░', 'O', '░'],
        ['░', '^', '░'],
    ]);
    
    const randomField = new Field(Field.generateField(5, 10, 30));
    console.log(randomField.print());
    let answer="";
    do {
        myField.print();
        const direction = await askForDirection();
        answer = myField.move(direction);
        console.log(`x: ${myField._pPosX}, y: ${myField._pPosY}`); 
    } while(!answer);

    console.log(answer);
};



// launch app
main();
