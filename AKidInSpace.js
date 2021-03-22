////////// CONFIG //////////

const config = {
    width: 1400,
    height: 937,
    type: Phaser.AUTO,
    physics:{
        default: 'arcade',
        arcade:{
            gravity: {y: 4000},
            debug: false
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
var mayaJumpVector = 0
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
//var mayaBulletGroup = this.add.group();
//mayaBulletGroup.add(mayaBulletGroup);
var mayaShootTypeUnlocked = false;
var mayaShootType = 0;
var mayaShootRate = 40;
var mayaShootRateCount = 0;
var mayaShootSpeed = 1500;
var mayaCanShoot = true;

////////// PRELOAD //////////

function preload(){

    // Backgrounds

    this.load.image('background', 'assets/spr_Background.png')
    this.load.image('bgSun', 'assets/spr_Soleil.png')

    // Acteurs actifs

    this.load.spritesheet('maya', 'assets/Maya/sprsht_MayaIdle.png', {frameWidth : 256, frameHeight : 256});
    //this.load.spritesheet('mayaBullet', 'assets/Maya/spr_MayaBullet.png', { frameWidth: 44, frameHeight: 44 });
    this.load.spritesheet('mayaBullet', 'assets/Maya/spr_MayaBullet.png', {frameWidth : 44, frameHeight : 44});

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

    maya = this.physics.add.sprite(100, 100, 'maya').setDepth(1)
    maya.body.collideWorldBounds = true

    this.anims.create({
        key :'maya_Idle1',
        frames : this.anims.generateFrameNumbers('maya', {start :0, end: 5}),
        frameRate : 5,
        repeat : -1
    })

    // Maya Bullets

    this.anims.create({
        key :'mayaBulletShot1',
        frames : this.anims.generateFrameNumbers('mayaBullet', {start :0, end: 2}),
        frameRate : 7,
        repeat : -1
    })
    this.anims.create({
        key :'mayaBulletShot2',
        frames : this.anims.generateFrameNumbers('mayaBullet', {start :3, end: 5}),
        frameRate : 7,
        repeat : -1
    })
    this.anims.create({
        key :'mayaBulletShot3',
        frames : this.anims.generateFrameNumbers('mayaBullet', {start :6, end: 8}),
        frameRate : 7,
        repeat : -1
    })
    this.anims.create({
        key :'mayaBulletShot4',
        frames : this.anims.generateFrameNumbers('mayaBullet', {start :9, end: 11}),
        frameRate : 7,
        repeat : -1
    })
    this.anims.create({
        key :'mayaBulletShot5',
        frames : this.anims.generateFrameNumbers('mayaBullet', {start :12, end: 14}),
        frameRate : 7,
        repeat : -1
    })
    this.anims.create({
        key :'mayaBulletShot6',
        frames : this.anims.generateFrameNumbers('mayaBullet', {start :15, end: 17}),
        frameRate : 7,
        repeat : -1
    })

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
        mayaPlatformerControll(this)
    }

    // Curseur et tir

    cursorPosition()

    if (this.input.activePointer.isDown)
    {
        mayaFire(this);
        
    }

    if (!mayaCanShoot){
        if (mayaShootRateCount < mayaShootRate){
            mayaShootRateCount ++;
        } else {
            mayaCanShoot = true;
            mayaShootRateCount = 0;
        }
    }

    if (mayaBullet != null){
        //console.log(Phaser.Geom.Rectangle.Overlaps(this.physics.world.bounds, mayaBullet.getBounds()));
    }


////////// FONTIONS //////////

}

function cursorPosition(){
    mouseCursor.x = game.input.mousePointer.x
    mouseCursor.y = game.input.mousePointer.y
}

function mayaFire(context){
    if (mayaCanShoot){

        mayaCanShoot = false;

        if (!mayaShootTypeUnlocked){
            mayaShootType = 0;    
        }

        console.log(mayaShootType)

        mayaBullet = context.physics.add.sprite(maya.x - 20, maya.y - 51, 'mayaBullet');
        mayaBullet.rotation = Phaser.Math.Angle.BetweenPoints(mayaBullet, mouseCursor);
        mayaBullet.body.setAllowGravity(false);
        mayaBullet.checkWorldBounds = true;
        context.physics.angleTo;
        context.physics.moveTo(mayaBullet, mouseCursor.x, mouseCursor.y, mayaShootSpeed);


        if (mayaShootType == 0){
            mayaBullet.play('mayaBulletShot1');
        } else if (mayaShootType == 1){
            mayaBullet.play('mayaBulletShot2');
        } else if (mayaShootType == 2){
            mayaBullet.play('mayaBulletShot3');
        } else if (mayaShootType == 3){
            mayaBullet.play('mayaBulletShot4');
        } else if (mayaShootType == 4){
            mayaBullet.play('mayaBulletShot5');
        } else if (mayaShootType == 5){
            mayaBullet.play('mayaBulletShot6');
        }

        if (mayaShootTypeUnlocked){
            mayaShootRate = 2;
            mayaShootType ++;
            if (mayaShootType >= 6)
                mayaShootType = 0;  
        } else {
            mayaShootRate = 40;
        }
    }
}

function mayaPlatformerControll(context){

    if (!maya.body.touching.down){
        maya.play('maya_Idle1')
    }

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
        if (mayaJumpTimer <= 20){                                       // Si timer <= 40
            mayaJumpTimer ++                                            // Timer augmente
            maya.setVelocityY(-800 + mayaJumpVector)                                     // Maya monte
            mayaJumpVector += 5
        } else if (mayaJumpTimer <= 30){
            mayaJumpTimer ++
            maya.setVelocityY(-800 + mayaJumpVector)
            mayaJumpVector += 10
        } else if (mayaJumpTimer <= 40){
            mayaJumpTimer ++
            maya.setVelocityY(-800 + mayaJumpVector)
            mayaJumpVector += 20
        }
    } else{
        mayaJumpVector = 0
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