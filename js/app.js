// Init F7 Vue Plugin
Framework7.use(Framework7Vue);
var $$ = Dom7;

const congressURL = 'https://gunskillpeople-dev.geekpak.com/app-server/index.php?func=congress';
const shootingsURL = 'https://gunskillpeople-dev.geekpak.com/app-server/index.php?func=shootings';
// const refreshAudio = new Audio('./refresh.mp3');

// Init Page Components
Vue.component('page-rep', {
  template: '#page-rep',
  props: {
    contactID: String
  },
  data() {
    const self = this;
    const congress = self.$root.congress;
    const thisRep = congress.reps.filter(function(rep) { return rep.contactID === self.contactID; })[0];
    return {
      rep: thisRep
    };
  }
});


Vue.component('page-about', {
  template: '#page-about'
});
Vue.component('page-academy', {
  template: '#page-academy'
});
Vue.component('page-form', {
  template: '#page-form'
});
Vue.component('page-dynamic-routing', {
  template: '#page-dynamic-routing'
});
Vue.component('page-not-found', {
  template: '#page-not-found'
});

// Init App
new Vue({
  el: '#app',
  data: function () {
    return {
      // Framework7 parameters here
      f7params: {
        root: '#app', // App root element
        id: 'com.gunskillpeople', // App bundle ID
        name: 'Guns Kill People', // App name
        theme: 'ios', // Automatic theme detection
        version: '0.0.1', // App version
        // App routes
        routes: [
          {
            path: '/rep/:contactID/',
            component: 'page-rep'
          },
          {
            path: '/devnotes/',
            content: `
              <div class="page">
                <div class="navbar">
                  <div class="navbar-inner sliding">
                    <div class="left">
                      <a href="#" class="link back">
                        <i class="icon icon-back"></i>
                        <span class="ios-only">Back</span>
                      </a>
                    </div>
                    <div class="title">Dev Notes</div>
                  </div>
                </div>
                <div class="page-content">
                  <div class="card">
                    <div class="card-header">xxxxx</div>
                    <div class="card-content card-content-padding">xxxxx</div>
                  </div>
                </div>
              </div> 
           `
          },
          {
            path: '/about/',
            component: 'page-about'
          },
          {
            path: '/academy/',
            component: 'page-academy'
          },
          {
            path: '/form/',
            component: 'page-form'
          },
          {
            path: '/dynamic-route/blog/:blogId/post/:postId/',
            component: 'page-dynamic-routing'
          },
          {
            path: '(.*)',
            component: 'page-not-found',
          },
        ],
      },
      shootings: [],
      congress: {
        reps: []
      },
      isBottom: false,
    };
  },
  methods: {
    reloadShootings(event, done) {
      // refreshAudio.play();
      const self = this;
      const app = self.$f7;
      app.request.json(shootingsURL, function (data) {
        self.shootingsURL = data;
        done();
      });    
    },
    fetchEventsList: function() {
      const self = this;
      const app = self.$f7;
      // console.log('reloading');
      app.request.json(congressURL, function (data) {
        self.congress = data;
      });
      app.request.json(shootingsURL, function (data) {
        self.shootings = data;
      });
    }
  },
  mounted: function() {
    const self = this;
    const app = self.$f7;
    app.request.json(congressURL, function (data) {
      self.congress = data;
    });
    app.request.json(shootingsURL, function (data) {
      self.shootings = data;
    });
  },
  beforeDestroy() {
  },
  created: function() {
    $$('body').css('backgroundColor', '#ffffff');
    $$('#app').show();
  }
});

addToHomescreen({
  modal: true,
  maxDisplayCount: 0,
  startDelay: 2, // wait 2 seconds to display
  message: 'To add Guns Kill People to your home screen: tap %icon and then <strong>Add to Home Screen</strong>',
  displayPace: 5, // display every 5 minutes
  lifespan: 15
});

