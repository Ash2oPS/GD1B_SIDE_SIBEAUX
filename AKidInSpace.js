////////// CONFIG //////////

const config = {
    width: 1400,
    height: 937,
    type: Phaser.AUTO,
    physics:{
        default: 'arcade',
        arcade:{
            gravity: {y: 4000},
            debug: true
        }
    },
    scene:{
        preload: preload,
        create: create,
        update: update,
        render: render
    }
}

////////// VARIABLES //////////

var game = new Phaser.Game(config)
var background
var bgSun
var maya
var mayaWeightlessness = false

var mayaJumpTimer = 0
var mayaSens = 1
var mayaHp = 255
var mayaMaxHp = 255
var mayaCanJump = false
var mayaHasJumped = false
var mayaStomping = false
var mayaHasStomped = false

var mouseCursor
var cursors
var click
var mayaBullet
var mayaShootRate = 30
var mayaShootSpeed = 20

////////// PRELOAD //////////

function preload(){

    // Backgrounds

    this.load.image('background', 'assets/spr_Background.png')
    this.load.image('bgSun', 'assets/spr_Soleil.png')

    // Acteurs actifs

    this.load.image('maya', 'assets/Maya/spr_Maya.png')
    this.load.spritesheet('mayaBullet', 'assets/Maya/spr_MayaBullet.png', { frameWidth: 44, frameHeight: 44 });

    //Platforms 

    this.load.image('ground', 'assets/spr_Platform1.png');

    // Divers

    this.load.image('mouseCursor', 'assets/spr_Cursor.png')

}

////////// CREATE //////////

function create(){

    // Inputs
    
    cursors = this.input.keyboard.createCursorKeys()
    click = this.input.activePointer.isDown

    // Backgrounds

    background = this.add.image(0, 0, 'background')
    background.setOrigin(0, 0)

    bgSun = this.add.image(1400, 320, 'bgSun')



    // Maya

    maya = this.physics.add.image(100, 100, 'maya')
    maya.body.collideWorldBounds = true

    //Platforms

    platforms = this.physics.add.staticGroup()
    platforms.create(400, 937, 'ground').setScale(100, 1).refreshBody()
    this.physics.add.collider(maya, platforms);


    // Divers

    mouseCursor = this.add.image(game.input.mousePointer.x, game.input.mousePointer.y, 'mouseCursor')
}

////////// UPDATE //////////

function update(){

    // Backgrounds

    bgSun.rotation += .0005

    // Maya

    maya.setVelocityX(0)

    if (!mayaWeightlessness){
        mayaPlatformerControll()
    }

    // Curseur et tir

    cursorPosition()

    if (this.input.activePointer.isDown)
    {
        mayaFire()
    }

}

function cursorPosition(){
    mouseCursor.x = game.input.mousePointer.x
    mouseCursor.y = game.input.mousePointer.y
}

function mayaFire(){
}

function mayaPlatformerControll(){

    // Jump
    if (maya.body.touching.down && !mayaHasJumped){                     // Si maya touche le sol et n'a pas sauté
        mayaCanJump = true                                              // Maya peut sauter
    }else if (!maya.body.touching.down && mayaHasJumped && cursors.up.isDown){  // Sinon si elle touche pas le sol si elle a sauté mais que le bouton haut est enfoncé                                                          // Sinon
        mayaCanJump = true                                              // Maya peut sauter
    } else{                                                             // Sinon
        mayaCanJump = false                                             // Maya ne peut pas sauter
    }

    if(cursors.up.isDown && mayaCanJump){                               // Si on appuie sur Haut & Maya peut sauter
        mayaHasJumped = true                                            // Maya a sauté
        if (mayaJumpTimer <= 40){                                       // Si timer <= 40
            mayaJumpTimer ++                                            // Timer augmente
            maya.setVelocityY(-800)                                     // Maya monte
        }
    }
    if(!cursors.up.isDown){                                             // Si on appuie pas sur Haut
        if (maya.body.touching.down){                                   // Si Maya touche le sol
            mayaHasJumped = false                                       // Maya n'a pas sauté
            mayaJumpTimer = 0                                           // Réinitialise le timer du saut
        }
    }


    // Left and Right
    if(cursors.left.isDown){
        maya.setVelocityX(-450)
    }

    if(cursors.right.isDown){
        maya.setVelocityX(450)
    }

    // Stomp
    if(cursors.down.isDown && !maya.body.touching.down && !mayaStomping){  // Si Bas est appuyé, si Maya ne touche pas le sol et qu'elle n'esrt pas déjà en train de stomper
        mayaStomping = true                                             // Maya est en train de stomper (ça veut pas dire grand-chose mais tant pis, je trouve pas la traduction FR, mais bon, d'un autre côté, tout le monde comprend, enfin je crois, sinon, bah tant pis)
        mayaCanJump = false                                             // Maya ne peut pas sauter
    }
    
    if (mayaStomping){                                                  // Si Maya est en train de stomper                                             
        maya.setVelocity(0, 3000)                                       // Maya charge le sol en annulant les autres directions
        if (maya.body.touching.down){                                   // Si Maya entre en contact avec le sol                              
            mayaStomping = false
        }
    } else {
        mayaHasStomped = false
    }

}



function render(){}