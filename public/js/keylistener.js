'use strict';

var objectKeys = {
    movementKey : { // клавиши для перемещения
        87 : false, // W
        65 : false, // A
        83 : false, // S
        68 : false  // D
    },
    movement : {
        angle : 0
    }

};

function listenKeyBoard(e) {

    var down = (e.type == 'keydown') ? true : false; // нажата ли клавиша

    if (objectKeys.movementKey.hasOwnProperty(e.keyCode) && objectKeys.movementKey[e.keyCode] != down) {
        objectKeys.movementKey[e.keyCode] = down;
        var move = direction(); // изменит objectKeys.movement.angle
        //console.log(objectKeys.movement.angle, move);
        socket.emit('activities', {
            type : 'move',
            angle : objectKeys.movement.angle,
            move : move
        }); // готовность к игре true/false
    }
}

function direction() {
    var m = objectKeys.movementKey;
    /*
     87 W
     65 A
     83 S
     68 D
     */
    if (m[87]) {
        objectKeys.movement.angle = 90; // вверх
        if (m[65] && !m[68]) {
            objectKeys.movement.angle = 135; // вверх влево
        } else if (!m[65] && m[68]) {
            objectKeys.movement.angle = 45; // вверх вправо
        }
    } else if (m[83]) {
        objectKeys.movement.angle = 270; // вниз
        if (m[65] && !m[68]) {
            objectKeys.movement.angle = 225; // вниз влево
        } else if (!m[65] && m[68]) {
            objectKeys.movement.angle = 315; // вниз вправо
        }
    } else if (m[65]) {
        objectKeys.movement.angle = 180; // вправо
    } else if (m[68]) { ;
        objectKeys.movement.angle = 0; // вниз
    } else
        return false; // нету движухи
    return true; // есть движуха

}