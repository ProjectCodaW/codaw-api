import Ember from 'ember';

export default Ember.Component.extend({
    count:0,
 
    setupSubscription: Ember.on('init', function() {

        var subscription = this.get('consumer').subscriptions.create("PingChannel", {
            received: (data) => {
                
                this.set('count',this.get('count')+1);
                
                // Add in check that logged in user is not the sending user
                // if (data.username !== self.username) {
                if (this.get('trackNum') === data.trackNum) {
                    this.drawPing(
                        data.pingLocationInTicks,
                        data.userName,
                        data.color
                    );
                }   
                // } 
                              
            }
        });
        
        this.set('subscription', subscription);
    }),
    
    //id: function() { return "track-" + (Math.random() * 10000).toFixed(0)},
    didInsertElement: function(){
        // Scroll the mute and solo buttons as we scroll up and down
        var topOffset = parseInt($(".mute-solo").css('margin-top'));

        Ember.$('.tracks-box').scroll(function(){
            Ember.$('.mute-solo').css({
                'margin-top': -Ember.$(this).scrollTop() + topOffset
            });
        });

        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $('#' + this.id).addClass('animated fadeIn').one(animationEnd, function() {
          $('#' + this.id).removeClass('animated fadeIn');
        });
    },

  click: function(evt) {

    var pxPerTick= 0.01; //this will be gotten from the CD.view constant
    this.drawPing( (evt.clientX - this.$().offset().left)/pxPerTick, "Rails A.B. Geller", "#A3E");
    
    var pingLocationInTicks = (evt.clientX - this.$().offset().left)/pxPerTick;
    this.get('subscription').send({
        pingLocationInTicks: pingLocationInTicks, 
        userName: "username", 
        trackNum: this.get('trackNum'), 
        color: "#A3E"
    });
  },

  drawPing(tick, userName, userColor) {
    console.log("i was called at tick " + tick +"!");
    var me = this.$();
    var pxPerTick= 0.01; //this will be gotten from the CD.view constant
    var div =  "ping" + tick.toFixed(0);
    me.append("<div id='" + div + "' class='ping'></div>");
    var ping = Ember.$('#' + div);
    if(ping.is(':empty')) {
      console.log(ping);
      ping.css({
        "position": "absolute",
        "top": "0px",
        "left": tick * pxPerTick + "px",
        "height": "140px",
        "width": "80px",
        "opacity": 0.9,
        "background-color": userColor
      });

      ping.append("<h4>" + userName + "</h4>");


      //start animatin'
      var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      ping.addClass('animated fadeIn').one(animationEnd, function () {
        console.log('animation 1...');
        ping.removeClass('animated fadeIn');
        ping.addClass('animated flip').one(animationEnd, function () {
          console.log('animation 2...');
          ping.removeClass('animated flip');
          ping.addClass('animated flipOutX').one(animationEnd, function () {
            console.log('animation 3');
            ping.removeClass('animated flipOutX');
            ping.addClass('animated bounce').one(animationEnd, function () {
              ping.removeClass('animated bounce');
              ping.addClass('animated flipOutY').one(animationEnd, function () {
                ping.removeClass('animated flipOutY');
                //I'm done
                ping.remove();
              });
            });
          });
        });
      });
    }
  },

  actions: {

  }
});
